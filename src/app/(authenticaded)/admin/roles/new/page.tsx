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

import styles from './rolesnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataRolesModel } from 'models/DataRolesModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRolesPerPage
} from 'services/roles';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewRolePage() {
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);
  const [quantityRoles, setQuantityRoles] = React.useState<number>(0);
  const [selectedRole, setSelectedRole] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(1);

  React.useEffect(() => {
    getRoles();
  }, [quantityRoles, page]);

  async function getRoles() {
    if (page === 1) {
      setData(null);
      const response = await getAllRoles();
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityRoles(data.total);
    } else {
      setData(null);
      const response = await getRolesPerPage(page);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityRoles(data.total);
    }
    setLoading(false);
  }

  const {
    control,
    handleSubmit,
    resetField,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  async function deleteRoleID() {
    const response = await deleteRole(selectedRole.id);
    if (response !== null) {
      setQuantityRoles(quantityRoles - 1);
      setSelectedRole(null);
      setValue('role', '');
      resetField('role');
      setShowModalSuccess(true);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3500);
    }
  }

  async function onSubmit(data: DataProps) {
    const newRole: DataRolesModel = {
      field_name: data.role.toString()
    };
    const response = await createRole(newRole);
    if (response !== null) {
      setShowModalSuccess(true);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3000);
    }
  }

  function handleItemSelection(firstId: any) {
    const dataRoleSelected = data?.data?.filter(
      (element: DataRolesModel) => element.id === Number(firstId)
    )[0];

    setSelectedRole(dataRoleSelected);
    setValue('role', dataRoleSelected.field_name);
    setValue('status', Number(dataRoleSelected.blocked) + 1);
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyRole}>
        <div style={{ width: '30%' }}>
          <FormTwoColumns
            headers={Strings.headersNewRole}
            headersResponse={Strings.headersResponseNewSpecialties}
            response={data}
            isLoading={loading}
            type="newRole"
            onClick={handleSelectionPage}
            onItemClick={handleItemSelection}
          />
        </div>
        <div className={styles.formInserRole}>
          <div className={styles.titleRole}>
            <SmallMediumText
              text={Strings.insertRole}
              style={{ textAlign: 'left', lineHeight: 2 }}
              bold={true}
              color={Colors.gray90}
            />
          </div>
          <div className={styles.bodySelectRole}>
            <div className={styles.newRole}>
              <InputForm
                control={control}
                name="role"
                type="text"
                containerStyle={{ width: '40%' }}
                style={{ height: '40px' }}
                placeholder={Strings.description}
                error={errors.Role?.message?.toString()}
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
          <div className={styles.footerNewRole}>
            <div className={styles.btnSaveNewRole}>
              <Button
                type="secondary"
                title={Strings.save}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnDeleteNewRole}>
              <Button
                type="secondary"
                title={Strings.erase}
                onClick={() => {
                  deleteRoleID();
                }}
              />
            </div>
            <div className={styles.btnCancelNewRole}>
              <Button
                type="cancel"
                title={Strings.cancel}
                onClick={() => {
                  setValue('role', '');
                  resetField('role');
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={Strings.messageSuccessInsertRole}
      />
    </React.Fragment>
  );
}
