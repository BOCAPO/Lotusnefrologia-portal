import { getJson } from '../http';

export async function getAllCities() {
  return await getJson('/cities?page=false');
}
