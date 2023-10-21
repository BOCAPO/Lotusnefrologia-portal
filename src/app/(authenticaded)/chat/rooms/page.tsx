'use client';

import React, { useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalError from 'components/ModalError';
import { LitteText, MediumText2 } from 'components/Text';

import styles from './rooms.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataMessagesModel } from 'models/DataMessagesModel';
import { DataPatientsModel } from 'models/DataPatientsModel';
import Pusher from 'pusher-js';
import { Prefs } from 'repository/Prefs';
import {
  closeRoom,
  getAttendRoom,
  postNewMessage,
  stayOnLine
} from 'services/chat';

export default function HomeChat(): JSX.Element {
  const [room, setRoom] = React.useState<string>('');
  const [rooms, setRooms] = React.useState(0);
  const [idRoom, setIdRoom] = React.useState(0);
  const [patient, setPatient] = React.useState<DataPatientsModel>();
  const [message, setMessage] = React.useState('');
  const [messageError, setMessageError] = React.useState('');
  const [showModalError, setShowModalError] = React.useState(false);
  const [messages, setMessages] = React.useState<
    Array<{ user: string; message: string }>
  >([
    {
      user: '',
      message: ''
    }
  ]);

  const [loading, setLoading] = React.useState(false);
  const [totalMessages, setTotalMessages] = React.useState(0);
  const messageEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    getNumberRooms();
  }, [rooms]);

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
      // allMessages.push(data);
      setTotalMessages(totalMessages + 1);
      setMessages((prev) => [...prev, data]);
    });

    const channel2 = pusher.subscribe('waiting');
    channel2.bind('message', function () {
      getNumberRooms();
    });

    return () => {
      pusher.unsubscribe(`${room}`);
    };
  }, []);

  useEffect(() => {
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

  async function attendRoom() {
    const response = await getAttendRoom();
    getNumberRooms();
    if (response) {
      setPatient(response.data.patient as DataPatientsModel);
      setRoom(response.data.room_uuid as string);
      setIdRoom(response.data.id as number);
    } else {
      setShowModalError(true);
      setMessageError(Strings.attendRoom);
      setPatient(undefined);
      setRoom('');
      setIdRoom(0);
    }
  }

  async function close() {
    const response = await closeRoom(idRoom);
    const pusher = new Pusher('9e4308afea9c772654a5', {
      cluster: 'sa1'
    });

    if (response) {
      pusher.unsubscribe(`${room}`);
      setRooms(rooms - 1);
      setPatient(undefined);
      setRoom('');
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
    if (response) {
      setMessage('');
      setTotalMessages(totalMessages + 1);
      setLoading(false);
    } else {
      setMessageError(Strings.sendMessageError);
      setShowModalError(true);
      setLoading(false);
    }
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
                  <div>
                    <Button
                      title={Strings.transfer}
                      type="cancel"
                      onClick={() => {}}
                    />
                  </div>
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
                          borderRadius: '10px 10px 0 10px',
                          marginBottom: '20px',
                          width: '60%',
                          padding: '3%',
                          marginTop: '20px',
                          backgroundColor:
                            message.user === Prefs.getNameUser()
                              ? '#A1E2A5'
                              : '#E5E5E5',
                          textAlign:
                            message.user === Prefs.getNameUser()
                              ? 'right'
                              : 'left',
                          display: message.message === '' ? 'none' : 'flex',
                          flexDirection: 'column',
                          alignItems:
                            message.user === Prefs.getNameUser()
                              ? 'flex-end'
                              : 'flex-start',
                          justifyContent:
                            message.user === Prefs.getNameUser()
                              ? 'flex-end'
                              : 'flex-start',
                          marginLeft:
                            message.user === Prefs.getNameUser() ? '40%' : '0%'
                        }}
                      >
                        <div>
                          <strong className="mb-1">{message.user}</strong>
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
