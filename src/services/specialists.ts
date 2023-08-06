import { getJson } from '../http';

export async function getAllSpecialists() {
  return await getJson('/specialists');
}
