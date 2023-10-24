'use client';

import React from 'react';
import { Spinner } from 'react-bootstrap';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalError from 'components/ModalError';
import ModalSuccess from 'components/ModalSuccess';
import { LitteText, MediumText2, SmallMediumText } from 'components/Text';

import styles from './rooms.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataChatsModel } from 'models/DataChatsModel';
import { DataMessagesModel } from 'models/DataMessagesModel';
import { DataPatientsModel } from 'models/DataPatientsModel';
import Pusher from 'pusher-js';
import { Prefs } from 'repository/Prefs';
import {
  closeRoom,
  getAttendRoom,
  getOpenedRooms,
  postNewMessage,
  stayOnLine
} from 'services/chat';

export default function HomeChat(): JSX.Element {
  const [room, setRoom] = React.useState<string>('');
  const [rooms, setRooms] = React.useState(0);
  const [roomsOpen, setRoomsOpen] = React.useState([] as DataChatsModel[]);
  const [totalRoomsOpen, setTotalRoomsOpen] = React.useState(0);
  const [idRoom, setIdRoom] = React.useState(0);
  const [patient, setPatient] = React.useState<DataPatientsModel>();
  const [message, setMessage] = React.useState('');
  const [messageSuccess, setMessageSuccess] = React.useState('');
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const [messageError, setMessageError] = React.useState('');
  const [showModalError, setShowModalError] = React.useState(false);
  const [messages, setMessages] = React.useState<
    Array<{ user: string; message: string; sender_type: string | null }>
  >([
    {
      user: '',
      message: '',
      sender_type: ''
    }
  ]);

  const [loading, setLoading] = React.useState(false);
  const [totalMessages, setTotalMessages] = React.useState(0);
  const messageEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    getNumberRooms();
    getRoomsOpen();
  }, [rooms, totalRoomsOpen]);

  React.useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher('9e4308afea9c772654a5', {
      cluster: 'sa1'
      // channelAuthorization: {
      //   endpoint: 'http://lotus.1boaideia.com.br/api/chat/auth',
      //   transport: 'jsonp'
      //   // headers: {
      //   //   Authorization: `${token}`
      //   // }
      // }
    });

    const channel = pusher.subscribe(`${room}`);
    channel.bind('message', function (data: any) {
      setTotalMessages(totalMessages + 1);
      const allMessages = messages;
      allMessages.push({
        user: data.user,
        message: data.message,
        sender_type: data.sender_type
      });
      setMessages(allMessages);
    });

    const channel2 = pusher.subscribe('waiting');
    channel2.bind('message', function () {
      getNumberRooms();
    });

    return () => {
      pusher.unsubscribe(`${room}`);
    };
  }, [totalMessages]);

  React.useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher('9e4308afea9c772654a5', {
      cluster: 'sa1'
    });
    const channelsListened: any[] = [];
    roomsOpen.map((room) => {
      channelsListened.push(room.room_uuid);
    });
    channelsListened.map((channel) => {
      const channel2 = pusher.subscribe(`${channel}`);
      channel2.bind('message', function () {
        getRoomsOpen();
      });
    });
  }, [totalMessages]);

  React.useEffect(() => {
    scrollToBottom();
  }, [totalMessages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function getNumberRooms() {
    const response = await stayOnLine();
    if (response) {
      setRooms(response.data as unknown as number);
    }
  }

  async function getRoomsOpen() {
    const response = await getOpenedRooms();
    if (response) {
      setRoomsOpen(response.data as unknown as DataChatsModel[]);
      setTotalRoomsOpen(response.data.length as number);
    }
  }

  async function attendRoom() {
    const response = await getAttendRoom();
    getNumberRooms();
    if (response) {
      setPatient(response.data.patient as DataPatientsModel);
      setRoom(response.data.room_uuid as string);
      setIdRoom(response.data.id as number);
      setTotalRoomsOpen(totalRoomsOpen + 1);
      setMessages(
        response.data.messages as unknown as Array<{
          user: string;
          message: string;
          sender_type: string | null;
        }>
      );
    } else {
      setPatient(undefined);
      setRoom('');
      setIdRoom(0);
      setShowModalError(true);
      setMessageError(Strings.attendRoom);
      setTimeout(() => {
        setShowModalError(false);
      }, 2500);
    }
  }

  async function close() {
    const response = await closeRoom(idRoom);
    const pusher = new Pusher('9e4308afea9c772654a5', {
      cluster: 'sa1'
    });

    if (response) {
      pusher.unsubscribe(`${room}`);
      setRooms(rooms);
      setPatient(undefined);
      setRoom('');
      setTotalRoomsOpen(totalRoomsOpen - 1);
      setMessages([]);
      setMessage('');
      setMessageSuccess(Strings.successCloseRoom);
      setShowModalSuccess(true);
      setTimeout(() => {
        setShowModalSuccess(false);
      }, 2500);
    }
  }

  async function sendMessage(e: any) {
    e.preventDefault();
    setLoading(true);
    const newMessage = {
      room: room,
      message: message
    } as DataMessagesModel;

    const response = await postNewMessage(newMessage);
    setTotalMessages(totalMessages + 1);
    if (response !== undefined && response !== null) {
      setLoading(false);
      setMessage('');
    } else {
      setMessageError(Strings.sendMessageError);
      setShowModalError(true);
      setLoading(false);
    }
  }

  async function returnRoom(roomId: number) {
    const selectedRoom = roomsOpen.filter((room) => {
      if (room.id === roomId) {
        return room;
      } else {
        return null;
      }
    });

    setPatient(selectedRoom[0].patient as DataPatientsModel);
    setRoom(selectedRoom[0].room_uuid as string);
    setIdRoom(selectedRoom[0].id as number);
    setMessages(
      selectedRoom[0].messages as unknown as Array<{
        user: string;
        message: string;
        sender_type: string | null;
      }>
    );
    setTotalMessages(selectedRoom[0].messages.length as number);
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className="d-flex justify-content-center">
        <div className={styles.bodyFormFirstColumn}>
          <div className={styles.headerAwaitList}>
            <div className="d-flex align-items-center justify-content-center">
              <p style={{ margin: 0 }} className={styles.numberRoomsAwaiting}>
                {rooms}
              </p>
            </div>
            <div className={styles.requestsAwaiting}>
              <MediumText2
                text={Strings.requestsAwaiting}
                color={Colors.gray90}
                bold={true}
                style={{ lineHeight: '30px', margin: '0px' }}
              />
            </div>
            <div>
              <Button
                title={Strings.toMeet}
                type="onLine"
                onClick={() => {
                  attendRoom();
                }}
              />
            </div>
          </div>
          <div
            className="list-group-item list-group-item-action lh-tight"
            style={{
              overflowY: 'auto'
            }}
          >
            <ul style={{ padding: 0 }}>
              {roomsOpen.map &&
                roomsOpen.map((room, index) => {
                  return (
                    <li key={index} className="list-group-item">
                      <div
                        className={styles.boxRoomOpen}
                        onClick={() => {
                          returnRoom(room.id);
                        }}
                      >
                        <div>
                          <SmallMediumText
                            text={room.patient.name}
                            color={Colors.gray90}
                            bold={true}
                            style={{ lineHeight: '30px', margin: '0px' }}
                          />
                        </div>
                        <div>
                          <LitteText
                            text={
                              (room.messages?.length > 0
                                ? room.messages[room.messages.length - 1]
                                    ?.message
                                : ''
                              )?.substring(0, 200) +
                              ((room.messages?.length > 0
                                ? room.messages[room.messages.length - 1]
                                    ?.message
                                : ''
                              )?.length > 200
                                ? '...'
                                : '')
                            }
                            color={Colors.gray60}
                            bold={false}
                            style={{ lineHeight: '30px', margin: '0px' }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className={styles.bodyFormSecondColumn}>
          {patient && (
            <React.Fragment>
              <div className={styles.headerChat}>
                <div>
                  <MediumText2
                    text={patient !== undefined ? patient?.name : ''}
                    color={Colors.gray90}
                    bold={true}
                    style={{ lineHeight: '50px', margin: '0px' }}
                  />
                  <LitteText
                    text={Strings.online}
                    color={Colors.gray90}
                    bold={true}
                    style={{ lineHeight: '3px', margin: '0px' }}
                  />
                </div>
                <div className={styles.btnsChat}>
                  {/* <div>
                    <Button
                      title={Strings.transfer}
                      type="cancel"
                      onClick={() => {}}
                    />
                  </div> */}
                  <div>
                    <Button
                      title={Strings.finally}
                      type="onLine"
                      onClick={() => {
                        close();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.messagesChat}>
                {messages !== null && messages.length > 0 ? (
                  messages.map((message, index) => {
                    return (
                      <div
                        key={index}
                        className="list-group-item list-group-item-action py-3 lh-tight message"
                        style={{
                          borderRadius:
                            message.user === Prefs.getNameUser() ||
                            message.sender_type === 'System' ||
                            message.sender_type === 'Attendant'
                              ? '10px 10px 0 10px'
                              : '10px 10px 10px 0',
                          marginBottom: '20px',
                          width: '60%',
                          padding: '3%',
                          marginTop: '20px',
                          backgroundColor:
                            message.user === Prefs.getNameUser() ||
                            message.sender_type === 'System' ||
                            message.sender_type === 'Attendant'
                              ? '#A1E2A5'
                              : '#E5E5E5',
                          textAlign:
                            message.user === Prefs.getNameUser() ||
                            message.sender_type === 'System' ||
                            message.sender_type === 'Attendant'
                              ? 'right'
                              : 'left',
                          display: message.message === '' ? 'none' : 'flex',
                          flexDirection: 'column',
                          alignItems:
                            message.user === Prefs.getNameUser() ||
                            message.sender_type === 'System' ||
                            message.sender_type === 'Attendant'
                              ? 'flex-end'
                              : 'flex-start',
                          justifyContent:
                            message.user === Prefs.getNameUser() ||
                            message.sender_type === 'System' ||
                            message.sender_type === 'Attendant'
                              ? 'flex-end'
                              : 'flex-start',
                          marginLeft:
                            message.user === Prefs.getNameUser() ||
                            message.sender_type === 'System' ||
                            message.sender_type === 'Attendant'
                              ? '40%'
                              : '0%'
                        }}
                      >
                        <div>
                          <strong className="mb-1">
                            {message.user !== '' &&
                            message.user !== null &&
                            message.user !== undefined
                              ? message.user
                              : message.sender_type === 'Patient'
                              ? patient.name
                              : Prefs.getNameUser()}
                          </strong>
                        </div>
                        <div className="col-10 mb-1 small">
                          {message.message}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noMessages}>
                    <p>{Strings.noMessages}</p>
                  </div>
                )}
                <div ref={messageEndRef}></div>
              </div>
              <div className={styles.formMessage}>
                <form onSubmit={sendMessage}>
                  <input
                    placeholder={Strings.writeMessage}
                    type="text"
                    value={message}
                    disabled={loading}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </form>
                <button
                  type="submit"
                  onClick={(e) => {
                    sendMessage(e);
                  }}
                >
                  {!loading ? (
                    <Icon
                      typeIcon={TypeIcon.Send}
                      size={32}
                      color={Colors.greenLight2}
                    />
                  ) : (
                    <Spinner
                      animation="border"
                      role="status"
                      style={{ color: '#A1E2A5' }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      <ModalSuccess
        message={messageSuccess}
        show={showModalSuccess}
        onHide={() => {
          setShowModalSuccess(false);
        }}
      />
      <ModalError
        message={messageError}
        show={showModalError}
        onHide={() => {
          setShowModalError(false);
        }}
      />
    </React.Fragment>
  );
}
