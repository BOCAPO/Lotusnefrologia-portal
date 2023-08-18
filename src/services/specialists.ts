import { deleteJson, getJson, postJson } from '../http';

import { DataSpecialistsModel } from 'models/DataSpecialistsModel';

export async function getAllSpecialists() {
  return await getJson('/specialists');
}

export async function getSpecialistsPerPage(page: number) {
  return await getJson(`/specialists?page=${page}`);
}

export async function getSpecialistById(id: number) {
  return await getJson(`/specialists/${id}`);
}

export async function getSpecialistsWithoutPagination() {
  return await getJson('/specialists?page=false');
}

export async function deleteSpecialist(id: number) {
  return await deleteJson(`/specialists/${id}`);
}

export async function createSpecialist(data: DataSpecialistsModel) {
  return await postJson('/specialists', data);
}

export async function updateSpecialistById(
  id: number,
  specialist: DataSpecialistsModel
) {
  return await postJson(`/specialists/${id}`, specialist);
}
