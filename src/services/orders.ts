import { getJson, postJson } from '../http';

export async function getAllOrders() {
  return await getJson('/orders');
}

export async function getOrdersToday() {
  return await getJson(`/orders/today`);
}

export async function getOrdersById(id: number) {
  return await getJson(`/orders/${id}`);
}

export async function updateStatusOrder(id: number, status: number) {
  return await postJson(`/orders/change-status/${id}/${status}`, {});
}
