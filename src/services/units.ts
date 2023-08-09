import { getJson, postJson } from '../http';

import { DataUnitsModel } from 'models/DataUnitsModel';

export async function getAllUnits() {
  return await getJson('/units');
}

export async function createUnit(unit: DataUnitsModel) {
  return await postJson('/units', unit);
}
