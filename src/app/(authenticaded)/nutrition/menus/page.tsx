'use client';

import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import DestinationList from 'components/DestinationListComponent';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalError from 'components/ModalError';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import SourceList from 'components/SourceListComponent';
import { SpinnerLoading } from 'components/Spinner';

import styles from './menusnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { addDays } from 'date-fns';
import { DataDishesModel, DataDishesPerDayModel } from 'models/DataDishesModel';
import { DataMenuModel } from 'models/DataMenuModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { Prefs } from 'repository/Prefs';
import { getDishesByUnit } from 'services/dishes';
import { createMenu, getMenuByDay } from 'services/menu';
import { getAllUnitsWithoutPagination } from 'services/units';
import formatDate from 'utils/helpers';

type DataProps = {
  [name: string]: string | number;
};

export default function NewMenuPage(): JSX.Element {
  const [optionOrganizedBy, setOptionOrganizedBy] = React.useState<string>('');
  const [showModalSuccess, setShowModalSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [units, setUnits] = React.useState<any>(null);
  const [selectedUnit, setSelectedUnit] = React.useState<number>(0);
  const [reFresh, setReFresh] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [showModalError, setShowModalError] = useState<boolean>(false);
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  const [sourceItems, setSourceItems] = useState<
    { id: number; name: string; photo_path: string }[]
  >([
    {
      id: Math.random() * 9999999999,
      name: 'Selecione uma unidade',
      photo_path: ''
    }
  ]);

  React.useEffect(() => {
    getUnits();
  }, [reFresh]);

  async function getDishes(unit: number) {
    const response = await getDishesByUnit(unit);
    const dishes = response.data as unknown as DataDishesModel[];
    const noFixed = dishes.filter((dish) => dish.isFixed === false);
    const fixed = dishes.filter((dish) => dish.isFixed === true);

    const dishedsNoFixed = noFixed.map((dish) => ({
      id: dish.id!,
      name: dish.name!,
      photo_path: dish.photo_path!
    }));

    const dishedsFixed = fixed.map((dish) => ({
      id: dish.id!,
      name: dish.name!,
      photo_path: dish.photo_path!
    }));

    setSourceItems(dishedsNoFixed);
    setDestinationItems(dishedsFixed);
    setIsLoading(false);
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
    setIsLoading(false);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleGetUnit = (selectedUnitCode: any) => {
    setSelectedUnit(selectedUnitCode);
  };

  function handleClean() {
    setValue('unit', 0);
    setStartDate('');
    setValue('startDate', '');
    setValue('endDate', '');
    setEndDate('');
    setSelectedUnit(0);
    setOptionOrganizedBy('');
    setSourceItems([]);
    setDestinationItems([]);
    setSelectedUnit(0);
    setReFresh(!reFresh);
  }

  const filteredSourceItems = sourceItems.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const [destinationItems, setDestinationItems] = useState<
    { id: number; name: string; photo_path: string }[]
  >([]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // Não houve mudança de posição

    const source = [...sourceItems];
    const destination = [...destinationItems];
    const [movedItem] = source.splice(result.source.index, 1);
    destination.splice(result.destination.index, 0, movedItem);

    setSourceItems(source);
    setDestinationItems(destination);
  };

  async function onSubmit(data: DataProps) {
    const newMenu: DataMenuModel = {
      start: data.startDate.toString(),
      end:
        data.endDate === '' ||
        data.endDate === null ||
        data.endDate === undefined
          ? data.startDate.toString()
          : data.endDate.toString(),
      unit_id: selectedUnit,
      dishes: destinationItems.map((dish) => dish.id)
    };

    const response = await createMenu(newMenu);

    if (response.status !== null) {
      setMessage(Strings.messageSuccessfulMenuCreation);
      setShowModalSuccess(true);
      setReFresh(!reFresh);
      handleClean();
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3000);
    }
  }

  const handleUnitSelected = () => {
    if (selectedUnit !== 0 && selectedUnit !== null) {
      getDishes(selectedUnit);
    }
  };

  async function verifyDate() {
    const today = new Date();
    const dateSelectedStart = addDays(new Date(getValues('startDate')), 1);
    const dateSelectedEnd = addDays(new Date(getValues('endDate')), 1);

    if (!(dateSelectedStart >= today)) {
      setValue('startDate', '');
      setMessage(Strings.errorDateOld);
      setShowModalError(true);
      setTimeout(() => {
        setShowModalError(false);
      }, 3000);
      return;
    }

    if (
      getValues('endDate') != undefined &&
      getValues('endDate') != null &&
      getValues('endDate') != ''
    ) {
      if (!(dateSelectedEnd >= today)) {
        setValue('endDate', '');
        setMessage(Strings.errorDateOld);
        setShowModalError(true);
        setTimeout(() => {
          setShowModalError(false);
        }, 3000);
        return;
      }

      if (dateSelectedEnd < dateSelectedStart) {
        setValue('endDate', '');
        setMessage(Strings.endDateCannotBeLessThanStartDate);
        setShowModalError(true);
        setTimeout(() => {
          setShowModalError(false);
        }, 3000);
        return;
      }
    }
  }

  async function verifyMenuByDay() {
    const response = await getMenuByDay(startDate);
    const menu = response.data as unknown as DataDishesPerDayModel[];
    const dataUpdated = menu.filter(
      (item: any) => item.unit_id == selectedUnit
    );

    const dishesFixedUpdated = dataUpdated.filter(
      (dish: DataDishesPerDayModel) => {
        return !destinationItems.some(
          (item) => item.id === dish?.pivot.dishe_id
        );
      }
    );

    const dishesNoFixedUpdated = sourceItems.filter((item) => {
      return !dataUpdated.some(
        (dish: DataDishesPerDayModel) => dish?.pivot.dishe_id === item.id
      );
    });

    const dishedsNoFixed = dishesNoFixedUpdated.map((dish: any) => ({
      id: dish.id!,
      name: dish.name!,
      photo_path: dish.photo_path!
    }));

    const dishedsFixed = dishesFixedUpdated.map((dish: any) => ({
      id: dish.id!,
      name: dish.name!,
      photo_path: dish.photo_path!
    }));

    setSourceItems(dishedsNoFixed);
    setDestinationItems([...destinationItems, ...dishedsFixed]);
    setReFresh(!reFresh);
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className="d-flex">
        <div className={styles.bodyFormFirstColumn}>
          <p className={styles.titlePeriod}>{Strings.period}</p>
          <div className="d-flex flex-column w-100">
            <SelectForm
              control={control}
              item={Strings.unit}
              name="unit"
              containerStyle={{ width: '100%', marginBottom: '5vh' }}
              className={styles.selectUnitMenu}
              error={errors.unit?.message?.toString()}
              data={units}
              onSelectChange={handleGetUnit}
              isLoading={isLoading}
              onBlur={handleUnitSelected}
            />
            <p className={styles.subtitlePeriod}>
              {Strings.organizedBy}: {optionOrganizedBy}
            </p>
            <div className="d-flex flex-row w-100 justify-content-around mt-4">
              <div className={styles.w45Period}>
                <Button
                  title="Semanal"
                  type={optionOrganizedBy === 'Semanal' ? 'primary' : 'button'}
                  onClick={() => {
                    setOptionOrganizedBy('Semanal');
                  }}
                />
              </div>
              <div className={styles.w45Period}>
                <Button
                  title="Diário"
                  type={optionOrganizedBy === 'Diário' ? 'primary' : 'button'}
                  onClick={() => {
                    setOptionOrganizedBy('Diário');
                  }}
                />
              </div>
            </div>
            <div className="my-5">
              <label>
                {optionOrganizedBy === 'Semanal' ? (
                  <p className={styles.subtitlePeriod}>{Strings.startDate}</p>
                ) : (
                  <p className={styles.subtitlePeriod}>{Strings.date}</p>
                )}
              </label>
              <InputForm
                control={control}
                type="date"
                name="startDate"
                error={errors.startDate?.message}
                className={styles.inputDateMenu}
                getValue={setStartDate}
                onBlur={() => {
                  verifyDate();
                  (optionOrganizedBy === 'Diário' &&
                    startDate !== '' &&
                    startDate !== null) ||
                  startDate !== undefined
                    ? verifyMenuByDay()
                    : null;
                }}
              />

              {optionOrganizedBy === 'Semanal' ? (
                <React.Fragment>
                  <label className="mt-5">
                    <p className={styles.subtitlePeriod}>{Strings.endDate}</p>
                  </label>
                  <InputForm
                    control={control}
                    type="date"
                    name="endDate"
                    error={errors.startDate?.message}
                    className={styles.inputDateMenu}
                    getValue={setEndDate}
                    onBlur={() => {
                      verifyDate();
                    }}
                  />
                </React.Fragment>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className={styles.bodyFormSecondColumn}>
          <div className="w-100">
            <p className={styles.titlePeriod}>{Strings.planningOfTheMenu}</p>
          </div>
          <div className="w-100 d-flex">
            <div className={styles.searchBar}>
              <input
                type="search"
                placeholder={Strings.search}
                value={searchValue}
                onChange={handleSearchChange}
              />
              <div className={styles.iconSearch}>
                <Icon
                  typeIcon={TypeIcon.Search}
                  size={20}
                  color={Colors.gray60}
                  callback={() => {}}
                />
              </div>
            </div>
            <div className="mx-5">
              <p className={styles.subtitlePeriod}>
                {optionOrganizedBy === 'Semanal'
                  ? Strings.periodSelected +
                    ': ' +
                    formatDate(startDate) +
                    ' - ' +
                    formatDate(endDate)
                  : Strings.daySelected + ': ' + formatDate(startDate)}
              </p>
              <p className={styles.subtitlePeriod}>
                <span>
                  {Strings.status}: <strong>{Strings.planning}</strong>
                </span>
              </p>
            </div>
          </div>
          {isLoading ? (
            <SpinnerLoading />
          ) : (
            <React.Fragment>
              <div className="d-flex w-100 mt-2">
                <DragDropContext onDragEnd={onDragEnd}>
                  <div
                    style={{ display: 'flex', flexDirection: 'row' }}
                    className="w-100"
                  >
                    <SourceList items={filteredSourceItems} />
                    <DestinationList items={destinationItems} />
                  </div>
                </DragDropContext>
              </div>
              <div className={styles.footerNewMenus}>
                <React.Fragment>
                  <div className={styles.btnSaveNewMenus}>
                    <Button
                      type="secondary"
                      title={Strings.save}
                      onClick={handleSubmit(onSubmit)}
                    />
                  </div>
                  <div className={styles.btnDeleteNewMenus}>
                    <Button
                      type="secondary"
                      title={Strings.clear}
                      onClick={() => {
                        handleClean();
                      }}
                    />
                  </div>
                </React.Fragment>
                <div className={styles.btnCancelNewMenus}>
                  <Button
                    type="cancel"
                    title={Strings.new}
                    onClick={() => {
                      handleClean();
                    }}
                  />
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={message}
      />
      <ModalError
        show={showModalError}
        onHide={() => setShowModalError(false)}
        message={message}
      />
    </React.Fragment>
  );
}
