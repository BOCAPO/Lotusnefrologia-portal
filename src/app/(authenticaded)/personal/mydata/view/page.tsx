'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import { SelectForm } from 'components/SelectForm';
import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './userview.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataRoomsModel } from 'models/DataRoomsModel';
import { DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { DataUserModel } from 'models/DataUserModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { Prefs } from 'repository/Prefs';
import { getAllRoomsWithoutPagination } from 'services/chat';
import { getAllCities } from 'services/cities';
import { getAllStates } from 'services/states';
import { getAllUnitsWithoutPagination } from 'services/units';
import { getUserById } from 'services/users';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function ViewUserPage() {
  const router = useRouter();
  const idUser = Prefs.getIdUser();
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [rooms, setRooms] = React.useState<any>(null);
  const [unitsSelected, setUnitsSelected] = React.useState<any>([]);
  const [roomsSelected, setRoomsSelected] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);

  const {
    control,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getUnits();
    getAllRooms();
    getStates();
    getUser();
  }, [idUser]);

  async function getUser() {
    const response = await getUserById(Number(idUser));
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
      setRoomsSelected(dataUser.rooms);
      setUnitsSelected(dataUser.units);
    }
    setLoading(false);
  }

  async function getAllRooms() {
    const response = await getAllRoomsWithoutPagination();
    const dataRooms = response.data as DataRoomsModel;

    if (dataRooms !== null) {
      setRooms(dataRooms);
    }
  }

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

  async function getUnits() {
    const response = await getAllUnitsWithoutPagination();
    const dataUnits = response.data as ResponseGetModel;
    if (dataUnits !== null) {
      setUnits(dataUnits);
    }
  }

  async function getUnitsSelected() {
    const unitsLinked = await Prefs.getUnits();
    JSON.parse(unitsLinked!).forEach((unit: DataUnitsModel) => {
      const unitsSelectedUpdated = unitsSelected;
      unitsSelectedUpdated?.push(unit.id);
      setUnitsSelected(unitsSelectedUpdated);
    });
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
        <div className={styles.bodyViewUser}>
          <div className={styles.headerViewUser}>
            <SmallMediumText
              text={Strings.myData}
              bold={true}
              color={Colors.gray90}
              style={{ lineHeight: '5px' }}
            />
          </div>
          <div className={styles.formViewUser}>
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
                className={styles.inputViewUser}
              />
              <InputForm
                placeholder={Strings.placeholderName}
                type="text"
                name="name"
                label={Strings.labelName}
                readonly={true}
                control={control}
                containerStyle={{ width: '65%' }}
                className={styles.inputViewUser}
                error={errors.name?.message}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderEmail}
                type="email"
                label={Strings.labelEmail}
                name="email"
                readonly={true}
                control={control}
                className={styles.inputViewUser}
                containerStyle={{ width: '65%' }}
                error={errors.email?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhonePrimary}
                type="text"
                name="phonePrimary"
                control={control}
                label={Strings.labelPhone}
                mask={'phone'}
                readonly={true}
                containerStyle={{ width: '15%' }}
                className={styles.inputViewUser}
                error={errors.phonePrimary?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhoneSecondary}
                type="text"
                name="phoneSecondary"
                label={Strings.labelPhone}
                control={control}
                mask={'phone'}
                readonly={true}
                containerStyle={{ width: '15%' }}
                className={styles.inputViewUser}
                error={errors.phoneSecondary?.message}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderZipCode}
                type="text"
                label={Strings.labelZipCode}
                name="zipCode"
                mask={'cep'}
                maxLength={9}
                readonly={true}
                control={control}
                className={styles.inputViewUser}
                error={errors.zipCode?.message}
              />
              <InputForm
                placeholder={Strings.placeholderStreet}
                type="text"
                label={Strings.labelStreet}
                name="street"
                readonly={true}
                control={control}
                className={styles.inputViewUser}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
                type="text"
                name="number"
                label={Strings.labelNumber}
                readonly={true}
                control={control}
                className={styles.inputViewUser}
                error={errors.number?.message}
              />
              <InputForm
                label={Strings.labelBlock}
                placeholder={Strings.placeholderBlock}
                type="text"
                readonly={true}
                name="block"
                control={control}
                className={styles.inputViewUser}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                label={Strings.labelLot}
                type="text"
                readonly={true}
                name="lot"
                control={control}
                className={styles.inputViewUser}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
                type="text"
                label={Strings.labelComplement}
                name="complement"
                readonly={true}
                control={control}
                error={errors.complement?.message}
                className={styles.inputViewUser}
              />
            </div>
            <div style={{ marginBottom: '2vh', width: '100%' }}>
              <div
                style={{ marginBottom: '1vh', width: '100%' }}
                className={styles.viewUserDataGeografic}
              >
                <SelectForm
                  control={control}
                  name="state"
                  item={Strings.labelState}
                  label={Strings.labelState}
                  data={states !== null ? states : null}
                  onSelectChange={handleStateCode}
                  disabled={true}
                  error={errors.state?.message}
                  containerStyle={{ width: '25%' }}
                />
                <SelectForm
                  control={control}
                  name="cityCode"
                  label={Strings.labelCity}
                  data={cities !== null ? cities : null}
                  item={Strings.labelCity}
                  disabled={true}
                  isLoading={isLoadingCities}
                  error={errors.city?.message}
                  containerStyle={{ width: '25%' }}
                />
                <SelectForm
                  control={control}
                  name="status"
                  label={Strings.status}
                  item={Strings.status}
                  data={statusGeneral}
                  disabled={true}
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
                    {loading ? (
                      <SpinnerLoading />
                    ) : units !== null && units.length > 0 ? (
                      units?.map((unit: DataUnitsModel) => (
                        <tr key={unit.id}>
                          <td>
                            <label className={styles.checkboxContainer}>
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                readOnly
                                checked={unitsSelected?.includes(
                                  unit.id !== undefined ? unit.id : 0
                                )}
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
                      <th>{Strings.linkedUnits}</th>
                      <th>{Strings.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <SpinnerLoading />
                    ) : rooms !== null && rooms.length > 0 ? (
                      rooms?.map((room: DataRoomsModel) => (
                        <tr key={room.id}>
                          <td>
                            <label className={styles.checkboxContainer}>
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                readOnly
                                checked={roomsSelected?.includes(
                                  room.id !== undefined ? room.id : 0
                                )}
                              />
                            </label>
                          </td>
                          <td>{room.name}</td>
                          <td>{room.status === '0' ? 'Ativo' : 'Inativo'}</td>
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
          <div className={styles.footerViewUser}>
            <div className={styles.btnSaveViewUser}>
              <Button
                type="secondary"
                title={Strings.edit}
                onClick={() => {
                  router.push(`/personal/mydata/edit/${idUser}}`);
                }}
              />
            </div>
            <div className={styles.btnCancelViewUser}>
              <Button
                type="cancel"
                title={Strings.goBack}
                onClick={() => {
                  router.push('/home');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
