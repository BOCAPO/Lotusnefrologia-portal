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

import styles from './specialistsedit.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';
import { DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getAllCities } from 'services/cities';
import { getSpecialistById, updateSpecialistById } from 'services/specialists';
import { getAllSpecialties } from 'services/specialties';
import { getAllStates } from 'services/states';
import { getAllUnits } from 'services/units';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function EditSpecialistPage() {
  const [states, setStates] = React.useState<any>(null);
  const params = useParams();
  const [cities, setCities] = React.useState<any>(null);
  const [specialties, setSpecialties] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [unitsSelected, setUnitsSelected] = React.useState<any>([]);
  const [quantityUnitsSelected, setQuantityUnitsSelected] = React.useState(0);

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
    getSpecialities();
    getUnits();
    getSpecialistPerId();
  }, [params?.specialistId]);

  async function getSpecialistPerId() {
    const response = await getSpecialistById(Number(params?.specialistId));
    const specialist = response.data as DataSpecialistsModel;
    getCities(
      '',
      specialist.citie_code !== undefined ? specialist.citie_code : ''
    );
    getUnitsSelected(specialist);
    setValue('cpf', specialist.cpf);
    setValue('name', specialist.name);
    setValue('email', specialist.email);
    setValue('phonePrimary', specialist.phone_primary);
    setValue('phoneSecondary', specialist.phone_secondary);
    setValue('citieCode', specialist.citie_code);
    setValue('zipCode', specialist.zip_code);
    setValue('street', specialist.street);
    setValue('number', specialist.number);
    setValue('block', specialist.block!);
    setValue('lot', specialist.lot!);
    setValue('complement', specialist.complement!);
    setValue('status', specialist.status + 1);

    setLoading(false);
  }

  async function onSubmit(data: DataProps) {
    const editSpecialist: DataSpecialistsModel = {
      cpf: data.cpf.toString(),
      name: data.name.toString(),
      email: data.email.toString(),
      phone_primary: data.phonePrimary.toString(),
      phone_secondary: data.phoneSecondary.toString(),
      zip_code: data.zipCode.toString(),
      street: data.street.toString(),
      number: data.number.toString(),
      block: data.block.toString(),
      lot: data.lot.toString(),
      complement: data.complement.toString(),
      units: [],
      citie_code: data.citieCode.toString(),
      specialties: [],
      status: Number(data.status) - 1
    };

    const response = await updateSpecialistById(
      Number(params?.specialistId),
      editSpecialist
    );
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {}, 3000);
    }
  }

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

  async function getSpecialities() {
    const response = await getAllSpecialties();
    const specialtiesUpdated = response.data.data as DataSpecialtiesModel[];
    setSpecialties(
      specialtiesUpdated
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description))
    );
  }

  async function getUnitsSelected(
    data: DataSpecialistsModel[] | DataSpecialistsModel
  ) {
    if (Array.isArray(data)) {
      const unitsSelectedUpdated = [...unitsSelected];
      data.forEach((specialist: DataSpecialistsModel) => {
        specialist.units.forEach((unit: any) => {
          unitsSelectedUpdated.push(unit.id);
        });
      });
      setUnitsSelected(unitsSelectedUpdated);
    } else {
      const unitsSelectedUpdated = [...unitsSelected];
      data.units.forEach((unit: any) => {
        unitsSelectedUpdated.push(unit.id);
      });
      setUnitsSelected(unitsSelectedUpdated);
    }
  }

  async function getUnits() {
    const response = await getAllUnits();
    const unitsUpdated = response.data.data as DataUnitsModel[];
    setUnits(unitsUpdated.slice().sort((a, b) => a.name.localeCompare(b.name)));
  }

  const handleStateCode = (selectedStateCode: any) => {
    getCities(selectedStateCode.toString());
  };

  return (
    <React.Fragment>
      <MenuTop />
      {loading ? (
        <SpinnerLoading />
      ) : (
        <div className={styles.bodyEditSpecialist}>
          <div className={styles.headerEditSpecialist}>
            <SmallMediumText
              text={Strings.updateSpecialist}
              bold={true}
              color={Colors.gray90}
              style={{ lineHeight: '5px' }}
            />
          </div>
          <div className={styles.formEditSpecialist}>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderCPF}
                type="text"
                name="cpf"
                mask={'cpfCnpj'}
                maxLength={14}
                readonly={true}
                control={control}
                error={errors.cpf?.message}
                containerStyle={{ width: '25%' }}
                style={{ height: '40px', padding: '22px' }}
              />
              <InputForm
                placeholder={Strings.placeholderName}
                type="text"
                name="name"
                control={control}
                containerStyle={{ width: '70%' }}
                style={{ height: '40px', padding: '22px' }}
                error={errors.name?.message}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderEmail}
                type="email"
                name="email"
                control={control}
                style={{ height: '40px', padding: '22px' }}
                containerStyle={{ width: '65%' }}
                error={errors.email?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhonePrimay}
                type="text"
                name="phonePrimary"
                control={control}
                mask={'phone'}
                containerStyle={{ width: '15%' }}
                style={{ height: '40px', padding: '22px' }}
                error={errors.phonePrimary?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhoneSecondary}
                type="text"
                name="phoneSecondary"
                control={control}
                mask={'phone'}
                containerStyle={{ width: '15%' }}
                style={{ height: '40px', padding: '22px' }}
                error={errors.phoneSecondary?.message}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderZipCode}
                type="text"
                name="zipCode"
                mask={'cep'}
                maxLength={9}
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.zipCode?.message}
              />
              <InputForm
                placeholder={Strings.placeholderStreet}
                type="text"
                name="street"
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
                type="text"
                name="number"
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.number?.message}
              />
              <InputForm
                placeholder={Strings.placeholderBlock}
                type="text"
                name="block"
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                type="text"
                name="lot"
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
                type="text"
                name="complement"
                control={control}
                error={errors.complement?.message}
                style={{ height: '40px', padding: '22px' }}
              />
            </div>
            <div style={{ marginBottom: '2vh', width: '100%' }}>
              <div
                style={{ marginBottom: '1vh', width: '100%' }}
                className={styles.EditSpecialistDataGeografic}
              >
                <SelectForm
                  control={control}
                  name="state"
                  data={states}
                  error={errors.state?.message}
                  onSelectChange={handleStateCode}
                  containerStyle={{ width: '19%' }}
                />
                <SelectForm
                  control={control}
                  name="citieCode"
                  data={cities !== null ? cities : null}
                  isLoading={isLoadingCities}
                  error={errors.city?.message}
                  containerStyle={{ width: '19%' }}
                />
                <SelectForm
                  control={control}
                  name="status"
                  data={statusGeneral}
                  error={errors.status?.message}
                  containerStyle={{ width: '19%' }}
                />
                <SelectForm
                  control={control}
                  name="speciality"
                  data={specialties !== null ? specialties : null}
                  error={errors.speciality?.message}
                  containerStyle={{ width: '19%' }}
                />
                <div style={{ height: '40px', minWidth: '19%' }}>
                  <Button
                    type="cancel"
                    title={Strings.resetPasswordSpecialist}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className={styles.divTableLinkedUnits}>
                <table className={styles.tableLinkedUnits}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>{Strings.linkedUnits}</th>
                      <th>{Strings.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units !== null && units.length > 0 ? (
                      units.map((unit: DataUnitsModel) => (
                        <tr key={unit.id}>
                          <td>
                            <label className={styles.checkboxContainer}>
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={unitsSelected?.indexOf(unit.id) !== -1}
                                onChange={() => {
                                  if (unitsSelected?.includes(unit.id)) {
                                    const unitsSelectedUpdated =
                                      unitsSelected?.filter(
                                        (unitSelected: number) =>
                                          unitSelected !== unit.id
                                      );
                                    setUnitsSelected(unitsSelectedUpdated);
                                    setQuantityUnitsSelected(
                                      quantityUnitsSelected - 1
                                    );
                                  } else {
                                    const unitsSelectedUpdated = unitsSelected;
                                    unitsSelectedUpdated?.push(unit.id);
                                    setUnitsSelected(unitsSelectedUpdated);
                                    setQuantityUnitsSelected(
                                      quantityUnitsSelected + 1
                                    );
                                  }
                                }}
                              />
                            </label>
                          </td>
                          <td>{unit.name}</td>
                          <td>{unit.status === 0 ? 'Ativo' : 'Inativo'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3}>Nenhuma unidade vinculada</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={styles.footerEditSpecialist}>
            <div className={styles.btnSaveEditSpecialist}>
              <Button
                type="secondary"
                title={Strings.save}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnCancelEditSpecialist}>
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
        message={Strings.messageSuccessInsertSpecialist}
      />
    </React.Fragment>
  );
}
