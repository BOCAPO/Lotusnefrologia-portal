import { deleteJson, getJson, postJson, putJson } from '../http';

import { DataDishesModel } from 'models/DataDishesModel';

export async function getAllDishes() {
  return await getJson('/dishes');
}

export async function getDishesWithoutPagination() {
  return await getJson('/dishes?page=false');
}

export async function getDishesPerPage(page: number) {
  return await getJson(`/dishes?page=${page}`);
}

export async function getDishesByUnit(unit: number) {
  return await getJson(`/dishes/by-unit/${unit}`);
}

export async function createDishe(data: DataDishesModel) {
  return await postJson('/dishes', data);
}

export async function updateDishe(id: number, data: DataDishesModel) {
  return await putJson(`/dishes/${id}`, data);
}

export async function deleteDishe(id: number) {
  return await deleteJson(`/dishes/${id}`);
}
