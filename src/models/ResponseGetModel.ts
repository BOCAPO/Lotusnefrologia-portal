import { DataAppoitmentTag } from './DataAppoitmentTag';
import { DataPatientsModel } from './DataPatientsModel';
import { DataRolesModel } from './DataRolesModel';
import { DataSpecialistsModel } from './DataSpecialistsModel';
import { DataSpecialtiesModel } from './DataSpecialtiesModel';
import { DataStatesModel } from './DataStatesModel';
import { DataUnitsModel } from './DataUnitsModel';
import { LinksModel } from './LinksModel';

export type ResponseGetModel = {
  current_page: number;
  data:
    | DataUnitsModel[]
    | DataSpecialistsModel[]
    | DataSpecialtiesModel[]
    | DataPatientsModel[]
    | DataStatesModel[]
    | DataAppoitmentTag[]
    | DataRolesModel[];
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
