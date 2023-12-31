'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalError from 'components/ModalError';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SmallMediumText } from 'components/Text';

import styles from './patientsnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataPatientsModel } from 'models/DataPatientsModel';
import { DataStateModel, DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getAllCities } from 'services/cities';
import { createPatient } from 'services/patients';
import { getAllStates } from 'services/states';
import { getAllUnitsWithoutPagination } from 'services/units';
import { statusGeneral } from 'utils/enums';
import { buscarInformacoesCEP } from 'utils/helpers';

type DataProps = {
  [name: string]: string | number;
};

export default function NewPatientPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [cep, setCep] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const [showModalError, setShowModalError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getStates();
    getUnits();
  }, []);

  async function getStates() {
    const response = await getAllStates();
    const statesUpdated = response.data as unknown as DataStatesModel;
    setStates(
      statesUpdated.sort((a, b) => a.description.localeCompare(b.description))
    );
  }

  async function getCities(state_code: string) {
    setIsLoadingCities(true);
    const response = await getAllCities();
    let citiesUpdated = response.data as unknown as DataCitiesModel[];
    citiesUpdated = citiesUpdated.filter(
      (city: DataCitiesModel) => city.state_code === state_code
    );
    setCities(
      citiesUpdated
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description))
    );
    setIsLoadingCities(false);
  }

  async function getUnits() {
    const response = await getAllUnitsWithoutPagination();
    const unitsUpdated = response.data as unknown as DataUnitsModel[];
    setUnits(unitsUpdated.slice().sort((a, b) => a.name.localeCompare(b.name)));
    setIsLoading(false);
  }

  const handleStateCode = (selectedStateCode: any) => {
    getCities(selectedStateCode.toString());
  };

  async function onSubmit(data: DataProps) {
    const status = Number(data.status) - 1;
    const newPatient: DataPatientsModel = {
      cpf: data.cpf.toString(),
      name: data.name.toString(),
      email: data.email.toString(),
      phone_primary: data.phonePrimary.toString(),
      phone_secondary: data.phoneSecondary
        ? data.phoneSecondary.toString()
        : '',
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

    const response = await createPatient(newPatient);
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {
        router.back();
      }, 3500);
    } else {
      setMessage(Strings.messageErrorInsertPatient);
      setShowModalError(true);
      setTimeout(() => {
        setShowModalError(false);
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
          setValue('citieCode', result.ibge);
        }
      });
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyNewPatient}>
        <div className={styles.headerNewPatient}>
          <SmallMediumText
            text={Strings.insertPatient}
            bold={true}
            color={Colors.gray90}
            style={{ lineHeight: '5px' }}
          />
        </div>
        <div className={styles.formNewPatient}>
          <div style={{ marginBottom: '3vh' }}>
            <InputForm
              placeholder={Strings.placeholderCPF}
              type="text"
              name="cpf"
              mask={'cpfCnpj'}
              label={Strings.labelCPF}
              maxLength={14}
              control={control}
              error={errors.cpf?.message}
              containerStyle={{ width: '25%' }}
              className={styles.inputNewPatient}
            />
            <InputForm
              placeholder={Strings.placeholderName}
              type="text"
              name="name"
              label={Strings.labelName}
              control={control}
              containerStyle={{ width: '40%' }}
              className={styles.inputNewPatient}
              error={errors.name?.message}
            />
            <SelectForm
              control={control}
              name="unit"
              isLoading={isLoading}
              label={Strings.unit}
              item={Strings.unit}
              data={units !== null ? units : null}
              error={errors.unit?.message}
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
              className={styles.inputNewPatient}
              error={errors.birthDate?.message}
            />
            <InputForm
              placeholder={Strings.placeholderEmail}
              type="email"
              name="email"
              label={Strings.labelEmail}
              control={control}
              className={styles.inputNewPatient}
              containerStyle={{ width: '40%' }}
              error={errors.email?.message}
            />
            <InputForm
              placeholder={Strings.placeholderPhonePrimary}
              type="text"
              name="phonePrimary"
              label={Strings.labelPhone}
              control={control}
              mask={'phone'}
              containerStyle={{ width: '15%' }}
              className={styles.inputNewPatient}
              error={errors.phonePrimary?.message}
            />
            <InputForm
              placeholder={Strings.placeholderPhoneSecondary}
              type="text"
              label={Strings.labelPhone}
              name="phoneSecondary"
              control={control}
              mask={'phone'}
              containerStyle={{ width: '15%' }}
              className={styles.inputNewPatient}
              error={errors.phoneSecondary?.message}
            />
          </div>
          <div style={{ marginBottom: '3vh' }}>
            <InputForm
              placeholder={Strings.placeholderZipCode}
              type="text"
              label={Strings.labelZipCode}
              containerStyle={{ width: '10%' }}
              name="zipCode"
              mask={'cep'}
              maxLength={9}
              control={control}
              className={styles.inputNewPatient}
              error={errors.zipCode?.message}
              getValue={setCep}
              onBlur={() => {
                getDataCEP(cep);
              }}
            />
            <InputForm
              placeholder={Strings.placeholderStreet}
              type="text"
              label={Strings.labelStreet}
              containerStyle={{ width: '30%' }}
              name="street"
              control={control}
              className={styles.inputNewPatient}
              error={errors.street?.message}
            />
            <InputForm
              placeholder={Strings.placeholderNumber}
              label={Strings.labelNumber}
              type="text"
              containerStyle={{ width: '10%' }}
              name="number"
              control={control}
              className={styles.inputNewPatient}
              error={errors.number?.message}
            />
            <InputForm
              placeholder={Strings.placeholderBlock}
              label={Strings.labelBlock}
              type="text"
              containerStyle={{ width: '10%' }}
              name="block"
              control={control}
              className={styles.inputNewPatient}
              error={errors.block?.message}
            />
            <InputForm
              placeholder={Strings.placeholderLot}
              label={Strings.labelLot}
              type="text"
              containerStyle={{ width: '10%' }}
              name="lot"
              control={control}
              className={styles.inputNewPatient}
              error={errors.lot?.message}
            />
            <InputForm
              placeholder={Strings.placeholderComplement}
              label={Strings.labelComplement}
              type="text"
              name="complement"
              containerStyle={{ width: '25%' }}
              control={control}
              error={errors.complement?.message}
              className={styles.inputNewPatient}
            />
          </div>
          <div style={{ marginBottom: '2vh', width: '100%' }}>
            <div
              style={{ marginBottom: '1vh', width: '100%' }}
              className={styles.newPatientDataGeografic}
            >
              <SelectForm
                control={control}
                name="state"
                item={Strings.labelState}
                data={states}
                error={errors.state?.message}
                label={Strings.labelState}
                onSelectChange={handleStateCode}
                containerStyle={{ width: '25%' }}
              />
              <SelectForm
                control={control}
                item={Strings.labelCity}
                name="citieCode"
                data={cities !== null ? cities : null}
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
        <div className={styles.footerNewPatient}>
          <div className={styles.btnSaveNewPatient}>
            <Button
              type="secondary"
              title={Strings.save}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
          <div className={styles.btnCancelNewPatient}>
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
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={Strings.messageSuccessInsertPatient}
      />
      <ModalError
        show={showModalError}
        onHide={() => setShowModalError(false)}
        message={message}
      />
    </React.Fragment>
  );
}
