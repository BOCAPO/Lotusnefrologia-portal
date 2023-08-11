import { getJson, postJson } from '../http';

import { DataAppoitmensModel } from 'models/DataAppoitmensModel';

export async function getAllAppointments() {
  return await getJson('/appointments');
}

export async function createAppointment(appointment: DataAppoitmensModel) {
  return await postJson('/appointments', appointment);
}

export async function getAllAppointmensTags() {
  return await getJson('/appointment-tags');
}
