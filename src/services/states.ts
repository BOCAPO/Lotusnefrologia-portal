import { getJson } from '../http';

export async function getAllStates() {
  return await getJson('/states?page=false');
}
