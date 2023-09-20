'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { FormTwoColumns } from 'components/FormTwoColumns';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SmallMediumText } from 'components/Text';

import styles from './dishesnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataDishesModel } from 'models/DataDishesModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { getDishesCategoryWithoutPagination } from 'services/disheCategory';
import { getAllDishes, getDishesPerPage } from 'services/dishes';
import { statusGeneral, typeOfDishe } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewDishePage() {
  const [data, setData] = React.useState<any>(null);
  const [disheCategory, setDisheCategory] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [quantityDishes, setQuantityDishes] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [selectedDishe, setSelectedDishe] = React.useState<any>(null);
  const [message, setMessage] = React.useState<string>('');
  const [activeForm, setActiveForm] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState([] as any);

  const onDrop = (acceptedFiles: any) => {
    setFiles(acceptedFiles);
  };

  const filesList = files.map((file: any) => (
    <p key={file.name}>
      {file.name} - {file.size} bytes
    </p>
  ));

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['png'],
      'image/jpeg': ['jpeg', 'jpg']
    },
    maxFiles: 1
  });

  React.useEffect(() => {
    getDishes();
    getDishesCategory();
  }, [quantityDishes, selectedDishe, page]);

  async function getDishes() {
    if (page === 1) {
      setData(null);
      const response = await getAllDishes();
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityDishes(data.total);
    } else {
      setData(null);
      const response = await getDishesPerPage(page);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityDishes(data.total);
    }
    setLoading(false);
  }

  async function getDishesCategory() {
    const response = await getDishesCategoryWithoutPagination();
    const data = response.data as ResponseGetModel;
    setDisheCategory(data);
  }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  async function deleteDisheId() {
    const response = await deleteProduct(selectedDishe.id);
    if (response !== null) {
      setQuantityDishes(quantityDishes - 1);
      setMessage(Strings.messageSuccessDeleteProduct);
      setShowModalSuccess(true);
      setValue('dishe', '');
      setValue('status', 0);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3500);
    }
  }

  async function fileToDataURI(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataURI = event?.target?.result;
        resolve(dataURI);
      };

      reader.onerror = (event) => {
        reject(event?.target?.error);
      };

      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(data: DataProps) {
    const dataStatus = Number(data.status) - 1;
    let response = null;
    if (selectedDishe !== null) {
      const newProduct: DataDishesModel = {
        description: data.product.toString(),
        status: Number(dataStatus)
      };
      response = await updateProduct(newProduct, selectedDishe.id);
      setMessage(Strings.messageSuccessUpdateProduct);
    } else {
      const newProduct: DataDishesModel = {
        description: data.product.toString(),
        status: Number(dataStatus)
      };
      response = await createProduct(newProduct);
      setMessage(Strings.messageSuccessInsertProduct);
    }
    if (response !== null) {
      setQuantityDishes(quantityDishes + 1);
      setShowModalSuccess(true);
      setValue('product', '');
      setValue('status', 0);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 2500);
    }
  }

  function handleItemSelection(firstId: any) {
    const dataDisheSelected = data?.data?.filter(
      (element: DataDishesModel) => element.id === Number(firstId)
    )[0];

    setSelectedDishe(dataDisheSelected);
    setValue('product', dataDisheSelected.description);
    setValue('status', Number(dataDisheSelected.status) + 1);
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyDishes}>
        <div style={{ width: '30%' }}>
          <FormTwoColumns
            headers={Strings.headersDishes}
            headersResponse={Strings.headersResponseNewDished}
            response={data}
            isLoading={loading}
            type="newDishe"
            onClick={handleSelectionPage}
            onItemClick={handleItemSelection}
          />
        </div>
        <div className={styles.formInserDishes}>
          <div className={styles.titleDishes}>
            <SmallMediumText
              text={Strings.insertProduct}
              style={{ textAlign: 'left', lineHeight: 2 }}
              bold={true}
              color={Colors.gray90}
            />
          </div>
          <div className={styles.bodySelectDishes}>
            {activeForm && (
              <React.Fragment>
                <div
                  {...getRootProps({ className: 'dropzone' })}
                  className={styles.imgDishe}
                >
                  {filesList.length === 0 ? (
                    <React.Fragment>
                      <Icon
                        typeIcon={TypeIcon.Upload}
                        size={30}
                        color={Colors.greenDark2}
                      />
                      <input {...getInputProps()} />
                      <p>{Strings.selectOrDropFile}</p>
                      <p>{Strings.typesFilesAccpetedDishe}</p>
                    </React.Fragment>
                  ) : (
                    <div>{filesList}</div>
                  )}
                </div>
                <div className={styles.columnDishe}>
                  <div className={styles.newDishes}>
                    <InputForm
                      control={control}
                      name="name"
                      type="text"
                      containerStyle={{ width: '40%' }}
                      style={{ height: '40px' }}
                      placeholder={Strings.nameOfDishe}
                      label={Strings.nameOfDishe}
                      error={errors.name?.message?.toString()}
                    />
                    <SelectForm
                      control={control}
                      item={Strings.disheCategory}
                      name="disheCategory"
                      containerStyle={{ width: '25%' }}
                      error={errors.disheCategory?.message?.toString()}
                      data={disheCategory}
                    />
                    <SelectForm
                      control={control}
                      item={Strings.typeOfDishe}
                      name="typeOfDishe"
                      containerStyle={{ width: '25%' }}
                      error={errors.typeOfDishe?.message?.toString()}
                      data={typeOfDishe}
                    />
                  </div>
                  <div className={styles.secondLineNewDishes}>
                    <textarea
                      name="description"
                      placeholder={Strings.description}
                      maxLength={200}
                      className={styles.textAreaDivDescriptionDishe}
                    />
                    <SelectForm
                      control={control}
                      item={Strings.status}
                      name="status"
                      containerStyle={{ width: '25%' }}
                      error={errors.status?.message?.toString()}
                      data={statusGeneral}
                    />
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className={styles.footerNewDishes}>
            {activeForm && (
              <React.Fragment>
                <div className={styles.btnSaveNewDishes}>
                  <Button
                    type="secondary"
                    title={Strings.save}
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
                <div className={styles.btnDeleteNewDishes}>
                  <Button
                    type="secondary"
                    title={Strings.erase}
                    onClick={() => {
                      deleteDisheId();
                    }}
                  />
                </div>
              </React.Fragment>
            )}
            <div className={styles.btnCancelNewDishes}>
              <Button
                type="cancel"
                title={Strings.new}
                onClick={() => {
                  setActiveForm(true);
                  setValue('product', '');
                  setValue('status', 0);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={message}
      />
    </React.Fragment>
  );
}
