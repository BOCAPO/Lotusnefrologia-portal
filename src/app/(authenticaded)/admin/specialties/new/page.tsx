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
import {
  createSpecialty,
  getAllSpecialties,
  getSpecialtiesPerPage
} from 'services/specialties';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewSpecialTyPage() {
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(1);

  React.useEffect(() => {
    getSpecialties();
  }, [page]);

  async function getSpecialties() {
    if (page === 1) {
      setData(null);
      const response = await getAllSpecialties();
      setData(response.data);
    } else {
      setData(null);
      const response = await getSpecialtiesPerPage(page);
      setData(response.data);
    }
    setLoading(false);
  }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  async function onSubmit(data: DataProps) {
    const dataStatus = Number(data.status) - 1;
    const newSpecialty: DataSpecialtiesModel = {
      description: data.specialty.toString(),
      status: Number(dataStatus)
    };
    const response = await createSpecialty(newSpecialty);
    if (response !== null) {
      setShowModalSuccess(true);
      resetField('specialty');
      resetField('status');
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 2500);
    }
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
                error={errors.specialty?.message?.toString()}
              />
              <SelectForm
                control={control}
                name="status"
                containerStyle={{ width: '25%' }}
                error={errors.timeOfAttendance?.message?.toString()}
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
            <div className={styles.btnCancelNewSpecialty}>
              <Button type="cancel" title={Strings.cancel} onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={Strings.messageSuccessInsertSpecialty}
      />
    </React.Fragment>
  );
}
