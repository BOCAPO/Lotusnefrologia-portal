import { UserModel } from './UserModel';

export type ResponseUserModel = {
  status: boolean;
  message: string;
  token: string;
  usuario: UserModel;
};
