'use client';

import React from 'react';

import { Button } from 'components/Button';
import { MenuTop } from 'components/MenuTop';
import Modal from 'components/ModalBoxSchedule';
import { SpinnerLoading } from 'components/Spinner';

import styles from './calendar.module.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataAppoitmensModel } from 'models/DataAppoitmensModel';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { Prefs } from 'repository/Prefs';
import {
  getAllAppointmensTags,
  getAllAppointmentsWithoutPagination
} from 'services/appointments';
import { getPatientsWithoutPagination } from 'services/patients';
import { getSpecialistsWithoutPagination } from 'services/specialists';
import { getAllUnits } from 'services/units';

export default function CalendarPage(): JSX.Element {
  const [events, setEvents] = React.useState([
    { title: 'event 1', date: '2023-08-28 15:30:00' }
  ]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [specialists, setSpecialists] = React.useState<any>(null);
  const [patients, setPatients] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [tags, setTags] = React.useState<any>(null);
  const [quantityAppointments, setQuantityAppointments] =
    React.useState<any>(0);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    async function getAppointments() {
      const response = await getAllAppointmentsWithoutPagination();
      const appointments = response.data as unknown as DataAppoitmensModel[];
      setQuantityAppointments(appointments.length);
      const eventsCaptured: any[] = [];
      appointments.map((appointment: any) => {
        eventsCaptured.push({
          title: appointment.patient.name,
          date: appointment.schedule.date,
          time: appointment.schedule.start
        });
      });
      setEvents(eventsCaptured);
      setIsLoading(false);
    }
    getAppointments();
    getSpecialists();
    getAppointmentTags();
    getPatients();
    getUnits();
  }, [quantityAppointments]);

  function renderEventContent(eventInfo: any) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  async function getAppointmentTags() {
    const response = await getAllAppointmensTags();
    setTags(response.data.data);
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

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyCalendar}>
        {isLoading ? (
          <SpinnerLoading />
        ) : (
          <React.Fragment>
            <div className={styles.btnContainer}>
              <div className={styles.btnAddSchedule}>
                <Button
                  type="secondary"
                  title={Strings.makeAppointment}
                  isLoading={isLoading}
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              </div>
            </div>
            <FullCalendar
              themeSystem="bootstrap5"
              titleFormat={{ year: 'numeric', month: 'long' }}
              plugins={[dayGridPlugin]}
              height={'100%'}
              slotEventOverlap={true}
              slotMinTime={'08:00:00'}
              slotMaxTime={'22:00:00'}
              initialView="dayGridMonth"
              timeZoneParam="UTC-3"
              weekends={true}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
              }}
              events={events}
              locale={'pt-br'}
              eventContent={renderEventContent}
              timeZone="America/Sao_Paulo"
              showNonCurrentDates={true}
              weekNumberCalculation={'ISO'}
              weekNumberFormat={
                {
                  week: 'numeric'
                } as any
              }
              weekNumbers={true}
              dayMaxEventRows={true}
              dayMaxEvents={true}
              dayHeaderWillUnmount={(info: any) => {
                const el = info.el;
                el.style.backgroundColor = Colors.white;
                el.style.border = 'none';
                el.style.color = Colors.gray90 + ' !important';
                el.style.borderBottom = '1px solid #ddd';
              }}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '08:00',
                endTime: '22:00'
              }}
              buttonText={
                {
                  today: 'Hoje',
                  month: 'Mês',
                  week: 'Semana',
                  day: 'Dia',
                  list: 'Lista',
                  more: 'Mais'
                } as any
              }
              slotLaneClassNames={styles.slotLaneClassNames}
              slotLabelClassNames={styles.slotLabelClassNames}
              slotMinWidth={100}
              slotDuration={'00:30:00'}
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short'
              }}
              timeHint="Horário disponível"
              slotLabelInterval={'00:30:00'}
              firstDay={0}
              displayEventTime={true}
              slotLabelDidMount={(info: any) => {
                const el = info.el;
                el.style.backgroundColor = Colors.white;
                el.style.border = 'none';
                el.style.color = Colors.gray90;
                el.style.borderBottom = '1px solid #ddd';
              }}
              slotLabelWillUnmount={(info: any) => {
                const el = info.el;
                el.style.backgroundColor = Colors.white;
                el.style.border = 'none';
                el.style.color = Colors.gray90;
                el.style.borderBottom = '1px solid #ddd';
              }}
              slotLabelContent={(info: any) => {
                const el = info.el;
                el.style.backgroundColor = Colors.white;
                el.style.border = 'none';
                el.style.color = Colors.gray90;
                el.style.borderBottom = '1px solid #ddd';
              }}
              allDayDidMount={(info: any) => {
                const el = info.el;
                el.style.backgroundColor = Colors.white;
                el.style.border = 'none';
                el.style.color = Colors.gray90;
                el.style.borderBottom = '1px solid #ddd';
              }}
              allDayClassNames={styles.allDayClassNames}
              viewClassNames={styles.viewClassNames}
              dayCellClassNames={styles.dayCellClassNames}
              dayHeaderClassNames={styles.dayHeaderClassNames}
              weekNumberClassNames={styles.weekNumberClassNames}
              nowIndicatorClassNames={styles.nowIndicatorClassNames}
              eventClassNames={styles.eventClassNames}
              monthStartFormat={
                {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric'
                } as any
              }
              dayHeaderFormat={{ weekday: 'short' }}
              dayHeaderDidMount={(info: any) => {
                const el = info.el;
                el.style.backgroundColor = Colors.white;
                el.style.border = 'none';
                el.style.color = Colors.gray90;
                el.style.borderBottom = '1px solid #ddd';
              }}
              dayCellDidMount={(info: any) => {
                const el = info.el;
                el.style.backgroundColor = Colors.white;
                el.style.border = '1px solid #ddd';
              }}
              eventDidMount={(info: any) => {
                const el = info.el;
                el.style.backgroundColor = '#00c42a';
                el.style.borderBottom = '1px solid #ddd';
              }}
            />
          </React.Fragment>
        )}
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
    </React.Fragment>
  );
}
