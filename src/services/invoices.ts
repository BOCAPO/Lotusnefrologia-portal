import { deleteJson, getJson, postJson, putJson } from '../http';

import { DataInvoicesModel } from 'models/DataInvoicesModel';

export async function getAllInvoices() {
  return await getJson('/invoices');
}

export async function getAllInvoicesWithoutPagination() {
  return await getJson('/invoices?page=false');
}

export async function getInvoicesPerPage(page: number) {
  return await getJson(`/invoices?page=${page}`);
}

export async function createInvoice(invoice: DataInvoicesModel) {
  return await postJson('/invoices', invoice);
}

export async function deleteInvoice(id: number) {
  return await deleteJson(`/invoices/${id}`);
}

export async function getInvoicesById(id: number) {
  return await getJson(`/invoices/${id}`);
}

export async function updateInvoiceById(
  id: number,
  invoice: DataInvoicesModel
) {
  return await putJson(`/invoices/${id}`, invoice);
}
