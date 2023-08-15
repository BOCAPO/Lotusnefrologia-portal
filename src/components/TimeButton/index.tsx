'use client';

import React from 'react';

import styles from './timebutton.module.css';

interface TimeButtonProps {
  startTime: string;
  endTime: string;
  periodicity: number;
  onTimeSelect: (selectedTime: []) => void;
  selectedDate?: string;
}

export function TimeButton({
  startTime,
  endTime,
  periodicity,
  selectedDate,
  onTimeSelect
}: TimeButtonProps) {
  const generateTimeButtons = () => {
    const startTimeParts = startTime.split(':').map(Number);
    const endTimeParts = endTime.split(':').map(Number);
    const [hoursSelected, setHoursSelected] = React.useState<any>([]);

    React.useEffect(() => {
      setHoursSelected([]);
    }, [selectedDate]);

    const startDate = new Date();
    startDate.setHours(startTimeParts[0], startTimeParts[1], 0, 0);

    const endDate = new Date();
    endDate.setHours(endTimeParts[0], endTimeParts[1], 0, 0);

    const timeButtons: JSX.Element[] = [];
    const currentTime = new Date(startDate);

    async function handleTimeButtons(formattedTime: string) {
      const dataHoursSelected = hoursSelected;
      if (dataHoursSelected.includes(formattedTime) === true) {
        const index = dataHoursSelected.indexOf(formattedTime);
        if (index > -1) {
          dataHoursSelected.splice(index, 1);
          setHoursSelected(dataHoursSelected);
          onTimeSelect(dataHoursSelected);
        }
      } else {
        dataHoursSelected.push(formattedTime);
        onTimeSelect(dataHoursSelected);
        setHoursSelected(dataHoursSelected);
      }
    }

    while (currentTime <= endDate) {
      const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      timeButtons.push(
        <button
          key={formattedTime}
          className={styles.btnTimeButton}
          onClick={() => handleTimeButtons(formattedTime)}
          style={{
            backgroundColor: hoursSelected.includes(formattedTime)
              ? '#A1E2A5'
              : '#F2F2F2',
            color: hoursSelected.includes(formattedTime) ? '#fff' : '#000'
          }}
        >
          <p>{formattedTime}</p>
        </button>
      );

      currentTime.setMinutes(currentTime.getMinutes() + periodicity);
    }

    if (timeButtons.length > 0) {
      return timeButtons;
    } else {
      return <p>Não há horários disponíveis</p>;
    }
  };

  return generateTimeButtons();
}
