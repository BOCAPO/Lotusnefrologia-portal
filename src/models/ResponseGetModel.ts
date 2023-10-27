import { DataAppoitmentTag } from './DataAppoitmentTag';
import { DataHistoryChatsModel } from './DataChatsModel';
import { DataDishesModel } from './DataDishesModel';
import { DataInvoicesModel } from './DataInvoicesModel';
import { DataPatientsModel } from './DataPatientsModel';
import { DataProductsModel } from './DataProductsModel';
import { DataRolesModel } from './DataRolesModel';
import { DataRoomsModel } from './DataRoomsModel';
import { DataSpecialistsModel } from './DataSpecialistsModel';
import { DataSpecialtiesModel } from './DataSpecialtiesModel';
import { DataStatesModel } from './DataStatesModel';
import { DataUnitsModel } from './DataUnitsModel';
import { LinksModel } from './LinksModel';
import { ResponseAppointmentModel } from './ResponseAppointmentModel';

export type ResponseGetModel = {
  current_page: number;
  data:
    | DataUnitsModel[]
    | DataSpecialistsModel[]
    | DataSpecialtiesModel[]
    | DataPatientsModel[]
    | DataStatesModel[]
    | DataAppoitmentTag[]
    | DataRolesModel[]
    | DataProductsModel[]
    | DataInvoicesModel[]
    | DataDishesModel[]
    | DataRoomsModel[]
    | DataHistoryChatsModel[]
    | ResponseAppointmentModel;
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
