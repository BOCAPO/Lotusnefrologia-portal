import { getJson, postJson } from '../http';

import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';

export async function getAllSpecialties() {
  return await getJson('/specialties');
}

export async function getSpecialtiesPerPage(page: number) {
  return await getJson(`/specialties?page=${page}`);
}

export async function createSpecialty(specialty: DataSpecialtiesModel) {
  return await postJson('/specialties', specialty);
}
