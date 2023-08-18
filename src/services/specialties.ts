import { deleteJson, getJson, postJson, putJson } from '../http';

import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';

export async function getAllSpecialties() {
  return await getJson('/specialties');
}

export async function getSpecialtiesPerPage(page: number) {
  return await getJson(`/specialties?page=${page}`);
}

export async function getSpecialtyById(id: number) {
  return await getJson(`/specialties/${id}`);
}

export async function createSpecialty(specialty: DataSpecialtiesModel) {
  return await postJson('/specialties', specialty);
}

export async function updateSpecialty(
  specialty: DataSpecialtiesModel,
  id: number
) {
  return await putJson(`/specialties/${id}`, specialty);
}

export async function deleteSpecialty(id: number) {
  return await deleteJson(`/specialties/${id}`);
}
