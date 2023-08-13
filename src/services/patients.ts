import { getJson, postJson } from '../http';

import { DataPatientsModel } from 'models/DataPatientsModel';

export async function getAllPatients() {
  return await getJson('/patients');
}

export async function createPatient(patient: DataPatientsModel) {
  return await postJson('/patients', patient);
}

export async function getPatientsPerPage(page: number) {
  return await getJson(`/patients?page=${page}`);
}
