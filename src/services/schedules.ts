import { getJson, postJson } from '../http';

import { NewScheduleModel } from 'models/NewScheduleModel';

export async function createSchedule(schedule: NewScheduleModel) {
  return await postJson('/schedules', schedule);
}

export async function getHoursBySpecialistAndDateAndUnit(
  specialistId: number,
  date: string,
  unitId: number
) {
  return await getJson(`/schedules/${specialistId}/${date}/${unitId}`);
}
