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
import { getAllCities } from 'services/cities';
import { getAllStates } from 'services/states';
import { getAllUnits } from 'services/units';
import { getUserById } from 'services/users';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function EditUserPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  // const [roles, setRoles] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [selectedUnits, setSelectedUnits] = React.useState<number[]>([]);
  const [loadSelectedUnits, setLoadSelectedUnits] = React.useState<any>(null);
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
    // getRoles();
    getUserPerId();
  }, [params?.userId]);

  async function getStates() {
    const response = await getAllStates();
    const statesUpdated = response.data.data as DataStatesModel[];
    setStates(statesUpdated.slice().sort((a, b) => a.UF.localeCompare(b.UF)));
  }

  async function getUserPerId() {
    const response = await getUserById(Number(params?.userId));
    const dataUser = response.data as DataUserModel;
    setValue('cpf', dataUser.cpf);
    setValue('name', dataUser.name);
    // setValue('profile', dataUser.profile);
    setValue('email', dataUser.email);
    setValue('phonePrimary', dataUser.phone_primary);
    setValue('phoneSecondary', dataUser.phone_secondary);
    setValue('zipCode', dataUser.zip_code);
    setValue('street', dataUser.street);
    setValue('number', dataUser.number);
    setValue('block', dataUser.block);
    setValue('lot', dataUser.lot);
    setValue('complement', dataUser.complement!);
    setValue('citieCode', dataUser.citie_code!);
    setValue('status', dataUser.status + 1);
    // setLoadSelectedUnits(dataUser.unit);
  }

  async function getCities(state_code: string) {
    setIsLoadingCities(true);
    const response = await getAllCities();
    let citiesUpdated = response.data.data as DataCitiesModel[];
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
    const response = await getAllUnits();
    const unitsUpdated = response.data.data as DataUnitsModel[];
    setUnits(unitsUpdated.slice().sort((a, b) => a.name.localeCompare(b.name)));
  }

  // async function getRoles() {
  //   const response = await getAllRoles();
  //   const rolesUpdated = response.data.data as DataRolesModel[];
  //   setRoles(rolesUpdated.slice().sort((a, b) => a.name.localeCompare(b.name)));
  // }

  const handleStateCode = (selectedStateCode: any) => {
    getCities(selectedStateCode.toString());
  };

  const handleCheckboxChange = (unitId: number) => {
    if (selectedUnits.includes(unitId)) {
      setSelectedUnits(selectedUnits.filter((id) => id !== unitId));
    } else {
      setSelectedUnits([...selectedUnits, unitId]);
    }
  };

  async function onSubmit(data: DataProps) {
    // const status = Number(data.status) - 1;
    // try {
    //   const newUser = {
    //     cpf: data.cpf.toString(),
    //     name: data.name.toString(),
    //     email: data.email.toString(),
    //     phone_primary: data.phonePrimary.toString(),
    //     phone_secondary: data.phoneSecondary.toString(),
    //     zip_code: data.zipCode.toString(),
    //     citie_code: data.citieCode.toString(),
    //     street: data.street.toString(),
    //     number: data.number.toString(),
    //     block: data.block.toString(),
    //     lot: data.lot.toString(),
    //     complement: data.complement.toString(),
    //     unit: selectedUnits,
    //     status: status,
    //     profile: 1
    //   };
    //   const response = await createUser(newUser);
    //   if (response !== null) {
    //     setShowModalSuccess(true);
    //     setTimeout(() => {
    //       router.back();
    //     }, 3000);
    //   }
    // } catch (error) {
    //   // console.log('Erro ao criar usuario!' + error);
    // }
  }

  return (
    <React.Fragment>
      <MenuTop />
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
            {/* <SelectForm
              name="profile"
              control={control}
              containerStyle={{ width: '32.5%' }}
              data={roles}
              error={errors.profile?.message}
            /> */}
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
              control={control}
              className={styles.inputNewUser}
              error={errors.zipCode?.message}
            />
            <InputForm
              placeholder={Strings.placeholderStreet}
              type="text"
              name="street"
              control={control}
              className={styles.inputNewUser}
              error={errors.street?.message}
            />
            <InputForm
              placeholder={Strings.placeholderNumber}
              type="text"
              name="number"
              control={control}
              className={styles.inputNewUser}
              error={errors.number?.message}
            />
            <InputForm
              placeholder={Strings.placeholderBlock}
              type="text"
              name="block"
              control={control}
              className={styles.inputNewUser}
              error={errors.block?.message}
            />
            <InputForm
              placeholder={Strings.placeholderLot}
              type="text"
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
                containerStyle={{ width: '50%' }}
              />
              <SelectForm
                control={control}
                name="citieCode"
                data={cities !== null ? cities : null}
                isLoading={isLoadingCities}
                error={errors.city?.message}
                containerStyle={{ width: '50%' }}
              />
              <SelectForm
                control={control}
                name="status"
                data={statusGeneral}
                error={errors.status?.message}
                containerStyle={{ width: '50%' }}
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
                              checked={selectedUnits.includes(unit.id!)}
                              onChange={() => handleCheckboxChange(unit.id!)}
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
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={Strings.messageSuccessInsertUser}
      />
    </React.Fragment>
  );
}
