'use client';

import React from 'react';

import { MenuTop } from 'components/MenuTop';

import styles from './calendar.module.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';

export default function CalendarPage(): JSX.Element {
  const events = [{ title: 'Meeting', start: new Date() }];

  function renderEventContent(eventInfo: any) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyCalendar}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          titleFormat={{ year: 'numeric', month: 'long' }}
          weekends={true}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          events={events}
          locale={'pt-br'}
          eventContent={renderEventContent}
          height={'70vh'}
          timeZone="UTC-3"
          allDayClassNames={styles.allDayClassNames}
          viewClassNames={styles.viewClassNames}
          dayCellClassNames={styles.dayCellClassNames}
          dayHeaderClassNames={styles.dayHeaderClassNames}
          weekNumberClassNames={styles.weekNumberClassNames}
          dayHeaders={true}
          stickyHeaderDates={true}
          dayHeaderFormat={{ weekday: 'short' }}
          dayHeaderDidMount={(info: any) => {
            const el = info.el;
            el.style.backgroundColor = '#464646';
            el.style.borderBottom = '1px solid #ddd';
          }}
          dayCellDidMount={(info: any) => {
            const el = info.el;
            el.style.backgroundColor = '#dbdbdb';
            el.style.borderBottom = '1px solid #ddd';
          }}
          weekNumberDidMount={(info: any) => {
            const el = info.el;
            el.style.backgroundColor = '#a07979';
            el.style.borderBottom = '1px solid #ddd';
          }}
          eventDidMount={(info: any) => {
            const el = info.el;
            el.style.backgroundColor = '#a07979';
            el.style.borderBottom = '1px solid #ddd';
          }}
        />
      </div>
    </React.Fragment>
  );
}
