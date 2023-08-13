import { DataUserModel } from './DataUserModel';

export type ResponseUserModel = {
  status: boolean;
  message: string;
  token: string;
  usuario: DataUserModel;
};
