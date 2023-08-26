import { getJson, postJson, putJson } from '../http';

import { DataAppoitmensModel } from 'models/DataAppoitmensModel';

export async function getAllAppointments() {
  return await getJson('/appointments');
}

export async function createAppointment(appointment: DataAppoitmensModel) {
  return await postJson('/appointments', appointment);
}

export async function getAllAppointmentsWithoutPagination() {
  return await getJson('/appointments?page=false');
}

export async function getAllAppointmensTags() {
  return await getJson('/appointment-tags');
}

export async function getAllAppointmentsWithSchedule(date?: string) {
  if (date) {
    return await getJson(`/appointments/scheduled/${date}`);
  }
  return await getJson('/appointments/scheduled');
}

export async function getAppointmentsMaxDate(max: number = 30) {
  return await getJson(`/appointments/history/${max}`);
}

export async function updateAppointment(
  id: number,
  appointment: DataAppoitmensModel
) {
  return await putJson(`/appointments/${id}`, appointment);
}
