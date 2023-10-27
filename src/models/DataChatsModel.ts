import { DataMessagesModel } from './DataMessagesModel';
import { DataPatientsModel } from './DataPatientsModel';
import { DataAttendantModel, DataRoomsModel } from './DataRoomsModel';

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

export type DataHistoryChatsModel = {
  id: number;
  sender_id: number;
  attendant_id: number;
  unit_id: number;
  room_id: number;
  room_uuid: string;
  start_time: string;
  end_time: string;
  end_id: number;
  end_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  room: DataRoomsModel;
  patient: DataPatientsModel;
  attendant: DataAttendantModel;
};
