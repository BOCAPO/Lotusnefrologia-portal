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

export async function getAllAppointmentsWithSchedule(date?: string) {
  if (date) {
    return await getJson(`/appointments/scheduled/${date}`);
  }
  return await getJson('/appointments/scheduled');
}

export async function getAppointmentsMaxDate(max: number = 30) {
  return await getJson(`/appointments/history/${max}`);
}
