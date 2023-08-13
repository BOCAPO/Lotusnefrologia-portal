import { getJson } from '../http';

export async function getAllUsers() {
  return await getJson('/users');
}

export async function getUsersPerPage(page: number) {
  return await getJson(`/users?page=${page}`);
}
