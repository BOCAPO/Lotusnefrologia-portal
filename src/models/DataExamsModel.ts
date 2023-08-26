import { DataExamsTypeModel } from './DataExamsTypeModel';
import { DataPatientsModel } from './DataPatientsModel';

export type DataExamsModel = {
  id?: number;
  patient_id: number;
  examType_id: number;
  date: string;
  path: string;
  extension: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  filename?: string;
  patient?: DataPatientsModel;
  exam_type?: DataExamsTypeModel;
};
