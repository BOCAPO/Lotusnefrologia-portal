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
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';
import { DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getAllCities } from 'services/cities';
import { createSpecialist } from 'services/specialists';
import { getSpecialtiesWithoutPagination } from 'services/specialties';
import { getAllStates } from 'services/states';
import { getAllUnitsWithoutPagination } from 'services/units';
import { statusGeneral } from 'utils/enums';

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
  const [unitsSelected, setUnitsSelected] = React.useState<any>([]);
  const [quantityUnitsSelected, setQuantityUnitsSelected] = React.useState(0);
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [speciatiesSelected, setSpecialtiesSelected] = React.useState<any>([]);
  const [quantitySpecialtiesSelected, setQuantitySpecialtiesSelected] =
    React.useState(0);

  const {
    control,
    handleSubmit,
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

  async function getUnits() {
    const response = await getAllUnitsWithoutPagination();
    const unitsUpdated = response.data as unknown as DataUnitsModel[];
    setUnits(unitsUpdated.slice().sort((a, b) => a.name.localeCompare(b.name)));
  }

  const handleStateCode = (selectedStateCode: any) => {
    getCities(selectedStateCode.toString());
  };

  async function getUnitsSelected(
    data: DataSpecialistsModel[] | DataSpecialistsModel | null = null
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
      data?.units.forEach((unit: any) => {
        unitsSelectedUpdated.push(unit.id);
      });
      setUnitsSelected(unitsSelectedUpdated);
    }
  }

  async function onSubmit(data: DataProps) {
    getUnitsSelected();
    const newSpecialist: DataSpecialistsModel = {
      cpf: data.cpf.toString(),
      name: data.name.toString(),
      email: data.email.toString(),
      phone_primary: data.phonePrimary.toString(),
      phone_secondary: data.phoneSecondary.toString(),
      zip_code: data.zipCode.toString(),
      street: data.street.toString(),
      number: data.number.toString(),
      block: data.block?.toString(),
      lot: data.lot?.toString(),
      complement: data.complement?.toString(),
      citie_code: data.citieCode.toString(),
      status: Number(data.status) - 1,
      specialties: speciatiesSelected,
      units: unitsSelected
    };

    const response = await createSpecialist(newSpecialist);
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {
        router.back();
      }, 3000);
    }
  }

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
              label={Strings.labelCPF}
              type="text"
              name="cpf"
              mask={'cpfCnpj'}
              maxLength={14}
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
              label={Strings.labelPhone}
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
              label={Strings.labelZipCode}
              type="text"
              name="zipCode"
              mask={'cep'}
              containerStyle={{ width: '10%' }}
              maxLength={9}
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.zipCode?.message}
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
              containerStyle={{ width: '10%' }}
              name="number"
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
              type="text"
              containerStyle={{ width: '10%' }}
              name="lot"
              control={control}
              style={{ height: '40px', padding: '22px' }}
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
                item={Strings.labelState}
                data={states}
                error={errors.state?.message}
                onSelectChange={handleStateCode}
                containerStyle={{ width: '25%' }}
              />
              <SelectForm
                control={control}
                item={Strings.labelCity}
                name="citieCode"
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
                containerStyle={{ width: '15%' }}
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
                                speciatiesSelected?.indexOf(specialty.id) !== -1
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
                                  speciatiesSelectedUpdated?.push(specialty.id);
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
                        <td>{specialty.status === 0 ? 'Ativo' : 'Inativo'}</td>
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
              onClick={handleSubmit(onSubmit)}
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
