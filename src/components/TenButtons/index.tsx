import React from 'react';

import CalendarButton from 'components/CalendarButton';

import styles from './tenbuttons.module.css';

import { addDays, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface TenButtonsProps {
  onDateSelect: (selectedDate: string) => void;
}

function TenButtons({ onDateSelect }: TenButtonsProps) {
  const renderButtons = () => {
    const buttons = [];
    const [selectedDate, setSelectedDate] = React.useState<string>('');

    const handleDateClick = (date: string) => {
      setSelectedDate(date);
      onDateSelect(date); // Chama o callback passando a data selecionada
    };

    const handleDateCalendar = (date: string) => {
      setSelectedDate(format(new Date(date), 'yyyy-MM-dd'));
      onDateSelect(format(new Date(date), 'yyyy-MM-dd'));
    };

    for (let i = 0; i < 10; i++) {
      const currentDate = addDays(new Date(), i);
      const formattedDate = format(currentDate, 'yyyy-MM-dd');

      buttons.push(
        <button
          key={i}
          className={styles.btnDateSchedule}
          onClick={() => handleDateClick(formattedDate)}
          style={{
            backgroundColor:
              selectedDate === formattedDate ? '#A1E2A5' : '#F2F2F2',
            color: selectedDate === formattedDate ? '#fff' : '#000'
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
    buttons.push(
      <CalendarButton key={11} onSelectedDateCalendar={handleDateCalendar} />
    );

    return buttons;
  };

  return renderButtons();
}

export default TenButtons;
