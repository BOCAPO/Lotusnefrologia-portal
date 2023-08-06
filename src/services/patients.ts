import { getJson } from '../http';

export async function getAllPatients() {
  return await getJson('/patients');
}
