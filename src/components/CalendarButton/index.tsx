import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { Icon, TypeIcon } from 'components/Icone';

import styles from './calendarbutton.module.css';

import ptBR from 'date-fns/locale/pt-BR';

interface CalendarButtonProps {
  onSelectedDateCalendar: (date: string) => void;
}

function CalendarButton({ onSelectedDateCalendar }: CalendarButtonProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateCalendar, setSelectedDateCalendar] = useState(new Date());

  const handleOpen = () => {
    setShowCalendar(true);
  };

  const handleClose = () => {
    setShowCalendar(false);
  };

  const handleDateChange = (date: any) => {
    setSelectedDateCalendar(date);
    onSelectedDateCalendar(date);
    setShowCalendar(false);
  };

  return (
    <div className={styles.containerBtnCalendar}>
      <button onClick={handleOpen} className={styles.btnAddCalendar}>
        <Icon typeIcon={TypeIcon.Add} color="#fff" size={30} />
      </button>
      <Modal
        show={showCalendar}
        onHide={handleClose}
        centered
        size="sm"
        className={styles.modalDatePicker}
      >
        <Modal.Body className={styles.bodyModalDatePicker}>
          <DatePicker
            selected={selectedDateCalendar}
            onChange={handleDateChange}
            dateFormat="dd MMMM yyyy"
            locale={ptBR}
            className={styles.datePicker}
          />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

export default CalendarButton;
