import { DataPatientsModel } from './DataPatientsModel';

export type DataRoomsModel = {
  id?: number;
  name: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  pivot?: {
    user_id: number;
    room_id: number;
  };
};

export type DataRoomAttendModel = {
  id: number;
  attendant_id: number;
  end_by?: string | null;
  end_id?: number | null;
  end_time?: string | null;
  patient: DataPatientsModel;
  room: DataRoomsModel;
  room_id: number;
  room_uuid: string;
  sender_id?: number;
  start_time?: string;
  unit_id: number;
  created_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
};
