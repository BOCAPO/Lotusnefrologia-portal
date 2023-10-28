import { getJson, postJson } from '../http';

import { DataMessagesModel } from 'models/DataMessagesModel';

export async function stayOnLine() {
  return await getJson('/chat/waitlist');
}

export async function getAllRoomsWithoutPagination() {
  return await getJson('/chat-rooms?page=false');
}

export async function getAttendRoom() {
  return await getJson('chat/answer');
}

export async function postNewMessage(data: DataMessagesModel) {
  return await postJson('/message/send', data);
}

export async function closeRoom(idRoom: number) {
  return await getJson(`/chat/finish/${idRoom}`);
}

export async function authPusher() {
  return await postJson('/chat/auth', {});
}

export async function getHistoryMessages(idRoom: string) {
  return await getJson(`/chat/messages/${idRoom}`);
}

export async function getOpenedRooms() {
  return await getJson('/chat/opened-rooms');
}

export async function getHistory() {
  return await getJson('/chat');
}

export async function getHistoryPerPage(page: number) {
  return await getJson(`/chat?page=${page}`);
}

export async function getHistoryWithoutPagination() {
  return await getJson('/chat?page=false');
}

export async function getSearchedHistory(search: string) {
  return await getJson(`/chat?search=${search}`);
}
