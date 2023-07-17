import { http } from 'http';

export async function login(login: string, password: string) {
  const body = {
    login,
    password
  };

  return await http.post('/login', body);
}
