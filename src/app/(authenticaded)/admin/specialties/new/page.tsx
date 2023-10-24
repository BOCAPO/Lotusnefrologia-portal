'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { FormTwoColumns } from 'components/FormTwoColumns';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SmallMediumText } from 'components/Text';

import styles from './specialtiesnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import {
  createSpecialty,
  deleteSpecialty,
  getAllSpecialties,
  getSpecialtiesBySearch,
  getSpecialtiesPerPage,
  updateSpecialty
} from 'services/specialties';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewSpecialTyPage() {
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);
  const [search, setSearch] = React.useState<string>('');
  const [quantitySpecialties, setQuantitySpecialties] =
    React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<any>(null);

  React.useEffect(() => {
    if (search === '') {
      getSpecialties();
    }
  }, [quantitySpecialties, selectedSpecialty, page, search]);

  async function getSpecialties() {
    if (page === 1) {
      setData(null);
      const response = await getAllSpecialties();
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantitySpecialties(data.total);
    } else {
      setData(null);
      const response = await getSpecialtiesPerPage(page);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantitySpecialties(data.total);
    }
    setLoading(false);
  }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  async function handleSearch(search: string) {
    if (search === '') {
      getSpecialties();
    } else {
      setSearch(search);
    }
  }

  async function executeSearch(signal: boolean) {
    if (signal) {
      const response = await getSpecialtiesBySearch(search);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantitySpecialties(data.total);
    }
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  async function deleteSpecialtyId() {
    const response = await deleteSpecialty(selectedSpecialty.id);
    if (response !== null) {
      setQuantitySpecialties(quantitySpecialties - 1);
      setShowModalSuccess(true);
      setValue('specialty', '');
      setValue('status', 0);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3500);
    }
  }

  async function onSubmit(data: DataProps) {
    const dataStatus = Number(data.status) - 1;
    let response = null;
    if (selectedSpecialty !== null) {
      const newSpecialty: DataSpecialtiesModel = {
        description: data.specialty.toString(),
        status: Number(dataStatus)
      };
      response = await updateSpecialty(newSpecialty, selectedSpecialty.id);
    } else {
      const newSpecialty: DataSpecialtiesModel = {
        description: data.specialty.toString(),
        status: Number(dataStatus)
      };
      response = await createSpecialty(newSpecialty);
    }
    if (response !== null) {
      setQuantitySpecialties(quantitySpecialties + 1);
      setShowModalSuccess(true);
      handleClean();
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 2500);
    }
  }

  function handleItemSelection(firstId: any) {
    const dataSpecialtySelected = data?.data?.filter(
      (element: DataSpecialtiesModel) => element.id === Number(firstId)
    )[0];

    setSelectedSpecialty(dataSpecialtySelected);
    setValue('specialty', dataSpecialtySelected.description);
    setValue('status', Number(dataSpecialtySelected.status) + 1);
  }

  async function handleClean() {
    setSelectedSpecialty(null);
    setValue('specialty', '');
    setValue('status', 0);
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodySpecialty}>
        <div style={{ width: '30%' }}>
          <FormTwoColumns
            headers={Strings.headersSpecialty}
            headersResponse={Strings.headersResponseNewSpecialties}
            response={data}
            isLoading={loading}
            type="newSpecialty"
            onClick={handleSelectionPage}
            onItemClick={handleItemSelection}
            onSearch={handleSearch}
            startSearch={executeSearch}
          />
        </div>
        <div className={styles.formInserSpecialty}>
          <div className={styles.titleSpecialty}>
            <SmallMediumText
              text={Strings.insertSpecialty}
              style={{ textAlign: 'left', lineHeight: 2 }}
              bold={true}
              color={Colors.gray90}
            />
          </div>
          <div className={styles.bodySelectSpecialty}>
            <div className={styles.newSpecialty}>
              <InputForm
                control={control}
                name="specialty"
                type="text"
                containerStyle={{ width: '40%' }}
                style={{ height: '40px' }}
                placeholder={Strings.description}
                label={Strings.description}
                error={errors.specialty?.message?.toString()}
              />
              <SelectForm
                control={control}
                item={Strings.status}
                label={Strings.status}
                name="status"
                containerStyle={{ width: '25%' }}
                error={errors.status?.message?.toString()}
                data={statusGeneral}
              />
            </div>
          </div>
          <div className={styles.footerNewSpecialty}>
            <div className={styles.btnSaveNewSpecialty}>
              <Button
                type="secondary"
                title={Strings.save}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnDeleteNewSpecialty}>
              <Button
                type="secondary"
                title={Strings.erase}
                onClick={() => {
                  deleteSpecialtyId();
                  handleClean();
                }}
              />
            </div>
            <div className={styles.btnCancelNewSpecialty}>
              <Button
                type="cancel"
                title={Strings.cancel}
                onClick={() => {
                  handleClean();
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={
          selectedSpecialty !== null
            ? Strings.messageSuccessUpdateSpecialty
            : Strings.messageSuccessInsertSpecialty
        }
      />
    </React.Fragment>
  );
}
