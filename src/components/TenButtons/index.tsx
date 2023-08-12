'use client';

import React from 'react';

import styles from './tenbuttons.module.css';

import { addDays, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

function TenButtons() {
  const renderButtons = () => {
    const buttons = [];
    const [selectedDate, setSelectedDate] = React.useState<any>('');

    for (let i = 0; i < 10; i++) {
      const currentDate = addDays(new Date(), i);

      buttons.push(
        <button
          key={i}
          className={styles.btnDateSchedule}
          onClick={() => setSelectedDate(format(currentDate, 'yyyy-MM-dd'))}
          style={{
            backgroundColor:
              selectedDate === format(currentDate, 'yyyy-MM-dd')
                ? '#A1E2A5'
                : '#F2F2F2',
            color:
              selectedDate === format(currentDate, 'yyyy-MM-dd')
                ? '#fff'
                : '#000'
          }}
        >
          <p
            style={{
              fontSize: '11px',
              lineHeight: 0,
              marginTop: '4px',
              marginBottom: '0px'
            }}
          >
            {format(currentDate, 'EEE', { locale: ptBR }).slice(0, 3)}
          </p>
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1,
              marginTop: '10px',
              marginBottom: 0
            }}
          >
            {format(currentDate, 'dd')}
          </p>
          <p
            style={{
              fontSize: '11px',
              lineHeight: 1,
              marginTop: '0px',
              marginBottom: 0
            }}
          >
            {format(currentDate, 'MMM', { locale: ptBR }).slice(0, 3)}
          </p>
        </button>
      );
    }

    return buttons;
  };

  return renderButtons();
}

export default TenButtons;
