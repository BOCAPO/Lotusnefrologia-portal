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
