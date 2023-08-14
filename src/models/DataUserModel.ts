import { DataUnitsModel } from './DataUnitsModel';

export type DataUserModel = {
  id?: number;
  cpf: string;
  name: string;
  email: string;
  phone_primary: string;
  phone_secondary: string;
  zip_code: string;
  citie_code: string;
  street: string;
  number: string;
  block: string;
  lot: string;
  password?: string;
  complement: string | null;
  units: number[] | DataUnitsModel[];
  status: number;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};
