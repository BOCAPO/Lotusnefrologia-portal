import { deleteJson, getJson, postJson, putJson } from '../http';

import { DataPatientsModel } from 'models/DataPatientsModel';

export async function getAllPatients() {
  return await getJson('/patients');
}

export async function createPatient(patient: DataPatientsModel) {
  return await postJson('/patients', patient);
}

export async function getPatientsWithoutPagination() {
  return await getJson('/patients?page=false');
}

export async function getPatientsPerPage(page: number) {
  return await getJson(`/patients?page=${page}`);
}

export async function deletePatient(id: number) {
  return await deleteJson(`/patients/${id}`);
}

export async function getPatientById(id: number) {
  return await getJson(`/patients/${id}`);
}

export async function updatePatient(id: number, patient: DataPatientsModel) {
  return await putJson(`/patients/${id}`, patient);
}

export async function getSearchedPatients(search: string) {
  return await getJson(`/patients?search=${search}`);
}
