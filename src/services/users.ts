import { deleteJson, getJson, postJson, putJson } from '../http';

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

export async function deleteUser(id: number) {
  return await deleteJson(`/users/${id}`);
}

export async function updateUserById(id: number, user: DataUserModel) {
  return await putJson(`/users/${id}`, user);
}

export async function getSearchedUsers(search: string) {
  return await getJson(`/users?search=${search}`);
}
