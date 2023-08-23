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
import { getAppointmentsMaxDate } from 'services/appointments';

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

  const handleClick = (event: any) => {
    setShow(!show);
    setTarget(event.target);
  };
  const {
    control,
    // handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getAppointmentMax();
  }, []);

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

      setData(dataUpdated);
      setLoading(false);
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
              ) : data !== null ? (
                data?.map((item: any, index: number) => {
                  return (
                    item.appointment_status === 'Agendado' && (
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
                    )
                  );
                })
              ) : (
                <div className={styles.noAppointments}>
                  <MediumText2
                    text={Strings.noAppointments}
                    color={Colors.gray90}
                    bold={true}
                    style={{ lineHeight: '2px' }}
                  />
                </div>
              )}
            </Tab>
            <Tab eventKey="profile" title="Pendentes">
              Tab content for Profile
            </Tab>
            <Tab eventKey="contact" title="Canceladas">
              Tab content for Contact
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
              placeholder={Strings.description}
              label={Strings.description}
              type="text"
              containerStyle={{ width: '65%' }}
              control={control}
              name="description"
              error={errors.description?.message}
            />
            <SelectForm
              control={control}
              name="status"
              item={Strings.status}
              containerStyle={{ width: '30%' }}
              error={errors.status?.message}
              data={null}
            />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <InputForm
              placeholder={Strings.unity}
              label={Strings.unity}
              type="text"
              containerStyle={{ width: '100%' }}
              control={control}
              name="unity"
              error={errors.unity?.message}
            />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <InputForm
              placeholder={Strings.placeholderPatient}
              label={Strings.labelPatient}
              type="text"
              containerStyle={{ width: '100%' }}
              control={control}
              name="patient"
              error={errors.unity?.message}
            />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <SelectForm
              control={control}
              name="specialist"
              containerStyle={{ width: '47.5%' }}
              item={Strings.specialist}
              error={errors.specialist?.message}
              data={null}
            />
            <SelectForm
              control={control}
              name="specialty"
              containerStyle={{ width: '47.5%' }}
              item={Strings.speciality}
              error={errors.status?.message}
              data={null}
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
            />
            <InputForm
              placeholder={Strings.placeholderHour}
              label={Strings.labelHour}
              type="time"
              containerStyle={{ width: '35%' }}
              control={control}
              name="date"
              error={errors.date?.message}
            />
            <ColorSelector colors={null} />
          </div>
          <div className={styles.internalDivDetailsAppointment}>
            <textarea
              className={styles.textAreaDivDetailsAppointment}
              placeholder={Strings.observation}
            />
          </div>
          <div className={styles.btnsDetailsAppointments}>
            <ButtonPersonal title={Strings.save} type="secondary" />
            <ButtonPersonal title={Strings.print} type="cancel" />
            <ButtonPersonal title={Strings.cancel} type="cancel" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
