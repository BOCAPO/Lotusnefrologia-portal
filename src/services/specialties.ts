import { getJson } from '../http';

export async function getAllSpecialties() {
  return await getJson('/specialties');
}
