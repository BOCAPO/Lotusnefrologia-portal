import styles from './timebutton.module.css'; // Substitua pelo caminho correto

interface TimeButtonProps {
  startTime: string;
  endTime: string;
  periodicity: number;
}

export function TimeButton({
  startTime,
  endTime,
  periodicity
}: TimeButtonProps) {
  const generateTimeButtons = () => {
    // console.log('startTime', startTime);
    // console.log('endTime', endTime);
    const startTimeParts = startTime.split(':').map(Number);
    const endTimeParts = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startTimeParts[0], startTimeParts[1], 0, 0);

    const endDate = new Date();
    endDate.setHours(endTimeParts[0], endTimeParts[1], 0, 0);

    const timeButtons: JSX.Element[] = [];
    const currentTime = new Date(startDate);

    while (currentTime <= endDate) {
      const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      timeButtons.push(
        <button key={formattedTime} className={styles.btnTimeButton}>
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
