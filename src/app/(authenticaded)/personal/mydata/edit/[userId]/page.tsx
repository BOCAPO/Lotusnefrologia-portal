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

import styles from './userview.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { DataUserModel } from 'models/DataUserModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { Prefs } from 'repository/Prefs';
import { getCep } from 'services/cep';
import { getAllUnitsWithoutPagination } from 'services/units';
import { getUserById, updateUserById } from 'services/users';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function ViewUserPage() {
  const router = useRouter();
  const idUser = Prefs.getIdUser();
  const [cep, setCep] = React.useState('');
  const [units, setUnits] = React.useState<any>(null);
  const [unitsSelected, setUnitsSelected] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getUser();
    getUnits();
  }, [idUser]);

  React.useEffect(() => {
    if (cep.length === 9) {
      const responseCEP = getCep(cep.replace('-', ''));
      responseCEP.then((response) => {
        if (response !== null) {
          setValue('citieCode', response.city);
          setValue('state', response.state);
        }
      });
    }
  }, [cep]);

  async function getUser() {
    const response = await getUserById(Number(idUser));
    const dataUser = response.data as DataUserModel;
    if (dataUser !== null) {
      setValue('cpf', dataUser.cpf);
      setValue('name', dataUser.name);
      // setValue('profile', dataUser.profile);
      setValue('email', dataUser.email);
      setValue('phonePrimary', dataUser.phone_primary);
      setValue('phoneSecondary', dataUser.phone_secondary);
      setValue('zipCode', dataUser.zip_code);
      setValue('street', dataUser.street);
      setValue('number', dataUser.number);
      setValue('block', dataUser.block!);
      setValue('lot', dataUser.lot!);
      setValue('complement', dataUser.complement!);
      setValue('citieCode', dataUser.citie_code);
      setValue('status', dataUser.status + 1);
      setUnitsSelected(dataUser.units);
    }
    setLoading(false);
  }

  async function getUnits() {
    const response = await getAllUnitsWithoutPagination();
    const dataUnits = response.data as ResponseGetModel;
    if (dataUnits !== null) {
      setUnits(dataUnits);
    }
  }

  async function onSubmit(data: DataProps) {
    const updateUser: DataUserModel = {
      id: Number(idUser),
      cpf: data.cpf.toString(),
      name: data.name.toString(),
      // profile: data.profile,
      email: data.email.toString(),
      phone_primary: data.phonePrimary.toString(),
      phone_secondary: data.phoneSecondary.toString(),
      zip_code: data.zipCode.toString(),
      citie_code: data.citieCode.toString(),
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
                mask={'cpfCnpj'}
                maxLength={14}
                control={control}
                error={errors.cpf?.message}
                containerStyle={{ width: '20%' }}
                className={styles.inputViewUser}
              />
              <InputForm
                placeholder={Strings.placeholderName}
                type="text"
                name="name"
                control={control}
                containerStyle={{ width: '65%' }}
                className={styles.inputViewUser}
                error={errors.name?.message}
              />
              {/* <InputForm
              placeholder={Strings.placeholderProfile}
              type="text"
              name="profile"
              control={control}
              containerStyle={{ width: '32.5%' }}
              className={styles.inputViewUser}
              error={errors.responsible?.message}
            /> */}
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderEmail}
                type="email"
                name="email"
                control={control}
                className={styles.inputViewUser}
                containerStyle={{ width: '55%' }}
                error={errors.email?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhonePrimay}
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
                mask={'cep'}
                maxLength={9}
                control={control}
                getValue={setCep}
                className={styles.inputViewUser}
                error={errors.zipCode?.message}
              />
              <InputForm
                placeholder={Strings.placeholderStreet}
                type="text"
                name="street"
                control={control}
                className={styles.inputViewUser}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
                type="text"
                name="number"
                control={control}
                className={styles.inputViewUser}
                error={errors.number?.message}
              />
              <InputForm
                placeholder={Strings.placeholderBlock}
                type="text"
                name="block"
                control={control}
                className={styles.inputViewUser}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                type="text"
                name="lot"
                control={control}
                className={styles.inputViewUser}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
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
                <InputForm
                  control={control}
                  name="state"
                  placeholder={Strings.placeholderState}
                  error={errors.state?.message}
                  readonly={true}
                  containerStyle={{ width: '25%' }}
                  className={styles.inputViewUser}
                />
                <InputForm
                  control={control}
                  name="citieCode"
                  readonly={true}
                  placeholder={Strings.placeholderCity}
                  error={errors.city?.message}
                  containerStyle={{ width: '25%' }}
                  className={styles.inputViewUser}
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
