import { DataMessagesModel } from './DataMessagesModel';
import { DataPatientsModel } from './DataPatientsModel';
import { DataRoomsModel } from './DataRoomsModel';

export type DataChatsModel = {
  attendant_id: number;
  end_by?: string;
  end_id?: string;
  end_time?: string;
  id: number;
  messages: DataMessagesModel[];
  patient: DataPatientsModel;
  room: DataRoomsModel;
  room_id: number;
  room_uuid: string;
  sender_id: number;
  start_time: string;
  unit_id: number;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};
