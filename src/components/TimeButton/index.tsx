import styles from './timebutton.module.css'; // Substitua pelo caminho correto

interface TimeButtonProps {
  periodicity: number;
}

export function TimeButton({ periodicity }: TimeButtonProps) {
  const generateTimeButtons = () => {
    const startTime = new Date();
    startTime.setHours(6, 0, 0, 0); // 06:00

    const endTime = new Date();
    endTime.setHours(17, 30, 0, 0); // 17:30

    const timeButtons: JSX.Element[] = [];
    const currentTime = new Date(startTime);

    while (currentTime <= endTime) {
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

    return timeButtons;
  };

  return generateTimeButtons();
}
