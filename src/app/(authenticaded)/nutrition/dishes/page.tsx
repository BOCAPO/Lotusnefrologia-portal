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

import styles from './dishesnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataProductsModel } from 'models/DataProductsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsPerPage,
  updateProduct
} from 'services/products';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewDishePage() {
  const [data, setData] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [quantityDishes, setQuantityDishes] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [selectedDishe, setSelectedDishe] = React.useState<any>(null);
  const [message, setMessage] = React.useState<string>('');

  React.useEffect(() => {
    getDishes();
  }, [quantityDishes, selectedDishe, page]);

  async function getDishes() {
    if (page === 1) {
      setData(null);
      const response = await getAllProducts();
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityDishes(data.total);
    } else {
      setData(null);
      const response = await getProductsPerPage(page);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityDishes(data.total);
    }
    setLoading(false);
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

  async function deleteProductId() {
    const response = await deleteProduct(selectedDishe.id);
    if (response !== null) {
      setQuantityDishes(quantityDishes - 1);
      setMessage(Strings.messageSuccessDeleteProduct);
      setShowModalSuccess(true);
      setValue('product', '');
      setValue('status', 0);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3500);
    }
  }

  async function onSubmit(data: DataProps) {
    const dataStatus = Number(data.status) - 1;
    let response = null;
    if (selectedDishe !== null) {
      const newProduct: DataProductsModel = {
        description: data.product.toString(),
        status: Number(dataStatus)
      };
      response = await updateProduct(newProduct, selectedDishe.id);
      setMessage(Strings.messageSuccessUpdateProduct);
    } else {
      const newProduct: DataProductsModel = {
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
    const dataProductSelected = data?.data?.filter(
      (element: DataProductsModel) => element.id === Number(firstId)
    )[0];

    setSelectedDishe(dataProductSelected);
    setValue('product', dataProductSelected.description);
    setValue('status', Number(dataProductSelected.status) + 1);
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyProducts}>
        <div style={{ width: '30%' }}>
          <FormTwoColumns
            headers={Strings.headersProducts}
            headersResponse={Strings.headersResponseNewProducts}
            response={data}
            isLoading={loading}
            type="newProduct"
            onClick={handleSelectionPage}
            onItemClick={handleItemSelection}
          />
        </div>
        <div className={styles.formInserProducts}>
          <div className={styles.titleProducts}>
            <SmallMediumText
              text={Strings.insertProduct}
              style={{ textAlign: 'left', lineHeight: 2 }}
              bold={true}
              color={Colors.gray90}
            />
          </div>
          <div className={styles.bodySelectProducts}>
            <div className={styles.newProducts}>
              <InputForm
                control={control}
                name="product"
                type="text"
                containerStyle={{ width: '40%' }}
                style={{ height: '40px' }}
                placeholder={Strings.descriptionOfProduct}
                label={Strings.description}
                error={errors.product?.message?.toString()}
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
          <div className={styles.footerNewProducts}>
            <div className={styles.btnSaveNewProducts}>
              <Button
                type="secondary"
                title={Strings.save}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnDeleteNewProducts}>
              <Button
                type="secondary"
                title={Strings.erase}
                onClick={() => {
                  deleteProductId();
                }}
              />
            </div>
            <div className={styles.btnCancelNewProducts}>
              <Button
                type="cancel"
                title={Strings.cancel}
                onClick={() => {
                  setSelectedDishe(null);
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
