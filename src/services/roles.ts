import { getJson } from '../http';

export async function getAllRoles() {
  return await getJson('/roles');
}

export async function getRolesPerPage(page: number) {
  return await getJson(`/roles?page=${page}`);
}
