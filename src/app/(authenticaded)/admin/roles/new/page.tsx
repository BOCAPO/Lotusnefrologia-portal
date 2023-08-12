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
import { getAllRoles } from 'services/roles';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewRolePage() {
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    getRoles();
  }, []);

  async function getRoles() {
    const response = await getAllRoles();
    setData(response.data);
    setLoading(false);
  }

  const {
    control,
    // handleSubmit,
    // resetField,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  // async function onSubmit(data: DataProps) {
  //   const dataStatus = Number(data.status) - 1;
  //   const newSpecialty: DataSpecialtiesModel = {
  //     description: data.specialty.toString(),
  //     status: Number(dataStatus)
  //   };
  //   const response = await createSpecialty(newSpecialty);
  //   if (response !== null) {
  //     setShowModalSuccess(true);
  //     resetField('specialty');
  //     resetField('status');
  //     setTimeout(() => {
  //       setShowModalSuccess(false);
  //     }, 2500);
  //   }
  // }

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
                // onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnCancelNewRole}>
              <Button type="cancel" title={Strings.cancel} onClick={() => {}} />
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
