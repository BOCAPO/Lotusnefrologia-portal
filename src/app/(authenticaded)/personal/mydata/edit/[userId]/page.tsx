'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './useredit.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { DataUserModel } from 'models/DataUserModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { Prefs } from 'repository/Prefs';
import { getAllCities } from 'services/cities';
import { getAllStates } from 'services/states';
import { getAllUnitsWithoutPagination } from 'services/units';
import { getUserById, updateUserById } from 'services/users';
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
  const [unitsSelected, setUnitsSelected] = React.useState<any>([]);
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
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
    getUnits();
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
      setUnitsSelected(dataUser.units);
    }
    setLoading(false);
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

  async function onSubmit(data: DataProps) {
    const updateUser: DataUserModel = {
      id: Number(idUser),
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

    const response = await updateUserById(Number(idUser), updateUser);
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {
        router.back();
      }, 3500);
    }
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
                control={control}
                error={errors.cpf?.message}
                containerStyle={{ width: '20%' }}
                className={styles.inputViewUser}
              />
              <InputForm
                placeholder={Strings.placeholderName}
                label={Strings.labelName}
                type="text"
                name="name"
                control={control}
                containerStyle={{ width: '65%' }}
                className={styles.inputViewUser}
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
                className={styles.inputViewUser}
                containerStyle={{ width: '55%' }}
                error={errors.email?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhonePrimary}
                label={Strings.labelPhone}
                type="text"
                name="phonePrimary"
                control={control}
                mask={'phone'}
                containerStyle={{ width: '20%' }}
                className={styles.inputViewUser}
                error={errors.phonePrimary?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhoneSecondary}
                label={Strings.labelPhone}
                type="text"
                name="phoneSecondary"
                control={control}
                mask={'phone'}
                containerStyle={{ width: '20%' }}
                className={styles.inputViewUser}
                error={errors.phoneSecondary?.message}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderZipCode}
                type="text"
                name="zipCode"
                label={Strings.labelZipCode}
                mask={'cep'}
                maxLength={9}
                containerStyle={{ width: '10%' }}
                control={control}
                className={styles.inputViewUser}
                error={errors.zipCode?.message}
              />
              <InputForm
                placeholder={Strings.placeholderStreet}
                label={Strings.labelStreet}
                type="text"
                name="street"
                containerStyle={{ width: '35%' }}
                control={control}
                className={styles.inputViewUser}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
                label={Strings.labelNumber}
                type="text"
                name="number"
                containerStyle={{ width: '10%' }}
                control={control}
                className={styles.inputViewUser}
                error={errors.number?.message}
              />
              <InputForm
                placeholder={Strings.placeholderBlock}
                label={Strings.labelBlock}
                type="text"
                name="block"
                containerStyle={{ width: '10%' }}
                control={control}
                className={styles.inputViewUser}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                label={Strings.labelLot}
                type="text"
                name="lot"
                containerStyle={{ width: '10%' }}
                control={control}
                className={styles.inputViewUser}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
                label={Strings.labelComplement}
                type="text"
                name="complement"
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
                  data={states !== null ? states : null}
                  onSelectChange={handleStateCode}
                  error={errors.state?.message}
                  containerStyle={{ width: '25%' }}
                />
                <SelectForm
                  control={control}
                  item={Strings.labelCity}
                  name="cityCode"
                  data={cities !== null ? cities : null}
                  isLoading={isLoadingCities}
                  error={errors.city?.message}
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
                      units?.map((unit: DataUnitsModel) => (
                        <tr key={unit.id}>
                          <td>
                            <label className={styles.checkboxContainer}>
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={unitsSelected?.includes(
                                  unit.id !== undefined ? unit.id : 0
                                )}
                                onChange={() => {
                                  if (unitsSelected?.includes(unit.id)) {
                                    const unitsSelectedUpdated =
                                      unitsSelected?.filter(
                                        (unitSelected: number) =>
                                          unitSelected !== unit.id
                                      );
                                    setUnitsSelected(unitsSelectedUpdated);
                                  } else {
                                    const unitsSelectedUpdated = unitsSelected;
                                    unitsSelectedUpdated?.push(unit.id);
                                    setUnitsSelected(unitsSelectedUpdated);
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
          <div className={styles.footerViewUser}>
            <div className={styles.btnSaveViewUser}>
              <Button
                type="secondary"
                title={Strings.save}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnCancelViewUser}>
              <Button
                type="cancel"
                title={Strings.goBack}
                onClick={() => {
                  router.back();
                }}
              />
            </div>
          </div>
        </div>
      )}
      <ModalSuccess
        message={Strings.messageSuccessUpdateUser}
        show={showModalSuccess}
        onHide={() => {
          setShowModalSuccess(false);
        }}
      />
    </React.Fragment>
  );
}
