import { DataUnitsModel } from './DataUnitsModel';

export type DataInvoicesModel = {
  id?: number;
  unit_id: number;
  unit?: DataUnitsModel;
  supplier: string;
  date: string;
  cnpj: string;
  number: string;
  series: string;
  amount: string;
  discount: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  status?: number;
  product?: string;
};
