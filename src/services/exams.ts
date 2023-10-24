import { getJson, postJson } from '../http';

import { DataExamsModel } from 'models/DataExamsModel';

export async function getAllExams() {
  return await getJson('/exams');
}

export async function getExamsPerPage(page: number) {
  return await getJson(`/exams?page=${page}`);
}

export async function createExam(data: DataExamsModel) {
  return await postJson('/exams', data);
}

export async function getSearchExams(search: string) {
  return await getJson(`/exams?search=${search}`);
}
