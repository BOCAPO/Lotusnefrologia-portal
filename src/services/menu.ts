import { getJson, postJson } from '../http';

import { DataMenuModel } from 'models/DataMenuModel';

export async function getAllMenus() {
  return await getJson('/menu');
}

export async function getMenuPerPage(page: number) {
  return await getJson(`/menu?page=${page}`);
}

export async function getMenuByDay(day: string) {
  return await getJson(`/menu/day/${day}`);
}

export async function getMenuById(id: number) {
  return await getJson(`/menu/${id}`);
}

export async function createMenu(menu: DataMenuModel) {
  return await postJson(`/menu`, menu);
}

export async function getSearchMenu(search: string) {
  return await getJson(`/menu?search=${search}`);
}
