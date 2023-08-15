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
import { DataUserModel } from 'models/DataUserModel';
import { Prefs } from 'repository/Prefs';
import { getUserById } from 'services/users';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function ViewUserPage() {
  const router = useRouter();
  const idUser = Prefs.getIdUser();
  const [loading, setLoading] = React.useState<boolean>(true);

  const {
    control,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getUser();
  }, [idUser]);

  async function getUser() {
    const response = await getUserById(Number(idUser));
    const dataUser = response.data as DataUserModel;
    if (dataUser !== null) {
      setValue('cpf', dataUser.cpf);
      setValue('name', dataUser.name);
      setValue('email', dataUser.email);
      setValue('phonePrimary', dataUser.phone_primary);
      setValue('phoneSecondary', dataUser.phone_secondary);
      setValue('zipCode', dataUser.zip_code);
      setValue('street', dataUser.street);
      setValue('number', dataUser.number);
      setValue('block', dataUser.block);
      setValue('lot', dataUser.lot);
      setValue(
        'complement',
        dataUser.complement !== null ? dataUser.complement : ''
      );
      setValue('citieCode', dataUser.citie_code);
      setValue('status', dataUser.status + 1);
    }
    setLoading(false);
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
                readonly={true}
                control={control}
                error={errors.cpf?.message}
                containerStyle={{ width: '20%' }}
                className={styles.inputViewUser}
              />
              <InputForm
                placeholder={Strings.placeholderName}
                type="text"
                name="name"
                readonly={true}
                control={control}
                containerStyle={{ width: '42.5%' }}
                className={styles.inputViewUser}
                error={errors.name?.message}
              />
              <InputForm
                placeholder={Strings.placeholderProfile}
                type="text"
                name="profile"
                readonly={true}
                control={control}
                containerStyle={{ width: '32.5%' }}
                className={styles.inputViewUser}
                error={errors.responsible?.message}
              />
            </div>
            <div style={{ marginBottom: '3vh' }}>
              <InputForm
                placeholder={Strings.placeholderEmail}
                type="email"
                name="email"
                readonly={true}
                control={control}
                className={styles.inputViewUser}
                containerStyle={{ width: '65%' }}
                error={errors.email?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhonePrimay}
                type="text"
                name="phonePrimary"
                control={control}
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
                readonly={true}
                control={control}
                className={styles.inputViewUser}
                error={errors.number?.message}
              />
              <InputForm
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
                <InputForm
                  control={control}
                  name="citieCode"
                  placeholder={Strings.placeholderCity}
                  readonly={true}
                  error={errors.city?.message}
                  containerStyle={{ width: '30%' }}
                  className={styles.inputViewUser}
                />
                <SelectForm
                  control={control}
                  name="status"
                  data={statusGeneral}
                  error={errors.status?.message}
                  containerStyle={{ width: '40%' }}
                />
                <div style={{ height: '40px', minWidth: '20%' }}>
                  <Button type="cancel" title={Strings.resetPasswordUser} />
                </div>
              </div>
            </div>
            {/* <div>
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
            </div> */}
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
