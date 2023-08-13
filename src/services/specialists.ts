import { deleteJson, getJson } from '../http';

export async function getAllSpecialists() {
  return await getJson('/specialists');
}

export async function getSpecialistsPerPage(page: number) {
  return await getJson(`/specialists?page=${page}`);
}

export async function deleteSpecialist(id: number) {
  return await deleteJson(`/specialists/${id}`);
}
