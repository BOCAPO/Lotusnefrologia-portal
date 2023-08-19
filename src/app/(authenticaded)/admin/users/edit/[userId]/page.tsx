/* eslint-disable @typescript-eslint/no-unused-vars */
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

import styles from './usersedit.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { DataUserModel } from 'models/DataUserModel';
import { Prefs } from 'repository/Prefs';
import { getAllCities } from 'services/cities';
import { getAllStates } from 'services/states';
import { getAllUnits } from 'services/units';
import { getUserById, updateUserById } from 'services/users';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function EditUserPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [unitsSelected, setUnitsSelected] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
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
    getUnits();
    getStates();
    getUser();
  }, [params?.userId]);

  async function getStates() {
    const response = await getAllStates();
    const statesUpdated = response.data as unknown as DataStatesModel;
    setStates(
      statesUpdated.sort((a, b) => a.description.localeCompare(b.description))
    );
  }

  async function getCities(city_code: string) {
    setIsLoadingCities(true);
    const response = await getAllCities();
    let citiesUpdated = response.data as unknown as DataCitiesModel[];
    const responseCity = citiesUpdated.find((item) => item.code === city_code);
    setValue(
      'state',
      responseCity !== undefined ? responseCity.state_code : ''
    );
    citiesUpdated = citiesUpdated.filter(
      (city: DataCitiesModel) => city.state_code === responseCity?.state_code
    );
    setCities(
      citiesUpdated
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description))
    );
    setIsLoadingCities(false);
  }

  async function getUser() {
    const response = await getUserById(Number(params?.userId));
    const dataUser = response.data as DataUserModel;
    getCities(dataUser.city_code !== undefined ? dataUser.city_code : '');
    getUnitsSelected();

    if (dataUser !== null) {
      setValue('cpf', dataUser.cpf);
      setValue('name', dataUser.name);
      setValue('email', dataUser.email);
      setValue('phonePrimary', dataUser.phone_primary);
      setValue('phoneSecondary', dataUser.phone_secondary);
      setValue('zipCode', dataUser.zip_code);
      setValue('street', dataUser.street);
      setValue('number', dataUser.number);
      setValue('block', dataUser.block!);
      setValue('lot', dataUser.lot!);
      setValue('complement', dataUser.complement!);
      setValue('cityCode', dataUser.city_code);
      setValue('status', dataUser.status + 1);
      setUnitsSelected(dataUser.units);
    }
    setLoading(false);
  }

  async function getUnits() {
    const response = await getAllUnits();
    const unitsUpdated = response.data.data as DataUnitsModel[];
    setUnits(unitsUpdated.slice().sort((a, b) => a.name.localeCompare(b.name)));
  }

  const handleStateCode = (selectedStateCode: any) => {
    getCities(selectedStateCode.toString());
  };

  async function getUnitsSelected() {
    const unitsLinked = await Prefs.getUnits();
    JSON.parse(unitsLinked!).forEach((unit: DataUnitsModel) => {
      const unitsSelectedUpdated = unitsSelected;
      unitsSelectedUpdated?.push(unit.id);
      setUnitsSelected(unitsSelectedUpdated);
    });
  }

  async function onSubmit(data: DataProps) {
    const updateUser: DataUserModel = {
      id: Number(params?.userId),
      cpf: data.cpf.toString(),
      name: data.name.toString(),
      email: data.email.toString(),
      phone_primary: data.phonePrimary.toString(),
      phone_secondary: data.phoneSecondary.toString(),
      zip_code: data.zipCode.toString(),
      city_code: data.cityCode.toString(),
      street: data.street.toString(),
      number: data.number.toString(),
      block: data.block.toString(),
      lot: data.lot.toString(),
      complement: data.complement.toString(),
      status: Number(data.status) - 1,
      units: unitsSelected
    };

    const response = await updateUserById(Number(params?.userId), updateUser);
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {
        router.back();
      }, 3500);
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      {loading ? (
        <SpinnerLoading />
      ) : (
        <div className={styles.bodyNewUser}>
          <div className={styles.headerNewUser}>
            <SmallMediumText
              text={Strings.insertUser}
              bold={true}
              color={Colors.gray90}
              style={{ lineHeight: '5px' }}
            />
          </div>
          <div className={styles.formNewUser}>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderCPF}
                type="text"
                name="cpf"
                mask={'cpfCnpj'}
                readonly={true}
                maxLength={14}
                control={control}
                error={errors.cpf?.message}
                containerStyle={{ width: '25%' }}
                className={styles.inputNewUser}
              />
              <InputForm
                placeholder={Strings.placeholderName}
                type="text"
                name="name"
                control={control}
                containerStyle={{ width: '70%' }}
                className={styles.inputNewUser}
                error={errors.name?.message}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderEmail}
                type="email"
                name="email"
                control={control}
                className={styles.inputNewUser}
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
                className={styles.inputNewUser}
                error={errors.phonePrimary?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhoneSecondary}
                type="text"
                name="phoneSecondary"
                control={control}
                mask={'phone'}
                containerStyle={{ width: '15%' }}
                className={styles.inputNewUser}
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
                containerStyle={{ width: '10%' }}
                control={control}
                className={styles.inputNewUser}
                error={errors.zipCode?.message}
              />
              <InputForm
                placeholder={Strings.placeholderStreet}
                type="text"
                name="street"
                control={control}
                containerStyle={{ width: '30%' }}
                className={styles.inputNewUser}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
                type="text"
                name="number"
                containerStyle={{ width: '10%' }}
                control={control}
                className={styles.inputNewUser}
                error={errors.number?.message}
              />
              <InputForm
                placeholder={Strings.placeholderBlock}
                type="text"
                name="block"
                containerStyle={{ width: '10%' }}
                control={control}
                className={styles.inputNewUser}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                type="text"
                containerStyle={{ width: '10%' }}
                name="lot"
                control={control}
                className={styles.inputNewUser}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
                type="text"
                name="complement"
                control={control}
                error={errors.complement?.message}
                className={styles.inputNewUser}
              />
            </div>
            <div style={{ marginBottom: '2vh', width: '100%' }}>
              <div
                style={{ marginBottom: '1vh', width: '100%' }}
                className={styles.newUserDataGeografic}
              >
                <SelectForm
                  control={control}
                  name="state"
                  data={states}
                  error={errors.state?.message}
                  onSelectChange={handleStateCode}
                  containerStyle={{ width: '25%' }}
                />
                <SelectForm
                  control={control}
                  name="cityCode"
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
                <div style={{ height: '40px', minWidth: '20%' }}>
                  <Button type="cancel" title={Strings.resetPasswordUser} />
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
          <div className={styles.footerNewUser}>
            <div className={styles.btnSaveNewUser}>
              <Button
                type="secondary"
                title={Strings.save}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnCancelNewUser}>
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
        message={Strings.messageSuccessInsertUser}
      />
    </React.Fragment>
  );
}
