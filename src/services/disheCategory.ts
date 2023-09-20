import { getJson } from '../http';

export async function getDishesCategoryWithoutPagination() {
  return await getJson(`/dishes?page=false`);
}
