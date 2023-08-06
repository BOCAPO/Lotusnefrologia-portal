import { getJson } from '../http';

export async function getAllUsers() {
  return await getJson('/users');
}
