import { getJson, postJson } from '../http';

import { DataRolesModel } from 'models/DataRolesModel';

export async function getAllRoles() {
  return await getJson('/roles');
}

export async function getRolesPerPage(page: number) {
  return await getJson(`/roles?page=${page}`);
}

export async function createRole(data: DataRolesModel) {
  return await postJson('/roles', data);
}
