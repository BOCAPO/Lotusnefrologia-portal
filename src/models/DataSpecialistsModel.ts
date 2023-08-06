import { DataUnitsModel } from './DataUnitsModel';

export type DataSpecialistsModel = {
  id: number;
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
  complement: string | null;
  password: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  units: DataUnitsModel[];
  specialties: [];
};
