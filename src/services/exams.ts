import { getJson } from '../http';

export async function getAllExams() {
  return await getJson('/exams');
}

export async function getExamsPerPage(page: number) {
  return await getJson(`/exams?page=${page}`);
}
