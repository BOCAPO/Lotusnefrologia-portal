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
import { DataStateModel, DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getAllCities } from 'services/cities';
import { getSpecialistById, updateSpecialistById } from 'services/specialists';
import { getSpecialtiesWithoutPagination } from 'services/specialties';
import { getAllStates } from 'services/states';
import { getAllUnitsWithoutPagination } from 'services/units';
import { statusGeneral } from 'utils/enums';
import { buscarInformacoesCEP } from 'utils/helpers';

type DataProps = {
  [name: string]: string | number;
};

export default function EditSpecialistPage() {
  const [states, setStates] = React.useState<any>(null);
  const params = useParams();
  const [cities, setCities] = React.useState<any>(null);
  const [specialties, setSpecialties] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [cep, setCep] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [unitsSelected, setUnitsSelected] = React.useState<any>([]);
  const [quantityUnitsSelected, setQuantityUnitsSelected] = React.useState(0);
  const [speciatiesSelected, setSpecialtiesSelected] = React.useState<any>([]);
  const [quantitySpecialtiesSelected, setQuantitySpecialtiesSelected] =
    React.useState(0);

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
      specialist.city_code !== undefined ? specialist.city_code : ''
    );
    getUnitsSelected(specialist);
    getSpecialtiesSelected(specialist);
    setValue('cpf', specialist.cpf);
    setValue('name', specialist.name);
    setValue('email', specialist.email);
    setValue('phonePrimary', specialist.phone_primary);
    setValue('phoneSecondary', specialist.phone_secondary);
    setValue('citieCode', specialist.city_code);
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
    const updateSpecialist: DataSpecialistsModel = {
      id: Number(params?.specialistId),
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
      units: unitsSelected,
      city_code: data.citieCode.toString(),
      specialties: speciatiesSelected,
      status: Number(data.status) - 1
    };

    const response = await updateSpecialistById(
      Number(params?.specialistId),
      updateSpecialist
    );
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {
        router.back();
      }, 2500);
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
    const response = await getSpecialtiesWithoutPagination();
    const specialtiesUpdated =
      response.data as unknown as DataSpecialtiesModel[];
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

  async function getSpecialtiesSelected(
    data: DataSpecialistsModel[] | DataSpecialistsModel
  ) {
    if (Array.isArray(data)) {
      const specialtiesSelectedUpdated = [...speciatiesSelected];
      data.forEach((specialist: DataSpecialistsModel) => {
        specialist.specialties?.forEach((specialty: any) => {
          specialtiesSelectedUpdated.push(specialty.id);
        });
      });
      setSpecialtiesSelected(specialtiesSelectedUpdated);
    } else {
      const specialtiesSelectedUpdated = [...speciatiesSelected];
      data.specialties?.forEach((specialty: any) => {
        specialtiesSelectedUpdated.push(specialty.id);
      });
      setSpecialtiesSelected(specialtiesSelectedUpdated);
    }
  }

  async function getUnits() {
    const response = await getAllUnitsWithoutPagination();
    const unitsUpdated = response.data as unknown as DataUnitsModel[];
    setUnits(unitsUpdated);
  }

  const handleStateCode = (selectedStateCode: any) => {
    getCities(selectedStateCode.toString());
  };

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
                label={Strings.labelCPF}
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
                label={Strings.labelName}
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
                label={Strings.labelEmail}
                type="email"
                name="email"
                control={control}
                style={{ height: '40px', padding: '22px' }}
                containerStyle={{ width: '65%' }}
                error={errors.email?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhonePrimary}
                label={Strings.labelPhone}
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
                label={Strings.labelPhone}
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
                label={Strings.labelZipCode}
                type="text"
                name="zipCode"
                mask={'cep'}
                containerStyle={{ width: '10%' }}
                maxLength={9}
                control={control}
                style={{ height: '40px', padding: '22px' }}
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
                containerStyle={{ width: '30%' }}
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
                label={Strings.labelNumber}
                type="text"
                name="number"
                containerStyle={{ width: '10%' }}
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.number?.message}
              />
              <InputForm
                placeholder={Strings.placeholderBlock}
                label={Strings.labelBlock}
                type="text"
                containerStyle={{ width: '10%' }}
                name="block"
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                label={Strings.labelLot}
                containerStyle={{ width: '10%' }}
                type="text"
                name="lot"
                control={control}
                style={{ height: '40px', padding: '22px' }}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
                label={Strings.labelComplement}
                type="text"
                name="complement"
                containerStyle={{ width: '20%' }}
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
                  item={Strings.labelState}
                  name="state"
                  disabled={true}
                  data={states}
                  error={errors.state?.message}
                  onSelectChange={handleStateCode}
                  containerStyle={{ width: '25%' }}
                />
                <SelectForm
                  control={control}
                  item={Strings.labelCity}
                  disabled={true}
                  name="citieCode"
                  data={cities !== null ? cities : null}
                  isLoading={isLoadingCities}
                  error={errors.city?.message}
                  containerStyle={{ width: '25%' }}
                />
                <SelectForm
                  control={control}
                  name="status"
                  data={statusGeneral}
                  error={errors.status?.message}
                  containerStyle={{ width: '25%' }}
                />
                <div style={{ height: '40px', minWidth: '19%' }}>
                  <Button
                    type="cancel"
                    title={Strings.resetPasswordSpecialist}
                  />
                </div>
              </div>
            </div>
            <div className={styles.divMultiplesOptions}>
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
              <div className={styles.divTableLinkedUnits}>
                <table className={styles.tableLinkedUnits}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>{Strings.pluralSpeciality}</th>
                      <th>{Strings.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specialties !== null && specialties.length > 0 ? (
                      specialties.map((specialty: DataSpecialtiesModel) => (
                        <tr key={specialty.id}>
                          <td>
                            <label className={styles.checkboxContainer}>
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={
                                  speciatiesSelected?.indexOf(specialty.id) !==
                                  -1
                                }
                                onChange={() => {
                                  if (
                                    speciatiesSelected?.includes(specialty.id)
                                  ) {
                                    const speciatiesSelectedUpdated =
                                      speciatiesSelected?.filter(
                                        (specialtySelected: number) =>
                                          specialtySelected !== specialty.id
                                      );
                                    setSpecialtiesSelected(
                                      speciatiesSelectedUpdated
                                    );
                                    setQuantitySpecialtiesSelected(
                                      quantitySpecialtiesSelected - 1
                                    );
                                  } else {
                                    const speciatiesSelectedUpdated =
                                      speciatiesSelected;
                                    speciatiesSelectedUpdated?.push(
                                      specialty.id
                                    );
                                    setSpecialtiesSelected(
                                      speciatiesSelectedUpdated
                                    );
                                    setQuantitySpecialtiesSelected(
                                      quantitySpecialtiesSelected + 1
                                    );
                                  }
                                }}
                              />
                            </label>
                          </td>
                          <td>{specialty.description}</td>
                          <td>
                            {specialty.status === 0 ? 'Ativo' : 'Inativo'}
                          </td>
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
