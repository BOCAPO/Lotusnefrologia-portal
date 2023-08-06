import { DataUnitsModel } from './DataUnitsModel';
import { LinksModel } from './LinksModel';

export type ResponseGetModel = {
  current_page: number;
  data: DataUnitsModel[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: LinksModel[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
};
