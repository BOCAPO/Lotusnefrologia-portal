import { getJson } from '../http';

export async function getAllUnits() {
  return await getJson('/units');
}
