import { getJson } from '../http';

export async function getExamsTypesWithoutPagination() {
  return await getJson('/exam-types?page=false');
}
