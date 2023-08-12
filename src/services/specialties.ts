import { getJson, postJson } from '../http';

import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';

export async function getAllSpecialties() {
  return await getJson('/specialties');
}

export async function createSpecialty(specialty: DataSpecialtiesModel) {
  return await postJson('/specialties', specialty);
}
