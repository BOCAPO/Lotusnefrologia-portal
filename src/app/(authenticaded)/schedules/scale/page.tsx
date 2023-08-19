'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { FormTwoColumns } from 'components/FormTwoColumns';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalSuccess from 'components/ModalSuccess';
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
import { NewScheduleModel } from 'models/NewScheduleModel';
import { ResponseSchedulesModel } from 'models/ResponseSchedulesModel';
import {
  createSchedule,
  getHoursBySpecialistAndDateAndUnit
} from 'services/schedules';
import { getAllSpecialists, getSpecialistsPerPage } from 'services/specialists';
import { getAllUnits } from 'services/units';
import { intervalSchedule } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function ScalePage(): JSX.Element {
  const [data, setData] = React.useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [units, setUnits] = React.useState<any>(null);
  const [selectedSpectialistId, setSelectedSpecialistId] =
    React.useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = React.useState<string>('');
  const [visibleDatesHours, setVisibleDatesHours] =
    React.useState<boolean>(false);
  const [periodicity, setPeriodicity] = React.useState<number>(0);
  const [startTime, setStartTime] = React.useState<string>('');
  const [endTime, setEndTime] = React.useState<string>('');
  const [nameSelectedSpecialist, setNameSelectedSpecialist] =
    React.useState<string>('');
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [selectedTime, setSelectedTime] = React.useState<any>([]);
  const [quantitySelectedTime, setQuantitySelectedTime] =
    React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoursBloqued, setHoursBloqued] = React.useState<any>([]);
  const [blockedHourInitial, setBlockedHourInitial] = React.useState<any>([]);
  const [blockedHourFinal, setBlockedHourFinal] = React.useState<any>([]);
  const [page, setPage] = React.useState<number>(1);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getEspecialists();
    getUnits();
  }, [selectedSpectialistId, page, quantitySelectedTime]);

  async function getEspecialists() {
    if (page === 1) {
      setData(null);
      const response = await getAllSpecialists();
      setData(response.data);
    } else {
      setData(null);
      const response = await getSpecialistsPerPage(page);
      setData(response.data);
    }
    setLoading(false);
  }

  async function getUnits() {
    const response = await getAllUnits();
    setUnits(response.data);
  }

  const searchSchedulesDispobles = () => {
    setVisibleDatesHours(true);
  };

  function handleItemSelection(firstId: any, secondId: any) {
    setSelectedSpecialistId(firstId);
    setSelectedUnitId(secondId);
    setVisibleDatesHours(false);
    setSelectedDate('');
    setSelectedTime([]);
    setQuantitySelectedTime(0);
    const listSpecalist = data?.data;
    setNameSelectedSpecialist(
      listSpecalist?.filter(
        (element: DataSpecialistsModel) => element.id === Number(firstId)
      )[0]?.name
    );
  }

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

  const handleDateSelect = (selectedDate: string) => {
    setSelectedDate(selectedDate);
    setSelectedTime([]);
    setQuantitySelectedTime(0);

    getSchedulesBlocked(selectedDate);
  };

  async function getSchedulesBlocked(selectedDate: string) {
    const response = await getHoursBySpecialistAndDateAndUnit(
      Number(selectedSpectialistId),
      selectedDate,
      Number(selectedUnitId)
    );
    const responseHours = response.data[0] as ResponseSchedulesModel;
    setBlockedHourInitial(responseHours?.schedules[0].start);
    setBlockedHourFinal(
      responseHours?.schedules[Number(responseHours?.schedules.length) - 1].end
    );
    setHoursBloqued(responseHours?.schedules);
  }

  const handleTimeSelect = (selectedTime: []) => {
    setSelectedTime(selectedTime);
    setQuantitySelectedTime(selectedTime.length);
  };

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  async function handleNewSchedule() {
    const newSchedule: NewScheduleModel = {
      specialist_id: Number(selectedSpectialistId),
      unit_id: Number(selectedUnitId),
      duration: periodicity,
      dates: [
        {
          date: selectedDate,
          schedules: selectedTime
        }
      ]
    };

    const response = await createSchedule(newSchedule);
    if (response !== null) {
      setShowModalSuccess(true);
      setSelectedSpecialistId('');
      setVisibleDatesHours(false);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3000);
    }
  }

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
        <div style={{ width: '40%' }}>
          <FormTwoColumns
            headers={Strings.headersScale}
            headersResponse={Strings.headersScaleResponse}
            response={data}
            isLoading={loading}
            onItemClick={handleItemSelection}
            type="scaleSchedule"
            onClick={handleSelectionPage}
          />
        </div>
        <div className={styles.formInserScale}>
          <div className={styles.titleScale}>
            <SmallMediumText
              text={
                Strings.scheduleConfirmation +
                ': ' +
                `${nameSelectedSpecialist}`
              }
              style={{ textAlign: 'left', lineHeight: 2 }}
              bold={true}
              color={Colors.gray90}
            />
          </div>
          <div className={styles.bodySelectScale}>
            {selectedSpectialistId === '' ? (
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
                  <TenButtons onDateSelect={handleDateSelect} />
                </div>
                {selectedDate !== '' && (
                  <React.Fragment>
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
                        onTimeSelect={handleTimeSelect}
                        selectedDate={selectedDate}
                        hourInitialBlocked={blockedHourInitial}
                        hourFinalBlocked={blockedHourFinal}
                      />
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div className={styles.footerScale}>
                <div className={styles.btnSaveScale}>
                  <Button
                    title={Strings.save}
                    type="secondary"
                    onClick={handleSubmit(handleNewSchedule)}
                  />
                </div>
                <div className={styles.btnCancelScale}>
                  <Button
                    title={Strings.cancel}
                    type="cancel"
                    onClick={() => {
                      setVisibleDatesHours(false);
                      setSelectedDate('');
                      setSelectedTime([]);
                      setQuantitySelectedTime(0);
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
        message={Strings.messageSuccessInsertScaleSchedule}
      />
    </React.Fragment>
  );
}
