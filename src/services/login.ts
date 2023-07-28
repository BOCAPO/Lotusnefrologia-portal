import { postFormData } from '../http';

export async function login(login: string, password: string) {
  const formData = new FormData();
  formData.append('cpf', login);
  formData.append('password', password);

  return await postFormData('/auth/login', formData);
}
