import { deleteJson, getJson, postJson, putJson } from '../http';

import { DataUnitsModel } from 'models/DataUnitsModel';

export async function getAllUnits() {
  return await getJson('/units');
}

export async function getAllUnitsWithoutPagination() {
  return await getJson('/units?page=false');
}

export async function getUnitsPerPage(page: number) {
  return await getJson(`/units?page=${page}`);
}

export async function createUnit(unit: DataUnitsModel) {
  return await postJson('/units', unit);
}

export async function deleteUnit(id: number) {
  return await deleteJson(`/units/${id}`);
}

export async function getUnitsById(id: number) {
  return await getJson(`/units/${id}`);
}

export async function updateUnitById(id: number, unit: DataUnitsModel) {
  return await putJson(`/units/${id}`, unit);
}
