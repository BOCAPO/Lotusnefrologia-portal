import { getJson } from '../http';

export async function getAllRoles() {
  return await getJson('/roles');
}
