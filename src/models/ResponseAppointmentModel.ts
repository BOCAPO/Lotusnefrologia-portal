import { DataPatientsModel } from './DataPatientsModel';
import { DataUnitsModel } from './DataUnitsModel';

export type ResponseAppointmentModel = [
  {
    id: number;
    specialist_id: number;
    specialist_name: string;
    specialist_photo: string | null;
    specialty: string;
    schecule: string;
    patient: DataPatientsModel;
    unit: DataUnitsModel;
    appointment_status: string;
    time: string;
    tag_id: number;
    tag_color: string;
  }
];
