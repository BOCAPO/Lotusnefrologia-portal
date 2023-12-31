import { DataUnitsModel } from './DataUnitsModel';

export type DataPatientsModel = {
  id?: number;
  cpf: string;
  name: string;
  email: string;
  phone_primary: string;
  phone_secondary?: string;
  birthday: string;
  zip_code: string;
  city_code: string;
  street: string;
  number: string;
  block: string;
  lot: string;
  complement: string | null;
  status: number;
  password?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  unit: number | DataUnitsModel[];
};
