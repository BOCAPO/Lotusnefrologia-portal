/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { SelectForm } from 'components/SelectForm';
import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './modalboxinvoice.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { format, parse } from 'date-fns';
import { DataProductsModel } from 'models/DataProductsModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { createInvoice } from 'services/invoices';
import { convertInFloat, sanitizeData } from 'utils/formYupValidations';

type Props = {
  invoice?: any;
  onHide: () => void;
  show: boolean;
  units: DataUnitsModel[];
  products: DataProductsModel[];
  onError?: (error: boolean) => void;
  onUpdate?: (value: number) => void;
};

type DataProps = {
  [name: string]: string | number;
};

export default function ModalBoxInvoice({
  onHide,
  units,
  products,
  invoice,
  onError,
  onUpdate,
  ...props
}: Props & { show: boolean }) {
  const [selectedUnit, setSelectedUnit] = React.useState<number>(0);
  const [selectedProduct, setSelectedProduct] = React.useState<number>(0);
  const [listProducts, setListProducts] = React.useState<any[]>([]);
  const [valueProduct, setValueProduct] = React.useState<any>('0');
  const [editable, setEditable] = React.useState<boolean>(true);
  const [quantityProduct, setQuantityProduct] = React.useState<any>(0);
  const [valueUnit, setValueUnit] = React.useState<any>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [listProductsQuantity, setListProductsQuantity] =
    React.useState<any>(1);
  const [amountTotal, setAmountTotal] = React.useState<any>(0);
  let amount = 0;

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    if (invoice) {
      setEditable(false);
      loadValues();
    } else {
      setEditable(true);
    }
    setValue('amountDiscount', 'R$ 0,00');
  }, [listProductsQuantity, invoice]);

  const handleGetUnit = (selectedUnitCode: any) => {
    setSelectedUnit(selectedUnitCode);
  };

  const handleGetProduct = (selectedProductCode: any) => {
    setSelectedProduct(selectedProductCode);
  };

  function loadValues() {
    const jsonItem = JSON.parse(invoice);
    setValue(
      'date',
      format(parse(jsonItem.date, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
    );
    setValue('unit', jsonItem.unit_id);
    setValue('supplier', jsonItem.supplier);
    setValue('cnpj', jsonItem.cnpj);
    setValue('invoice', jsonItem.number);
    setValue('series', jsonItem.series);
    setValue('amountTotal', jsonItem.amount);
    setValue('amountDiscount', jsonItem.discount);
    setListProducts(jsonItem.products);
    setListProductsQuantity(jsonItem.products.length);
    jsonItem.products.map((item: any, index: number) => {
      setValue(`product${index}`, item.product_id);
      setValue(`unitValue${index}`, Number(item.value).toFixed(2).toString());
      setValue(`quantity${index}`, Number(item.quantity));
      setValue(`typeOfUnity${index}`, item.un);
    });
    setLoading(false);
  }

  function handleClean() {
    setSelectedUnit(0);
    setSelectedProduct(0);
    setListProducts([]);
    setValue('date', '');
    setValue('unit', '');
    setValue('supplier', '');
    setValue('cnpj', '');
    setValue('invoice', '');
    setValue('series', '');
    setValue('amountTotal', '');
    setValue('amountDiscount', 'R$ 0,00');
    setValue('product', '');
    setValue('unitValue', '');
    setValue('quantity', '');
    setValue('typeOfUnity', '');
    setAmountTotal(0);
    for (let i = 0; i < listProductsQuantity; i++) {
      setValue(`product${i}`, '');
      setValue(`unitValue${i}`, '');
      setValue(`quantity${i}`, '');
      setValue(`typeOfUnity${i}`, '');
    }
  }

  async function addNewProduct() {
    const newProduct = {
      product_id: Number(selectedProduct),
      quantity: Number(quantityProduct),
      value: Number(convertInFloat(valueProduct)),
      un: valueUnit
    };
    amount = amountTotal;
    amount =
      amount + Number(convertInFloat(valueProduct)) * Number(quantityProduct);
    setAmountTotal(amount);
    setValue(
      'amountTotal',
      'R$ ' + amount.toFixed(2).toString().replace('.', ',')
    );
    setValueProduct(0);
    setQuantityProduct(0);

    const updatedList = [...listProducts, newProduct];
    setListProducts(updatedList);
    setListProductsQuantity(listProductsQuantity + 1);
    setSelectedProduct(0);
    return updatedList; // Retorna a lista atualizad
  }

  async function removeProduct(index: number) {
    const newList = listProducts.filter((item, i) => i !== index);
    setListProducts(newList);
    setListProductsQuantity(listProductsQuantity - 1);
  }

  async function onSubmit(data: DataProps) {
    let updatedList = await addNewProduct();
    updatedList = updatedList.slice(1);
    setLoading(true);

    if (updatedList.length === 0) {
      onError && onError(true);
      setLoading(false);
      return;
    }

    const newInvoice = {
      supplier: data.supplier.toString(),
      unit_id: Number(selectedUnit),
      date: format(new Date(data.date), 'yyyy-MM-dd'),
      cnpj: sanitizeData(data.cnpj.toString()),
      number: data.invoice.toString(),
      series: data.series.toString(),
      amount: convertInFloat(data.amountTotal.toString()),
      discount:
        data.amountDiscount === '' ||
        data.amountDiscount === null ||
        data.amountDiscount === undefined ||
        data.amountDiscount === 'R$ 0,00'
          ? '0'
          : convertInFloat(data.amountDiscount.toString()),
      status: 0,
      products: updatedList
    };

    const response = await createInvoice(newInvoice);
    if (response !== null) {
      handleClean();
      onUpdate && onUpdate(1);
      onHide();
    }
    setLoading(false);
  }

  return (
    <Modal
      {...props}
      size="lg"
      centered
      show={props.show}
      className={styles.headBoxInvoice}
      onHide={() => {
        handleClean();
        onHide();
      }}
    >
      <Modal.Body className={styles.modalBoxInvoice}>
        <SmallMediumText
          text={Strings.insertNewInvoice}
          bold={true}
          color={Colors.gray90}
          style={{ lineHeight: 2, textAlign: 'left', width: '100%' }}
        />
        <div className={styles.twoColumns} style={{ marginBottom: '25px' }}>
          <SelectForm
            control={control}
            name="unit"
            containerStyle={{
              width: '100%',
              height: '40px'
            }}
            label={Strings.unit}
            item={Strings.unit}
            data={units}
            onSelectChange={handleGetUnit}
            error={errors.unit?.message?.toString()}
          />
        </div>
        <div className={styles.twoColumns} style={{ marginBottom: '25px' }}>
          <InputForm
            control={control}
            name="supplier"
            type="text"
            placeholder={Strings.supplier}
            label={Strings.supplier}
            containerStyle={{
              width: '70%',
              height: '40px'
            }}
            readonly={!editable}
            className={styles.inputNewInvoice}
            error={errors.supplier?.message?.toString()}
          />
          <InputForm
            control={control}
            name="date"
            type="date"
            placeholder={Strings.date}
            label={Strings.date}
            containerStyle={{
              width: '25%',
              height: '40px'
            }}
            readonly={!editable}
            className={styles.inputNewInvoice}
            error={errors.date?.message?.toString()}
          />
        </div>
        <div className={styles.twoColumns} style={{ marginBottom: '25px' }}>
          <InputForm
            control={control}
            name="cnpj"
            type="text"
            mask={'cpfCnpj'}
            maxLength={18}
            placeholder={Strings.placeholderCNJP}
            label={Strings.labelCNPJ}
            containerStyle={{
              width: '50%',
              height: '40px'
            }}
            readonly={!editable}
            className={styles.inputNewInvoice}
            error={errors.cnpj?.message?.toString()}
          />
          <InputForm
            control={control}
            name="invoice"
            type="number"
            min={0}
            placeholder={Strings.invoice}
            label={Strings.invoice}
            containerStyle={{
              width: '25%',
              height: '40px'
            }}
            readonly={!editable}
            className={styles.inputTypeNumberInvoice}
            error={errors.invoice?.message?.toString()}
          />
          <InputForm
            control={control}
            name="series"
            type="number"
            min={0}
            placeholder={Strings.series}
            label={Strings.series}
            containerStyle={{
              width: '15%',
              height: '40px'
            }}
            readonly={!editable}
            className={styles.inputTypeNumberInvoice}
            error={errors.series?.message?.toString()}
          />
        </div>
        <div className={styles.twoColumns} style={{ marginBottom: '15px' }}>
          <InputForm
            control={control}
            name="amountTotal"
            type="text"
            mask={'coin'}
            readonly={true}
            placeholder={Strings.amountTotal}
            label={Strings.amountTotal}
            containerStyle={{
              width: '70%',
              height: '40px'
            }}
            className={styles.inputNewInvoice}
          />
          <InputForm
            control={control}
            name="amountDiscount"
            type="text"
            mask={'coin'}
            placeholder={Strings.amountDiscount}
            label={Strings.amountDiscount}
            containerStyle={{
              width: '25%',
              height: '40px'
            }}
            readonly={!editable}
            className={styles.inputNewInvoice}
          />
        </div>
        <hr className={styles.hrInvoice} />
        <div className={styles.columnProducts} style={{ marginBottom: '15px' }}>
          {loading ? (
            <SpinnerLoading />
          ) : (
            listProducts !== null &&
            listProducts !== undefined &&
            listProducts.map((product, index) => (
              <React.Fragment key={index}>
                <div className={styles.columnProductsInter}>
                  <SelectForm
                    control={control}
                    name={`product${index}`}
                    containerStyle={{
                      width: '55%',
                      height: '40px'
                    }}
                    label={Strings.product}
                    item={Strings.product}
                    data={products}
                    onSelectChange={(selectedProductCode) =>
                      handleGetProduct(selectedProductCode)
                    }
                  />
                  <InputForm
                    control={control}
                    name={`unitValue${index}`}
                    type="text"
                    mask={'coin'}
                    min={1}
                    getValue={setValueProduct}
                    placeholder={Strings.valueUnit}
                    label={Strings.valueUnit}
                    containerStyle={{
                      width: '15%',
                      height: '40px'
                    }}
                    readonly={!editable}
                    className={styles.inputTypeNumberInvoice}
                  />
                  <InputForm
                    control={control}
                    name={`quantity${index}`}
                    type="number"
                    min={1}
                    placeholder={Strings.quantity}
                    getValue={setQuantityProduct}
                    label={Strings.quantity}
                    containerStyle={{
                      width: '12%',
                      height: '40px'
                    }}
                    readonly={!editable}
                    className={styles.inputTypeNumberInvoice}
                  />
                  <InputForm
                    control={control}
                    name={`typeOfUnity${index}`}
                    type="text"
                    getValue={setValueUnit}
                    placeholder={Strings.typeOfUnity}
                    label={Strings.typeOfUnity}
                    containerStyle={{
                      width: '10%',
                      height: '40px'
                    }}
                    readonly={!editable}
                    className={styles.inputNewInvoice}
                  />
                </div>
              </React.Fragment>
            ))
          )}
        </div>
        {editable ? (
          <React.Fragment>
            <div className={styles.boxInvoiceAddItems}>
              <button title={Strings.items} onClick={() => addNewProduct()}>
                <Icon
                  typeIcon={TypeIcon.Add}
                  size={15}
                  color={Colors.gray90}
                  callback={() => {}}
                />
                Itens
              </button>
            </div>
            <div className={styles.boxInvoiceBtns}>
              <div className={styles.btnDefault}>
                <Button
                  title={Strings.save}
                  type="secondary"
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
              <div className={styles.btnDefault}>
                <Button
                  title={Strings.cancel}
                  type="cancel"
                  onClick={() => {
                    handleClean();
                    onHide();
                  }}
                />
              </div>
            </div>
          </React.Fragment>
        ) : (
          <></>
        )}
      </Modal.Body>
    </Modal>
  );
}
