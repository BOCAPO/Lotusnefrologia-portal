'use client';

import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useForm } from 'react-hook-form';

import { Button as ButtonPersonal } from 'components/Button';
import ColorSelector from 'components/ColorSelector';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import Modal from 'components/ModalBoxSchedule';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SpinnerLoading } from 'components/Spinner';
import {
  LitteText,
  MediumText,
  MediumText2,
  SmallText2
} from 'components/Text';

import styles from './appointment.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { DataAppoitmensModel } from 'models/DataAppoitmensModel';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { ResponseSchedulesModel } from 'models/ResponseSchedulesModel';
import { Prefs } from 'repository/Prefs';
import {
  getAllAppointmensTags,
  getAllAppointmentsWithoutPagination,
  updateAppointment
} from 'services/appointments';
import { getPatientsWithoutPagination } from 'services/patients';
import { getHoursBySpecialistAndDateAndUnit } from 'services/schedules';
import { getSpecialistsWithoutPagination } from 'services/specialists';
import { getAllUnits } from 'services/units';
import { statusAppointment } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function AppointmentsPage(): JSX.Element {
  const [key, setKey] = React.useState('home');
  const [visible, setVisible] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dataAppointments, setDataAppointments] = React.useState<any>(null);
  const [dataCancel, setDataCancel] = React.useState<any>(null);
  const [dataConfirmed, setDataConfirmed] = React.useState<any>(null);
  const [quantityAppointments, setQuantityAppointments] =
    React.useState<any>(0);
  const [inputObservation, setInputObservation] = React.useState<string>('');
  const [tags, setTags] = React.useState<any>(null);
  const [hours, setHours] = React.useState<any>(null);
  const [itemSelected, setItemSelected] = React.useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedScheduleId, setSelectedScheduleId] = React.useState<number>(0);
  const [optionsStatusAppointment, setOptionsStatusAppointment] =
    React.useState<any>(null);
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [specialists, setSpecialists] = React.useState<any>(null);
  const [patients, setPatients] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const [messageSuccess, setMessageSuccess] = React.useState<string>('');

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getAllAppointments();
    getAppointmentTags();
    getSpecialists();
    getPatients();
    getUnits();
  }, [quantityAppointments]);

  async function getAppointmentTags() {
    const response = await getAllAppointmensTags();
    setTags(response.data.data);
  }

  async function getAllAppointments() {
    const response = await getAllAppointmentsWithoutPagination();
    let dataUpdated: any = [];
    if (Array.isArray(response.data)) {
      response?.data?.map((item) => {
        dataUpdated.push(item);
      }) as unknown as DataAppoitmensModel[];
    }

    dataUpdated = dataUpdated.map((item: any) => {
      item.idAppointment = item.id;
      item.nameSpecialist = item.specialist.name || 'Não informado';
      item.nameSpecialty = item.specialty.description || 'Não informada';
      item.unityName = item.unit.name;
      item.newDate = format(new Date(item.schedule.date), 'dd');
      item.dayOfWeek = format(new Date(item.schedule.date), 'EEE', {
        locale: ptBR
      }).slice(0, 3);
      item.statTime = item.schedule.start;
      item.endTime = item.schedule.end;
      return item;
    });
    let dataStatusAppointment = dataUpdated.filter(
      (item: any) => item.appointment_status === 0
    );

    let dataStatusCancel = dataUpdated.filter(
      (item: any) => item.appointment_status === 1
    );

    let dataStatusConfirmed = dataUpdated.filter(
      (item: any) => item.appointment_status === 3
    );

    dataStatusAppointment = dataStatusAppointment.sort((a: any, b: any) => {
      return a.schedule.date > b.schedule.date ? 1 : -1;
    });

    dataStatusCancel = dataStatusCancel.sort((a: any, b: any) => {
      return a.schedule.date > b.schedule.date ? 1 : -1;
    });

    dataStatusConfirmed = dataStatusConfirmed.sort((a: any, b: any) => {
      return a.schedule.date > b.schedule.date ? 1 : -1;
    });
    setQuantityAppointments(dataStatusAppointment.length);
    setDataAppointments(dataStatusAppointment);
    setDataCancel(dataStatusCancel);
    setDataConfirmed(dataStatusConfirmed);
    setLoading(false);
  }

  async function getSpecialists() {
    const response = await getSpecialistsWithoutPagination();
    let specialistsUpdated = response.data as unknown as DataSpecialistsModel[];
    specialistsUpdated = specialistsUpdated.sort((a: any, b: any) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setSpecialists(specialistsUpdated);
  }

  async function getPatients() {
    const response = await getPatientsWithoutPagination();
    const patientsUpdated = response.data as ResponseGetModel;
    setPatients(patientsUpdated);
  }

  async function getUnits() {
    let unitsPermited = JSON.parse(Prefs.getUnits()!);
    unitsPermited = unitsPermited!.map((item: DataUnitsModel) => item.id);
    const response = await getAllUnits();
    const unitsUpdated = response.data.data as DataUnitsModel[];

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

  function getAppointment(item: any) {
    setValue('patient', item.patient.name);
    setValue('status', item.appointment_status + 1);
    setValue('specialist', item.specialist_name || 'Não informado');
    setValue('observation', item.observation);
    setValue('date', format(new Date(item.schedule.date), 'yyyy-MM-dd'));
    const inputTime = item.schedule.start;
    const [hour, minutes] = inputTime.split(':').slice(0, 2);
    const formattedTime = format(new Date().setHours(hour, minutes), 'HH:mm');
    setValue('hour', formattedTime);
    setValue('unity', item.unit.name);
    setValue('specialty', item.specialty.description);
    setInputObservation(item?.observation?.length > 0 ? item.observation : '');
    setItemSelected(item);
  }

  async function getHoursSchedule(date: string) {
    const response = await getHoursBySpecialistAndDateAndUnit(
      itemSelected?.schecule?.specialist_id,
      date,
      itemSelected?.unit?.id
    );
    const responseHours = response.data[0] as ResponseSchedulesModel;
    setHours(responseHours?.schedules);
  }

  const handleDataSelected = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (itemSelected?.specialty_id !== 0 && value !== '')
      getHoursSchedule(value);
  };

  const handleSelectStatus = (value: string) => {
    switch (value) {
      case '1':
        setOptionsStatusAppointment(1);
        break;
      case '2':
        setOptionsStatusAppointment(2);
        break;
      case '3':
        setOptionsStatusAppointment(3);
        break;
      default:
        setOptionsStatusAppointment(4);
        break;
    }
  };

  const handleClean = () => {
    setValue('patient', '');
    setValue('status', '');
    setValue('specialist', '');
    setValue('observation', '');
    setValue('date', '');
    setValue('hour', '');
    setValue('unity', '');
    setValue('specialty', '');
    setInputObservation('');
    setItemSelected(null);
  };

  const handleGetScheduleId = (scheduleId: any) => {
    setSelectedScheduleId(scheduleId);
  };

  const handleColorChange = (selectedColor: any) => {
    setSelectedColor(selectedColor);
  };

  async function handleCancelAppointment() {
    if (itemSelected !== null) {
      itemSelected.appointment_status = 1;
      itemSelected.observation = inputObservation;
      const response = await updateAppointment(itemSelected.id, itemSelected);

      if (response !== null) {
        setQuantityAppointments(quantityAppointments - 1);
        handleClean();
        setMessageSuccess(Strings.appointmentCanceled);
        setShowModalSuccess(true);
        setTimeout(() => {
          setShowModalSuccess(false);
        }, 3000);
      }
    }
  }

  async function handleUpdateAppointment() {
    const objUpdateAppointment = {
      specialist_id: itemSelected.specialist.id as number,
      patient_id: itemSelected.patient.id as number,
      unit_id: itemSelected.unit.id as number,
      specialty_id: itemSelected.specialty_id as number,
      schedule_id:
        selectedScheduleId === 0
          ? itemSelected.schedule.id
          : selectedScheduleId,
      appointment_status: Number(optionsStatusAppointment) - 1,
      observation: inputObservation,
      tag_id: selectedColor,
      status: 0
    } as DataAppoitmensModel;

    const response = await updateAppointment(
      itemSelected.id,
      objUpdateAppointment
    );

    if (response !== null) {
      if (Number(optionsStatusAppointment) === 4)
        setMessageSuccess(Strings.appointmentConfirmed);

      if (Number(optionsStatusAppointment) === 1)
        setMessageSuccess(Strings.appointmentCanceled);

      if (Number(optionsStatusAppointment) === 4 && selectedScheduleId !== 0)
        setMessageSuccess(Strings.appointmentChanged);

      setQuantityAppointments(quantityAppointments - 1);
      handleClean();
      setShowModalSuccess(true);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 3000);
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyAppointments}>
        <div className={styles.divListAppointments}>
          <div>
            <MediumText
              text={Strings.appointmentsConfirmed}
              color={Colors.gray90}
              bold={true}
              style={{ lineHeight: '2px' }}
            />
          </div>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k!)}
            className="mb-3"
          >
            <Tab eventKey="home" title="Agendadas">
              {loading ? (
                <SpinnerLoading />
              ) : dataAppointments !== null && dataAppointments.length > 0 ? (
                dataAppointments?.map((item: any, index: number) => {
                  return (
                    <div
                      className={styles.itemListAppointments}
                      key={index}
                      onClick={() => {
                        getAppointment(item);
                      }}
                    >
                      <div className={styles.itemListAppointmentsDate}>
                        <SmallText2
                          text={item.dayOfWeek}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <MediumText2
                          text={item.newDate}
                          color={Colors.greenDark2}
                          bold={true}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                      <div className={styles.itemListAppointmentsHour}>
                        <div>
                          <Icon
                            typeIcon={TypeIcon.Clock}
                            size={15}
                            color={Colors.greenLight2}
                          />
                          <LitteText
                            text={item.statTime + ' - ' + item.endTime}
                            color={Colors.gray90}
                            bold={false}
                            style={{ lineHeight: '2px' }}
                          />
                        </div>
                        <div>
                          <Icon
                            typeIcon={TypeIcon.MapPin}
                            size={15}
                            color={Colors.greenLight2}
                          />
                          <LitteText
                            text={item.unityName}
                            color={Colors.gray90}
                            bold={false}
                            style={{ lineHeight: '2px' }}
                          />
                        </div>
                      </div>
                      <div className={styles.itemListAppointmentSpecialist}>
                        <LitteText
                          text={Strings.specialist}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <LitteText
                          text={Strings.speciality}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                      <div className={styles.itemListAppointmentSpecialist}>
                        <LitteText
                          text={item.nameSpecialist}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <LitteText
                          text={item.nameSpecialty}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noAppointments}>
                  <MediumText2
                    text={Strings.noAppointmentsScheduled}
                    color={Colors.gray90}
                    bold={false}
                    style={{ lineHeight: '2px' }}
                  />
                </div>
              )}
            </Tab>
            <Tab eventKey="profile" title="Confirmado">
              {loading ? (
                <SpinnerLoading />
              ) : dataConfirmed !== null && dataConfirmed.length > 0 ? (
                dataConfirmed?.map((item: any, index: number) => {
                  return (
                    <div
                      className={styles.itemListAppointments}
                      key={index}
                      onClick={() => {
                        getAppointment(item);
                      }}
                    >
                      <div className={styles.itemListAppointmentsDate}>
                        <SmallText2
                          text={item.dayOfWeek}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <MediumText2
                          text={item.newDate}
                          color={Colors.greenDark2}
                          bold={true}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                      <div className={styles.itemListAppointmentsHour}>
                        <div>
                          <Icon
                            typeIcon={TypeIcon.Clock}
                            size={15}
                            color={Colors.greenLight2}
                          />
                          <LitteText
                            text={item.statTime + ' - ' + item.endTime}
                            color={Colors.gray90}
                            bold={false}
                            style={{ lineHeight: '2px' }}
                          />
                        </div>
                        <div>
                          <Icon
                            typeIcon={TypeIcon.MapPin}
                            size={15}
                            color={Colors.greenLight2}
                          />
                          <LitteText
                            text={item.unityName}
                            color={Colors.gray90}
                            bold={false}
                            style={{ lineHeight: '2px' }}
                          />
                        </div>
                      </div>
                      <div className={styles.itemListAppointmentSpecialist}>
                        <LitteText
                          text={Strings.specialist}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <LitteText
                          text={Strings.speciality}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                      <div className={styles.itemListAppointmentSpecialist}>
                        <LitteText
                          text={item.nameSpecialist}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <LitteText
                          text={item.nameSpecialty}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noAppointments}>
                  <MediumText2
                    text={Strings.noAppointmentsConfirmed}
                    color={Colors.gray90}
                    bold={false}
                    style={{ lineHeight: '2px' }}
                  />
                </div>
              )}
            </Tab>
            <Tab eventKey="contact" title="Canceladas">
              {loading ? (
                <SpinnerLoading />
              ) : dataCancel !== null && dataCancel.length > 0 ? (
                dataCancel?.map((item: any, index: number) => {
                  return (
                    <div
                      className={styles.itemListAppointments}
                      key={index}
                      onClick={() => {
                        getAppointment(item);
                      }}
                    >
                      <div className={styles.itemListAppointmentsDate}>
                        <SmallText2
                          text={item.dayOfWeek}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <MediumText2
                          text={item.newDate}
                          color={Colors.greenDark2}
                          bold={true}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                      <div className={styles.itemListAppointmentsHour}>
                        <div>
                          <Icon
                            typeIcon={TypeIcon.Clock}
                            size={15}
                            color={Colors.greenLight2}
                          />
                          <LitteText
                            text={item.statTime + ' - ' + item.endTime}
                            color={Colors.gray90}
                            bold={false}
                            style={{ lineHeight: '2px' }}
                          />
                        </div>
                        <div>
                          <Icon
                            typeIcon={TypeIcon.MapPin}
                            size={15}
                            color={Colors.greenLight2}
                          />
                          <LitteText
                            text={item.unityName}
                            color={Colors.gray90}
                            bold={false}
                            style={{ lineHeight: '2px' }}
                          />
                        </div>
                      </div>
                      <div className={styles.itemListAppointmentSpecialist}>
                        <LitteText
                          text={Strings.specialist}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <LitteText
                          text={Strings.speciality}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                      <div className={styles.itemListAppointmentSpecialist}>
                        <LitteText
                          text={item.nameSpecialist}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                        <LitteText
                          text={item.nameSpecialty}
                          color={Colors.gray90}
                          bold={false}
                          style={{ lineHeight: '2px' }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noAppointments}>
                  <MediumText2
                    text={Strings.noAppointmentsCanceled}
                    color={Colors.gray90}
                    bold={false}
                    style={{ lineHeight: '2px' }}
                  />
                </div>
              )}
            </Tab>
          </Tabs>
          <div className={styles.btnNewAppointment}>
            <ButtonPersonal
              title={Strings.makeAppointment}
              type="secondary"
              onClick={() => {
                setVisible(true);
              }}
            />
          </div>
          <div className={styles.inputSearchAppointment}>
            <input type="search" placeholder={Strings.search} />
            <div className={styles.iconSearch}>
              <Icon
                typeIcon={TypeIcon.Search}
                size={20}
                color={Colors.gray60}
                callback={() => {}}
              />
            </div>
          </div>
        </div>
        <div className={styles.divDetailsAppointment}>
          <div>
            <MediumText2
              text={Strings.appointmentsDetailts}
              color={Colors.gray90}
              bold={true}
              style={{ lineHeight: '2px' }}
            />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <InputForm
              placeholder={Strings.unit}
              label={Strings.unit}
              readonly={true}
              containerStyle={{ width: '65%' }}
              control={control}
              name="unity"
              error={errors.unity?.message}
            />
            <SelectForm
              control={control}
              name="status"
              item={Strings.status}
              containerStyle={{ width: '30%' }}
              error={errors.status?.message}
              data={statusAppointment}
              onSelectChange={handleSelectStatus}
            />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <InputForm
              placeholder={Strings.placeholderPatient}
              readonly={true}
              label={Strings.labelPatient}
              type="text"
              containerStyle={{ width: '100%' }}
              control={control}
              name="patient"
              error={errors.unity?.message}
            />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <InputForm
              placeholder={Strings.specialist}
              label={Strings.specialist}
              control={control}
              readonly={true}
              name="specialist"
              containerStyle={{ width: '47.5%' }}
              error={errors.specialist?.message}
            />
            <InputForm
              placeholder={Strings.speciality}
              label={Strings.speciality}
              control={control}
              readonly={true}
              name="specialty"
              containerStyle={{ width: '47.5%' }}
              error={errors.status?.message}
            />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <InputForm
              placeholder={Strings.placeholderDate}
              label={Strings.labelDate}
              type="date"
              containerStyle={{ width: '35%' }}
              control={control}
              name="date"
              error={errors.date?.message}
              onBlur={handleDataSelected}
            />
            {hours !== null ? (
              <select
                onChange={(event) => {
                  handleGetScheduleId(event.target.value);
                }}
              >
                <option value="">Selecione o horário</option>
                {hours?.map((item: any) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.start}
                    </option>
                  );
                })}
              </select>
            ) : (
              <InputForm
                placeholder={Strings.placeholderHour}
                label={Strings.labelHour}
                type="time"
                containerStyle={{ width: '35%' }}
                control={control}
                readonly={true}
                name="hour"
                error={errors.date?.message}
              />
            )}
            <ColorSelector
              colors={tags}
              tagSelected={itemSelected?.tag_id}
              onColorChange={handleColorChange}
            />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <textarea
              className={styles.textAreaDivDetailsAppointment}
              placeholder={Strings.observation}
              value={inputObservation!}
              onChange={(event) => {
                setInputObservation(event.target.value);
              }}
            />
          </div>
          <div className={styles.btnsDetailsAppointments}>
            <ButtonPersonal
              title={Strings.save}
              type="secondary"
              onClick={handleSubmit(handleUpdateAppointment)}
            />
            <ButtonPersonal title={Strings.print} type="cancel" />
            <ButtonPersonal
              title={Strings.cancel}
              type="secondary"
              onClick={() => {
                handleCancelAppointment();
              }}
            />
            <ButtonPersonal
              title={Strings.clear}
              type="cancel"
              onClick={() => {
                handleClean();
              }}
            />
          </div>
        </div>
      </div>
      <Modal
        show={visible}
        onHide={() => {
          setVisible(false);
          setQuantityAppointments(quantityAppointments + 1);
        }}
        specialists={specialists !== null ? specialists : []}
        tags={tags !== null ? tags : []}
        patients={patients !== null ? patients : []}
        units={units !== null ? units : []}
      />

      <ModalSuccess
        show={showModalSuccess}
        onHide={() => {
          setShowModalSuccess(false);
        }}
        message={messageSuccess}
      />
    </React.Fragment>
  );
}
