import { addDays, format } from 'date-fns';

export default function formatDate(inputDateStr: string) {
  const inputDate = new Date(inputDateStr);
  if (!isNaN(inputDate.getTime())) {
    const dateWithOneDayAdded = addDays(inputDate, 1);
    const formattedDate = format(dateWithOneDayAdded, 'dd/MM/yyyy');
    return formattedDate;
  } else {
    return inputDateStr;
  }
}
