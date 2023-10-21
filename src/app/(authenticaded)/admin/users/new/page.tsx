'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SmallMediumText } from 'components/Text';

import styles from './usersnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataRoomsModel } from 'models/DataRoomsModel';
import { DataStateModel, DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { DataUserModel } from 'models/DataUserModel';
import { getAllRoomsWithoutPagination } from 'services/chat';
import { getAllCities } from 'services/cities';
import { getAllStates } from 'services/states';
import { getAllUnitsWithoutPagination } from 'services/units';
import { createUser } from 'services/users';
import { statusGeneral } from 'utils/enums';
import { buscarInformacoesCEP } from 'utils/helpers';

type DataProps = {
  [name: string]: string | number;
};

export default function NewUserPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [rooms, setRooms] = React.useState<any>(null);
  const [cep, setCep] = React.useState<any>(null);
  // const [roles, setRoles] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [selectedUnits, setSelectedUnits] = React.useState<number[]>([]);
  const [selectedRooms, setSelectedRooms] = React.useState<number[]>([]);

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
    getAllRooms();
    // getRoles();
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
  }

  async function getAllRooms() {
    const response = await getAllRoomsWithoutPagination();
    const dataRooms = response.data as unknown as DataRoomsModel[];

    if (dataRooms !== null) {
      setRooms(dataRooms);
    }
  }

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

  const handleCheckboxChangeRooms = (roomId: number) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  async function onSubmit(data: DataProps) {
    const newUser: DataUserModel = {
      cpf: data.cpf.toString(),
      name: data.name.toString(),
      email: data.email.toString(),
      phone_primary: data.phonePrimary?.toString(),
      phone_secondary: data.phoneSecondary?.toString(),
      zip_code: data.zipCode?.toString(),
      city_code: data.cityCode?.toString(),
      street: data.street?.toString(),
      number: data.number?.toString(),
      block: data.block?.toString(),
      lot: data.lot?.toString(),
      complement: data.complement?.toString(),
      units: selectedUnits,
      rooms: selectedRooms,
      status: Number(data.status) - 1
    };

    const response = await createUser(newUser);
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {
        router.back();
      }, 3000);
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
              label={Strings.labelCPF}
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
              label={Strings.labelName}
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
              label={Strings.labelEmail}
              type="email"
              name="email"
              control={control}
              className={styles.inputNewUser}
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
              className={styles.inputNewUser}
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
              className={styles.inputNewUser}
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
              className={styles.inputNewUser}
              getValue={setCep}
              onBlur={() => {
                getDataCEP(cep);
              }}
              error={errors.zipCode?.message}
            />
            <InputForm
              placeholder={Strings.placeholderStreet}
              label={Strings.labelStreet}
              type="text"
              name="street"
              containerStyle={{ width: '30%' }}
              control={control}
              className={styles.inputNewUser}
              error={errors.street?.message}
            />
            <InputForm
              placeholder={Strings.placeholderNumber}
              type="text"
              name="number"
              label={Strings.labelNumber}
              containerStyle={{ width: '10%' }}
              control={control}
              className={styles.inputNewUser}
              error={errors.number?.message}
            />
            <InputForm
              placeholder={Strings.placeholderBlock}
              label={Strings.labelBlock}
              type="text"
              name="block"
              containerStyle={{ width: '10%' }}
              control={control}
              className={styles.inputNewUser}
              error={errors.block?.message}
            />
            <InputForm
              placeholder={Strings.placeholderLot}
              label={Strings.labelLot}
              type="text"
              containerStyle={{ width: '10%' }}
              name="lot"
              control={control}
              className={styles.inputNewUser}
              error={errors.lot?.message}
            />
            <InputForm
              placeholder={Strings.placeholderComplement}
              label={Strings.labelComplement}
              type="text"
              containerStyle={{ width: '20%' }}
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
                item={Strings.labelState}
                name="state"
                data={states}
                label={Strings.labelState}
                disabled={true}
                error={errors.state?.message}
                onSelectChange={handleStateCode}
                containerStyle={{ width: '25%' }}
              />
              <SelectForm
                control={control}
                item={Strings.labelCity}
                name="cityCode"
                disabled={true}
                label={Strings.labelCity}
                data={cities !== null ? cities : null}
                isLoading={isLoadingCities}
                error={errors.cityCode?.message}
                containerStyle={{ width: '25%' }}
              />
              <SelectForm
                control={control}
                item={Strings.status}
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

            <div className={styles.divTableLinkedUnits}>
              <table className={styles.tableLinkedUnits}>
                <thead>
                  <tr>
                    <th></th>
                    <th>{Strings.attendenceThoughtChat}</th>
                    <th>{Strings.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms !== null && rooms.length > 0 ? (
                    rooms.map((room: DataRoomsModel) => (
                      <tr key={room.id}>
                        <td>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={selectedRooms.includes(room.id!)}
                              onChange={() =>
                                handleCheckboxChangeRooms(room.id!)
                              }
                            />
                          </label>
                        </td>
                        <td>{room.name}</td>
                        <td>{room.status === '0' ? 'Ativo' : 'Inativo'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>Nenhuma sala vinculada</td>
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
