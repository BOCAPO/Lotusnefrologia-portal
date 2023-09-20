import { deleteJson, getJson, postJson } from '../http';

import { DataDishesModel } from 'models/DataDishesModel';

export async function getAllDishes() {
  return await getJson('/dishes');
}

export async function getDishesPerPage(page: number) {
  return await getJson(`/dishes?page=${page}`);
}

export async function createDishe(data: DataDishesModel) {
  return await postJson('/dishes', data);
}

export async function deleteDishe(id: number) {
  return await deleteJson(`/dishes/${id}`);
}
