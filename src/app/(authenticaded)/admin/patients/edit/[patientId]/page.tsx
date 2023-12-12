'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './patientsedit.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { format } from 'date-fns';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataPatientsModel } from 'models/DataPatientsModel';
import { DataStateModel, DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getAllCities } from 'services/cities';
import { getPatientById, updatePatient } from 'services/patients';
import { getAllStates } from 'services/states';
import { getAllUnits } from 'services/units';
import { statusGeneral } from 'utils/enums';
import { buscarInformacoesCEP } from 'utils/helpers';

type DataProps = {
  [name: string]: string | number;
};

export default function EditPatientPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [cep, setCep] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    resetField,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getStates();
    getUnits();
    getPatientPerId();
  }, [params?.patientId]);

  async function getStates() {
    const response = await getAllStates();
    const statesUpdated = response.data as unknown as DataStatesModel;
    setStates(
      statesUpdated.sort((a, b) => a.description.localeCompare(b.description))
    );
  }

  async function getCities(stateCode: string = '', city_code: string = '') {
    setIsLoadingCities(true);
    const response = await getAllCities();
    let citiesUpdated = response.data as unknown as DataCitiesModel[];

    if (stateCode === '' || stateCode === undefined || stateCode === null) {
      const responseCity = citiesUpdated.find(
        (item) => item.code === city_code
      );
      setValue(
        'state',
        responseCity !== undefined ? responseCity.state_code : ''
      );
      citiesUpdated = citiesUpdated.filter(
        (city: DataCitiesModel) => city.state_code === responseCity?.state_code
      );
    } else {
      citiesUpdated = citiesUpdated.filter(
        (city: DataCitiesModel) => city.state_code === stateCode
      );
    }
    setCities(
      citiesUpdated
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description))
    );
    setIsLoadingCities(false);
  }

  async function getPatientPerId() {
    const response = await getPatientById(Number(params?.patientId));
    const patient = response.data as DataPatientsModel;
    getCities('', patient.city_code !== undefined ? patient.city_code : '');
    setValue('cpf', patient.cpf);
    setValue('name', patient.name);
    setValue('email', patient.email);
    setValue('phonePrimary', patient.phone_primary);
    setValue(
      'phoneSecondary',
      patient.phone_secondary !== null &&
        patient.phone_secondary !== undefined &&
        patient.phone_secondary !== ''
        ? patient.phone_secondary
        : ''
    );
    setValue('zipCode', patient.zip_code);
    setValue('birthDate', format(new Date(patient.birthday), 'yyyy-MM-dd'));
    setValue('citieCode', patient.city_code);
    setValue('street', patient.street);
    setValue('number', patient.number);
    setValue('block', patient.block);
    setValue('lot', patient.lot);
    setValue(
      'complement',
      patient.complement !== null ? patient.complement : ''
    );
    setValue('status', patient.status);
    setValue('unit', patient.unit.toString());
    setValue('status', patient.status + 1);

    setLoading(false);
  }

  async function getUnits() {
    const response = await getAllUnits();
    const unitsUpdated = response.data.data as DataUnitsModel[];
    setUnits(unitsUpdated.slice().sort((a, b) => a.name.localeCompare(b.name)));
  }

  const handleStateCode = (selectedStateCode: any) => {
    reset();
    resetField('cityCode');
    resetField('state');
    getCities(selectedStateCode.toString());
  };

  async function onSubmit(data: DataProps) {
    const status = Number(data.status) - 1;
    const EditPatient: DataPatientsModel = {
      id: Number(params?.patientId),
      cpf: data.cpf.toString(),
      name: data.name.toString(),
      email: data.email.toString(),
      phone_primary: data.phonePrimary.toString(),
      phone_secondary: data.phoneSecondary.toString(),
      zip_code: data.zipCode.toString(),
      birthday: data.birthDate.toString(),
      city_code: data.citieCode.toString(),
      street: data.street.toString(),
      number: data.number.toString(),
      block: data.block?.toString(),
      lot: data.lot?.toString(),
      complement: data.complement?.toString(),
      status: Number(status),
      unit: Number(data.unit)
    };

    const response = await updatePatient(
      Number(params?.patientId),
      EditPatient
    );
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {
        router.back();
      }, 3500);
    }
  }

  async function getDataCEP(cep: string) {
    const result = await buscarInformacoesCEP(cep);
    if (result !== null) {
      setValue('street', result.logradouro.toString());
      states.filter((state: DataStateModel) => {
        if (state.UF === result.uf) {
          setValue('state', state.code);
          getCities(state.code.toString());
          setValue('cityCode', result.ibge);
        }
      });
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      {loading ? (
        <SpinnerLoading />
      ) : (
        <div className={styles.bodyEditPatient}>
          <div className={styles.headerEditPatient}>
            <SmallMediumText
              text={Strings.updatePatient}
              bold={true}
              color={Colors.gray90}
              style={{ lineHeight: '5px' }}
            />
          </div>
          <div className={styles.formEditPatient}>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderCPF}
                type="text"
                label={Strings.labelCPF}
                name="cpf"
                mask={'cpfCnpj'}
                readonly={true}
                maxLength={14}
                control={control}
                error={errors.cpf?.message}
                containerStyle={{ width: '25%' }}
                className={styles.inputEditPatient}
              />
              <InputForm
                placeholder={Strings.placeholderName}
                type="text"
                label={Strings.labelName}
                name="name"
                control={control}
                containerStyle={{ width: '40%' }}
                className={styles.inputEditPatient}
                error={errors.name?.message}
              />
              <SelectForm
                control={control}
                item={Strings.unit}
                name="unit"
                data={units !== null ? units : null}
                error={errors.state?.message}
                containerStyle={{ width: '25%' }}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderName}
                type="date"
                label={Strings.labelBirthDate}
                name="birthDate"
                control={control}
                containerStyle={{ width: '22%' }}
                className={styles.inputEditPatient}
                error={errors.name?.message}
              />
              <InputForm
                placeholder={Strings.placeholderEmail}
                label={Strings.labelEmail}
                type="email"
                name="email"
                control={control}
                className={styles.inputEditPatient}
                containerStyle={{ width: '40%' }}
                error={errors.email?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhonePrimary}
                type="text"
                name="phonePrimary"
                control={control}
                label={Strings.labelPhone}
                mask={'phone'}
                containerStyle={{ width: '15%' }}
                className={styles.inputEditPatient}
                error={errors.phonePrimary?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhoneSecondary}
                type="text"
                name="phoneSecondary"
                label={Strings.labelPhone}
                control={control}
                mask={'phone'}
                containerStyle={{ width: '15%' }}
                className={styles.inputEditPatient}
                error={errors.phoneSecondary?.message}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                label={Strings.labelZipCode}
                placeholder={Strings.placeholderZipCode}
                type="text"
                name="zipCode"
                mask={'cep'}
                maxLength={9}
                control={control}
                className={styles.inputEditPatient}
                error={errors.zipCode?.message}
                getValue={setCep}
                onBlur={() => {
                  getDataCEP(cep);
                }}
              />
              <InputForm
                placeholder={Strings.placeholderStreet}
                label={Strings.labelStreet}
                type="text"
                name="street"
                control={control}
                className={styles.inputEditPatient}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
                label={Strings.labelNumber}
                type="text"
                name="number"
                control={control}
                className={styles.inputEditPatient}
                error={errors.number?.message}
              />
              <InputForm
                placeholder={Strings.placeholderBlock}
                label={Strings.labelBlock}
                type="text"
                name="block"
                control={control}
                className={styles.inputEditPatient}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                label={Strings.labelLot}
                type="text"
                name="lot"
                control={control}
                className={styles.inputEditPatient}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
                label={Strings.labelComplement}
                type="text"
                name="complement"
                control={control}
                error={errors.complement?.message}
                className={styles.inputEditPatient}
              />
            </div>
            <div style={{ marginBottom: '2vh', width: '100%' }}>
              <div
                style={{ marginBottom: '1vh', width: '100%' }}
                className={styles.EditPatientDataGeografic}
              >
                <SelectForm
                  control={control}
                  name="state"
                  item={Strings.labelState}
                  data={states}
                  error={errors.state?.message}
                  onSelectChange={handleStateCode}
                  disabled={true}
                  label={Strings.labelState}
                  containerStyle={{ width: '25%' }}
                />
                <SelectForm
                  control={control}
                  item={Strings.labelCity}
                  name="citieCode"
                  data={cities !== null ? cities : null}
                  disabled={true}
                  isLoading={isLoadingCities}
                  error={errors.citieCode?.message}
                  label={Strings.labelCity}
                  containerStyle={{ width: '25%' }}
                />
                <SelectForm
                  control={control}
                  item={Strings.status}
                  name="status"
                  data={statusGeneral}
                  label={Strings.status}
                  error={errors.status?.message}
                  containerStyle={{ width: '25%' }}
                />
                <div style={{ height: '40px', minWidth: '20%' }}>
                  <Button type="cancel" title={Strings.resetPasswordPatient} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footerEditPatient}>
            <div className={styles.btnSaveEditPatient}>
              <Button
                type="secondary"
                title={Strings.edit}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnCancelEditPatient}>
              <Button
                type="cancel"
                title={Strings.cancel}
                onClick={() => {
                  router.back();
                }}
              />
            </div>
          </div>
        </div>
      )}
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={Strings.messageSuccessUpdatePatient}
      />
    </React.Fragment>
  );
}
