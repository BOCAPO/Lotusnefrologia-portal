import { getJson } from '../http';

export async function getAllAppointments() {
  return await getJson('/appointments');
}

export async function getAllAppointmensTags() {
  return await getJson('/appointment-tags');
}
