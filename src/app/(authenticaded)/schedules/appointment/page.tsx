'use client';

import React from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useForm } from 'react-hook-form';

import { Button as ButtonPersonal } from 'components/Button';
import ColorSelector from 'components/ColorSelector';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
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
import { ResponseSchedulesModel } from 'models/ResponseSchedulesModel';
import {
  getAllAppointmensTags,
  getAppointmentsMaxDate
} from 'services/appointments';
import { getHoursBySpecialistAndDateAndUnit } from 'services/schedules';
import { statusAppointment } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function AppointmentsPage(): JSX.Element {
  const [key, setKey] = React.useState('home');
  const [show, setShow] = React.useState(false);
  const [target, setTarget] = React.useState(null);
  const ref = React.useRef(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<any>(null);
  const [quantityAppointments, setQuantityAppointments] =
    React.useState<any>(0);
  const [inputObservation, setInputObservation] = React.useState<string>('');
  const [tags, setTags] = React.useState<any>(null);
  const [hours, setHours] = React.useState<any>(null);
  const [itemSelected, setItemSelected] = React.useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [optionsStatusAppointment, setOptionsStatusAppointment] =
    React.useState<any>(null);

  const handleClick = (event: any) => {
    setShow(!show);
    setTarget(event.target);
  };
  const {
    control,
    setValue,
    // handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getAppointmentMax();
    getAppointmentTags();
  }, [quantityAppointments]);

  async function getAppointmentTags() {
    const response = await getAllAppointmensTags();
    setTags(response.data.data);
  }

  async function getAppointmentMax() {
    const response = await getAppointmentsMaxDate();
    if (Array.isArray(response?.data)) {
      const dataUpdated = response.data.map((item: any) => {
        item.idAppointment = item.id;
        item.nameSpecialist = item.specialist_name;
        item.nameSpecialty = item.specialty || 'No Specialty';
        item.unityName = item.unit.name;
        item.newDate = format(new Date(item.time.slice(0, 10)), 'dd');
        item.dayOfWeek = format(new Date(item.time.slice(0, 10)), 'EEE', {
          locale: ptBR
        }).slice(0, 3);
        item.statTime = item.schecule.start.slice(0, 5);
        item.endTime = item.schecule.end.slice(0, 5);
        return item;
      });
      setQuantityAppointments(dataUpdated.length);
      setData(dataUpdated);
      setLoading(false);
    }
  }

  function getAppointment(item: any) {
    setValue('patient', item.patient.name);
    setValue('status', item.appointment_status);
    setValue('specialist', item.specialist_name);
    setValue('observation', item.observation);
    setValue('date', format(new Date(item.time.slice(0, 10)), 'yyyy-MM-dd'));
    const inputTime = item.time.slice(11, 22);
    const [hour, minutes] = inputTime.split(':').slice(0, 2);
    const formattedTime = format(new Date().setHours(hour, minutes), 'HH:mm');
    setValue('hour', formattedTime);
    setValue('unity', item.unit.name);
    setValue('specialty', item.specialty);
    setValue(
      'status',
      item.appointment_status === 'Agendado'
        ? 1
        : item.appointment_status === 'Pendente'
        ? 2
        : 3
    );
    setInputObservation(item?.observation?.length > 0 ? item.observation : '');
    setItemSelected(item);
  }

  async function getHoursSchedule(date: string) {
    const response = await getHoursBySpecialistAndDateAndUnit(
      itemSelected?.specialty_id,
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
        setOptionsStatusAppointment('Agendado');
        break;
      case '2':
        setOptionsStatusAppointment('Cancelado');
        break;
      case '3':
        setOptionsStatusAppointment('Realizado');
        break;
      default:
        setOptionsStatusAppointment('Confirmado');
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
              ) : data !== null &&
                data.filter(
                  (item: any) => item.appointment_status === 'Agendado'
                ).length > 0 ? (
                data?.map((item: any, index: number) => {
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
                      <div ref={ref}>
                        <Button
                          onClick={handleClick}
                          className={styles.btnOptionsAppoitnment}
                        >
                          {Strings.edit}
                        </Button>
                        <Overlay
                          show={show}
                          target={target}
                          placement="left"
                          container={ref}
                          containerPadding={20}
                          onHide={() => setShow(false)}
                          rootClose={true}
                        >
                          <Popover
                            id="popover-contained"
                            className={styles.popoverContained}
                          >
                            <Popover.Body>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.aprove}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.change}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.cancel}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.delete}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                            </Popover.Body>
                          </Popover>
                        </Overlay>
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
            <Tab eventKey="profile" title="Pendentes">
              {loading ? (
                <SpinnerLoading />
              ) : data !== null &&
                data.filter(
                  (item: any) => item.appointment_status === 'Pendente'
                ).length > 0 ? (
                data?.map((item: any, index: number) => {
                  return (
                    <div className={styles.itemListAppointments} key={index}>
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
                      <div ref={ref}>
                        <Button
                          onClick={handleClick}
                          className={styles.btnOptionsAppoitnment}
                        >
                          {Strings.edit}
                        </Button>
                        <Overlay
                          show={show}
                          target={target}
                          placement="bottom"
                          container={ref}
                          containerPadding={20}
                          onHide={() => setShow(false)}
                          rootClose={true}
                        >
                          <Popover
                            id="popover-contained"
                            className={styles.popoverContained}
                          >
                            <Popover.Body>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.aprove}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.change}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.cancel}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.delete}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                            </Popover.Body>
                          </Popover>
                        </Overlay>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noAppointments}>
                  <MediumText2
                    text={Strings.noAppointmentsPendent}
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
              ) : data !== null &&
                data.filter(
                  (item: any) => item.appointment_status === 'Cancelado'
                ).length > 0 ? (
                data?.map((item: any, index: number) => {
                  return (
                    <div className={styles.itemListAppointments} key={index}>
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
                      <div ref={ref}>
                        <Button
                          onClick={handleClick}
                          className={styles.btnOptionsAppoitnment}
                        >
                          {Strings.edit}
                        </Button>
                        <Overlay
                          show={show}
                          target={target}
                          placement="bottom"
                          container={ref}
                          containerPadding={20}
                          onHide={() => setShow(false)}
                          rootClose={true}
                        >
                          <Popover
                            id="popover-contained"
                            className={styles.popoverContained}
                          >
                            <Popover.Body>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.aprove}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.change}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.cancel}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                              <div className={styles.popoverOptions}>
                                <LitteText
                                  text={Strings.delete}
                                  color={Colors.gray90}
                                  bold={false}
                                  style={{ lineHeight: '2px' }}
                                />
                              </div>
                            </Popover.Body>
                          </Popover>
                        </Overlay>
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
            <ButtonPersonal title={Strings.makeAppointment} type="secondary" />
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
              placeholder={Strings.unity}
              label={Strings.unity}
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
              <SelectForm
                control={control}
                name="hour"
                item={Strings.hour}
                containerStyle={{ width: '35%' }}
                error={errors.hour?.message}
                data={hours}
              />
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
            <ColorSelector colors={tags} />
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
            <ButtonPersonal title={Strings.save} type="secondary" />
            <ButtonPersonal title={Strings.print} type="cancel" />
            <ButtonPersonal
              title={Strings.cancel}
              type="cancel"
              onClick={() => {
                handleClean();
              }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
