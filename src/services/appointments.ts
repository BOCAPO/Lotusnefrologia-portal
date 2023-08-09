import { getJson } from '../http';

export async function getAllAppointments() {
  return await getJson('/appointments');
}
