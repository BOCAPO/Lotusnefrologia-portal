import { getJson, postJson } from '../http';

import { DataPatientsModel } from 'models/DataPatientsModel';

export async function getAllPatients() {
  return await getJson('/patients');
}

export async function createPatient(patient: DataPatientsModel) {
  return await postJson('/patients', patient);
}
