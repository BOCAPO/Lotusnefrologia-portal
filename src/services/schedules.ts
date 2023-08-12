import { postJson } from '../http';

import { NewScheduleModel } from 'models/NewScheduleModel';

export async function createSchedule(schedule: NewScheduleModel) {
  return await postJson('/schedules', schedule);
}
