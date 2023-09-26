import { DataDishesModel } from './DataDishesModel';
import { DataPatientsModel } from './DataPatientsModel';

export type DataOrdersModel = {
  id: string;
  patient_id: number;
  patient: DataPatientsModel;
  order_status: number;
  start: string;
  end: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  status: string;
  dishes: DataDishesModel[];
};
