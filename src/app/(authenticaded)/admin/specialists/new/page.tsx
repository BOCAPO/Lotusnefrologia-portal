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

import styles from './specialistsnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';
import { DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getAllCities } from 'services/cities';
import { getAllSpecialties } from 'services/specialties';
import { getAllStates } from 'services/states';
import { getAllUnits } from 'services/units';
import { statusUnit } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewSpecialistPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [specialties, setSpecialties] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);

  const {
    control,
    // handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getStates();
    getSpecialities();
    getUnits();
  }, []);

  async function getStates() {
    const response = await getAllStates();
    const statesUpdated = response.data.data as DataStatesModel[];
    setStates(statesUpdated.slice().sort((a, b) => a.UF.localeCompare(b.UF)));
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

  async function getSpecialities() {
    const response = await getAllSpecialties();
    const specialtiesUpdated = response.data.data as DataSpecialtiesModel[];
    setSpecialties(
      specialtiesUpdated
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description))
    );
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
      <div className={styles.bodyNewSpecialist}>
        <div className={styles.headerNewSpecialist}>
          <SmallMediumText
            text={Strings.insertSpecialist}
            bold={true}
            color={Colors.gray90}
            style={{ lineHeight: '5px' }}
          />
        </div>
        <div className={styles.formNewSpecialist}>
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
              style={{ height: '40px', padding: '22px' }}
            />
            <InputForm
              placeholder={Strings.placeholderName}
              type="text"
              name="name"
              control={control}
              containerStyle={{ width: '42.5%' }}
              style={{ height: '40px', padding: '22px' }}
              error={errors.name?.message}
            />
            <InputForm
              placeholder={Strings.placeholderResponsable}
              type="text"
              name="profile"
              control={control}
              containerStyle={{ width: '32.5%' }}
              style={{ height: '40px', padding: '22px' }}
              error={errors.responsible?.message}
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
              className={styles.newSpecialistDataGeografic}
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
                data={statusUnit}
                error={errors.status?.message}
                containerStyle={{ width: '50%' }}
              />
              <SelectForm
                control={control}
                name="speciality"
                data={specialties !== null ? specialties : null}
                error={errors.speciality?.message}
                containerStyle={{ width: '50%' }}
              />
              <div style={{ height: '40px', minWidth: '20%' }}>
                <Button type="cancel" title={Strings.resetPasswordSpecialist} />
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
        <div className={styles.footerNewSpecialist}>
          <div className={styles.btnSaveNewSpecialist}>
            <Button
              type="secondary"
              title={Strings.save}
              // onClick={handleSubmit(onSubmit)}
            />
          </div>
          <div className={styles.btnCancelNewSpecialist}>
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
        message={Strings.messageSuccessInsertSpecialist}
      />
    </React.Fragment>
  );
}
