import { getJson, postJson } from '../http';

import { DataUserModel } from 'models/DataUserModel';

export async function getAllUsers() {
  return await getJson('/users');
}

export async function getUsersPerPage(page: number) {
  return await getJson(`/users?page=${page}`);
}

export async function getUserById(id: number) {
  return await getJson(`/users/${id}`);
}

export async function createUser(user: DataUserModel) {
  return await postJson(`/users`, user);
}
