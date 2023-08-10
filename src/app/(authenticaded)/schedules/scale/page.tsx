'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { FormTwoColumns } from 'components/FormTwoColumns';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import { SelectForm } from 'components/SelectForm';
import TenButtons from 'components/TenButtons';
import { LitteText, SmallMediumText } from 'components/Text';
import { TimeButton } from 'components/TimeButton';

import styles from './scale.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataScaleModel } from 'models/DataScaleModel';
import dataScale from 'tests/mocks/dataScale'; //mock de teste de dados
import { intervalSchedule } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function ScalePage(): JSX.Element {
  const [selectedItem, setSelectedItem] = React.useState<string>('');
  const [visibleDatesHours, setVisibleDatesHours] =
    React.useState<boolean>(false);
  const [periodicity, setPeriodicity] = React.useState<number>(0);
  function handleItemSelection(item: DataScaleModel) {
    setSelectedItem(item.name);
  }

  const {
    control,
    // handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  const searchSchedulesDispobles = () => {
    setVisibleDatesHours(true);
  };

  const handlePeriodicity = (periodicity: string) => {
    switch (periodicity) {
      case '1':
        setPeriodicity(15);
        break;
      case '2':
        setPeriodicity(30);
        break;
      case '3':
        setPeriodicity(45);
        break;
      case '4':
        setPeriodicity(60);
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyScale}>
        <div style={{ width: '30%' }}>
          <FormTwoColumns
            headers={Strings.headersScale}
            data={dataScale}
            onItemClick={handleItemSelection}
          />
        </div>
        <div className={styles.formInserScale}>
          <div className={styles.titleScale}>
            <SmallMediumText
              text={Strings.scheduleConfirmation + ': ' + `${selectedItem}`}
              style={{ textAlign: 'left', lineHeight: 2 }}
              bold={true}
              color={Colors.gray90}
            />
          </div>
          <div className={styles.bodySelectScale}>
            {selectedItem === '' ? (
              <div className={styles.emptySpecialist}>
                <LitteText
                  text={Strings.selectSpecialist}
                  style={{ textAlign: 'center', lineHeight: 2, opacity: 0.5 }}
                  bold={true}
                  color={Colors.gray90}
                />
              </div>
            ) : (
              <div className={styles.scheduleScale}>
                <InputForm
                  control={control}
                  name="initialHour"
                  type="time"
                  containerStyle={{ width: '25%' }}
                  style={{ height: '40px' }}
                  placeholder={Strings.date}
                  error={errors.initialHour?.message?.toString()}
                />
                <InputForm
                  control={control}
                  name="finalHour"
                  type="time"
                  style={{ height: '40px' }}
                  placeholder={Strings.hour}
                  containerStyle={{ width: '25%' }}
                  error={errors.finalHour?.message?.toString()}
                />
                <SelectForm
                  control={control}
                  name="timeOfAttendance"
                  containerStyle={{ width: '25%' }}
                  error={errors.timeOfAttendance?.message?.toString()}
                  data={intervalSchedule}
                  onSelectChange={handlePeriodicity}
                />
                {/* <select>
                  {Strings.timeOfAttendance.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select> */}
                <Button
                  title=""
                  type="secondary"
                  onClick={() => {
                    searchSchedulesDispobles();
                  }}
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  icon={
                    <Icon
                      typeIcon={TypeIcon.Search}
                      size={20}
                      color={Colors.gray60}
                      style={{ marginRight: 5 }}
                    />
                  }
                />
              </div>
            )}
          </div>
          {visibleDatesHours && (
            <React.Fragment>
              <div className={styles.selectDateScale}>
                <div style={{ marginBottom: '2vh' }}>
                  <SmallMediumText
                    text={Strings.selectDate}
                    bold={true}
                    color={Colors.gray90}
                    style={{ lineHeight: 1 }}
                  />
                </div>
                <div className={styles.divDatesSchedule}>
                  <TenButtons />
                </div>
                <div style={{ marginBottom: '2vh' }}>
                  <SmallMediumText
                    text={Strings.hoursDisponibles}
                    bold={true}
                    color={Colors.gray90}
                    style={{ lineHeight: 1 }}
                  />
                </div>
                <div className={styles.divHoursDisponibles}>
                  <TimeButton periodicity={periodicity} />
                </div>
              </div>
              <div className={styles.footerScale}>
                <div className={styles.btnSaveScale}>
                  <Button
                    title={Strings.save}
                    type="secondary"
                    onClick={() => {}}
                  />
                </div>
                <div className={styles.btnCancelScale}>
                  <Button
                    title={Strings.cancel}
                    type="cancel"
                    onClick={() => {
                      setSelectedItem('');
                      setVisibleDatesHours(false);
                    }}
                  />
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
