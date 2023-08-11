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
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { getAllSpecialists } from 'services/specialists';
import { intervalSchedule } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function ScalePage(): JSX.Element {
  const [data, setData] = React.useState<any>(null);
  const [selectedItem, setSelectedItem] = React.useState<string>('');
  const [visibleDatesHours, setVisibleDatesHours] =
    React.useState<boolean>(false);
  const [periodicity, setPeriodicity] = React.useState<number>(0);
  const [startTime, setStartTime] = React.useState<string>('');
  const [endTime, setEndTime] = React.useState<string>('');
  const [nameSelected, setNameSelected] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  function handleItemSelection(item: any) {
    setSelectedItem(item);
    const listSpecalist = data?.data;
    setNameSelected(
      listSpecalist?.filter(
        (element: DataSpecialistsModel) => element.id === Number(item)
      )[0].name
    );
  }

  const {
    control,
    // handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getEspecialists();
  }, [selectedItem]);

  async function getEspecialists() {
    const response = await getAllSpecialists();
    setData(response.data);
    setLoading(false);
  }

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

  const handleInitialHourBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setStartTime(value);
  };
  const handleEndHourBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEndTime(value);
  };

  // function isSecondTimeGreaterThanFirst(
  //   initialTime: string,
  //   secondTime: string
  // ): boolean {
  //   const [firstHours, firstMinutes] = initialTime.split(':').map(Number);
  //   const [secondHours, secondMinutes] = secondTime.split(':').map(Number);

  //   if (secondHours > firstHours) {
  //     return true;
  //   } else if (secondHours === firstHours && secondMinutes > firstMinutes) {
  //     return true;
  //   }
  //   return false;
  // }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyScale}>
        <div style={{ width: '30%' }}>
          <FormTwoColumns
            headers={Strings.headersScale}
            headersResponse={Strings.headersScaleResponse}
            response={data}
            isLoading={loading}
            onItemClick={handleItemSelection}
            type="scaleSchedule"
          />
        </div>
        <div className={styles.formInserScale}>
          <div className={styles.titleScale}>
            <SmallMediumText
              text={Strings.scheduleConfirmation + ': ' + `${nameSelected}`}
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
                  onBlur={handleInitialHourBlur}
                />
                <InputForm
                  control={control}
                  name="finalHour"
                  type="time"
                  style={{ height: '40px' }}
                  placeholder={Strings.hour}
                  containerStyle={{ width: '25%' }}
                  error={errors.finalHour?.message?.toString()}
                  onBlur={handleEndHourBlur}
                />
                <SelectForm
                  control={control}
                  name="timeOfAttendance"
                  containerStyle={{ width: '25%' }}
                  error={errors.timeOfAttendance?.message?.toString()}
                  data={intervalSchedule}
                  onSelectChange={handlePeriodicity}
                />
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
                  <TimeButton
                    periodicity={periodicity}
                    startTime={startTime}
                    endTime={endTime}
                  />
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
                      setNameSelected('');
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
