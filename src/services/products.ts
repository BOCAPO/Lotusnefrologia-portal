import { deleteJson, getJson, postJson, putJson } from '../http';

import { DataProductsModel } from 'models/DataProductsModel';

export async function getAllProducts() {
  return await getJson('/products');
}

export async function getProductsPerPage(page: number) {
  return await getJson(`/products?page=${page}`);
}

export async function getProductsWithoutPagination() {
  return await getJson('/products?page=false');
}

export async function getProductsById(id: number) {
  return await getJson(`/products/${id}`);
}

export async function createProduct(product: DataProductsModel) {
  return await postJson('/products', product);
}

export async function updateProduct(product: DataProductsModel, id: number) {
  return await putJson(`/products/${id}`, product);
}

export async function deleteProduct(id: number) {
  return await deleteJson(`/products/${id}`);
}
