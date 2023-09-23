'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { FormTwoColumns } from 'components/FormTwoColumns';
import ImageInput from 'components/ImageInput';
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
import { DataUnitsModel } from 'models/DataUnitsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { Prefs } from 'repository/Prefs';
import { getDishesCategoryWithoutPagination } from 'services/disheCategory';
import {
  createDishe,
  deleteDishe,
  getAllDishes,
  getDishesPerPage,
  updateDishe
} from 'services/dishes';
import { getAllUnitsWithoutPagination } from 'services/units';
import { statusGeneral, typeOfDishe } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewDishePage() {
  const [data, setData] = React.useState<any>(null);
  const [disheCategory, setDisheCategory] = React.useState<any>(null);
  const [selectedDisheCategory, setSelectedDisheCategory] =
    React.useState<any>(0);
  const [units, setUnits] = React.useState<any>(null);
  const [selectedUnit, setSelectedUnit] = React.useState<number>(0);
  const [inputDescriptionDishe, setInputDescriptionDishe] =
    React.useState<string>('');
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [quantityDishes, setQuantityDishes] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [selectedDishe, setSelectedDishe] = React.useState<any>(null);
  const [message, setMessage] = React.useState<string>('');
  const [activeForm, setActiveForm] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<string>('');

  React.useEffect(() => {
    getDishes();
    getDishesCategory();
    getUnits();
  }, [quantityDishes, selectedDishe, page, activeForm]);

  async function getDishes() {
    if (page === 1) {
      setData(null);
      const response = await getAllDishes();
      const data = response.data as ResponseGetModel;
      let dataUpdated = data.data as DataDishesModel[];
      dataUpdated = dataUpdated?.slice().sort((a: any, b: any) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      data.data = dataUpdated;
      setData(data);
      setQuantityDishes(data.total);
    } else {
      setData(null);
      const response = await getDishesPerPage(page);
      const data = response.data as ResponseGetModel;
      let dataUpdated = data.data as DataDishesModel[];
      dataUpdated = dataUpdated?.slice().sort((a: any, b: any) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      data.data = dataUpdated;
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

  async function getUnits() {
    let unitsPermited = JSON.parse(Prefs.getUnits()!);
    unitsPermited = unitsPermited!.map((item: DataUnitsModel) => item.id);
    const response = await getAllUnitsWithoutPagination();
    const unitsUpdated = response.data as unknown as DataUnitsModel[];
    const newUnitsPermitd: any = [];
    unitsUpdated.map((item: any) => {
      unitsPermited?.map((item2: any) => {
        if (item.id === item2) {
          newUnitsPermitd.push(item);
        }
      });
    });
    setUnits(
      newUnitsPermitd.sort((a: DataUnitsModel, b: DataUnitsModel) =>
        a.name.localeCompare(b.name)
      )
    );
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

  function handleClean() {
    setValue('name', '');
    setValue('disheCategory', 0);
    setValue('typeOfDishe', 0);
    setValue('unit', 0);
    setValue('dishe', '');
    setValue('status', 0);
    setFile('false');
    handleImageUpload(null);
    setInputDescriptionDishe('');
    setSelectedUnit(0);
    setSelectedDisheCategory(0);
    setSelectedDishe(null);
  }

  async function deleteDisheId() {
    const response = await deleteDishe(selectedDishe.id);
    if (response !== null) {
      setMessage(Strings.messageSuccessDeleteDishe);
      setShowModalSuccess(true);
      handleClean();
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3500);
    }
  }

  const handleGetUnit = (selectedUnitCode: any) => {
    setSelectedUnit(selectedUnitCode);
  };

  const handleGetDisheCategory = (selectedDisheCategoryCode: any) => {
    setSelectedDisheCategory(selectedDisheCategoryCode);
  };

  async function onSubmit(data: DataProps) {
    let response = null;
    const photo_change = file.indexOf('http') > -1 ? false : true;

    if (selectedDishe !== null) {
      const newDishe: Omit<DataDishesModel, 'id'> = {
        unit_id: selectedUnit === 0 ? selectedDishe.unit_id : selectedUnit,
        name: data.name.toString(),
        category_id:
          selectedDisheCategory === 0
            ? selectedDishe.category_id
            : selectedDisheCategory,
        description: inputDescriptionDishe,
        isFixed: data.typeOfDishe.toString() === '1' ? true : false,
        status: data.status.toString() === '1' ? true : false,
        file: file,
        photo_change: photo_change
      };
      response = await updateDishe(selectedDishe.id, newDishe);
      setMessage(Strings.messageSuccesUpdateDishe);
    } else {
      const newProduct: DataDishesModel = {
        unit_id: selectedUnit,
        name: data.name.toString(),
        category_id: selectedDisheCategory,
        description: inputDescriptionDishe,
        isFixed: data.typeOfDishe === '1' ? true : false,
        status: data.status === '1' ? true : false,
        file: file
      };
      response = await createDishe(newProduct);
      setMessage(Strings.messageSuccessInsertDishe);
    }
    if (response !== null) {
      setQuantityDishes(quantityDishes + 1);
      setShowModalSuccess(true);
      handleClean();
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 2500);
    }
  }

  function handleItemSelection(firstId: any) {
    const dataDisheSelected = data?.data?.filter(
      (element: DataDishesModel) => element.id === Number(firstId)
    )[0];

    setActiveForm(true);
    setSelectedDishe(dataDisheSelected);
    setInputDescriptionDishe(dataDisheSelected?.description);
    setValue('name', dataDisheSelected?.name);
    setValue('disheCategory', dataDisheSelected?.category_id);
    setValue('typeOfDishe', dataDisheSelected?.isFixed ? 1 : 2);
    setValue('unit', dataDisheSelected?.unit_id);
    setValue('status', dataDisheSelected?.status ? 1 : 2);
    setFile(dataDisheSelected?.photo_path);
  }

  const handleImageUpload = (imageDataUrl: any) => {
    setFile(imageDataUrl);
  };

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
                <div className={styles.imgDishe}>
                  <ImageInput
                    onImageUpload={handleImageUpload}
                    imageUrl={file}
                  />
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
                      onSelectChange={handleGetDisheCategory}
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
                    <div className={styles.divTextAreaDescriptionDishe}>
                      <textarea
                        name="description"
                        placeholder={Strings.description}
                        maxLength={200}
                        className={styles.textAreaDivDescriptionDishe}
                        value={inputDescriptionDishe!}
                        onChange={(event) => {
                          setInputDescriptionDishe(event.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <SelectForm
                        control={control}
                        item={Strings.unit}
                        name="unit"
                        containerStyle={{ width: '50%', marginRight: '8%' }}
                        error={errors.unit?.message?.toString()}
                        data={units}
                        onSelectChange={handleGetUnit}
                      />
                      <SelectForm
                        control={control}
                        item={Strings.status}
                        name="status"
                        containerStyle={{ width: '50%' }}
                        error={errors.status?.message?.toString()}
                        data={statusGeneral}
                      />
                    </div>
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
        message={message}
      />
    </React.Fragment>
  );
}
