export type DataMessagesModel = {
  room: string;
  message: string;
  chat_id?: number;
  user?: string;
  id?: number;
  recipient_id?: number;
  sender_id?: number;
  sender_type?: string;
  created_at?: string;
  updated_at?: string;
};
