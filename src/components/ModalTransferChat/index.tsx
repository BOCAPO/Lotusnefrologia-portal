'use client';

import React from 'react';
import Modal from 'react-bootstrap/Modal';

import { Button } from 'components/Button';
import { SmallMediumText } from 'components/Text';

import styles from './modaltransferchat.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { transferChat } from 'services/chat';
import { rooms } from 'utils/enums';

type Props = {
  show: boolean;
  onHide: () => void;
  room_uuid: string;
  onClose: (action: boolean) => void;
};

export default function ModalTransferChat({
  room_uuid,
  onHide,
  onClose,
  ...props
}: Props) {
  const [room, setRoom] = React.useState<number>(0);

  async function handleTransferChat() {
    const response = await transferChat(room_uuid, room);
    if (response) {
      onClose && onClose(true);
      onHide();
    } else {
      alert('Erro ao transferir o chat');
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.headTransferChat}
      onHide={onHide}
    >
      <div className={styles.headerModalTransferChat}>
        <SmallMediumText
          text={Strings.messageSelectRoomToTransfer}
          bold={true}
          color={Colors.gray90}
          style={{ lineHeight: '1px' }}
        />
      </div>
      <Modal.Body className={styles.modalBodydTransferChat}>
        {rooms.map((item, index) => {
          return (
            <div key={index} className={styles.container}>
              <div className={styles.containerRadio}>
                <input
                  type="radio"
                  id={item.name}
                  name="transfer"
                  value={item.id}
                  className={styles.radio}
                  onClick={() => setRoom(item.id)}
                />
                <label htmlFor={item.name} className={styles.label}>
                  {item.name}
                </label>
              </div>
            </div>
          );
        })}
      </Modal.Body>
      <div className={styles.footer}>
        <Button
          onClick={() => {
            handleTransferChat();
          }}
          title={Strings.transfer}
          type="secondary"
        />
      </div>
    </Modal>
  );
}
