'use client';

import Modal from 'react-bootstrap/Modal';

import { Button } from 'components/Button';
import { LitteText, SmallMediumText } from 'components/Text';

import styles from './modaloptions.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { deleteUnit } from 'services/units';

type Props = {
  message: string;
  show: boolean;
  onHide: () => void;
  page: number;
  item: any;
  typeItem: string;
  reset?: (status: boolean) => void;
};

export default function ModalOptions({
  message,
  onHide,
  item,
  typeItem,
  reset,
  ...props
}: Props) {
  async function deleteItem() {
    switch (typeItem) {
      case 'unit':
        await callDeleteUnit();
        break;

      default:
        break;
    }
    reset && reset(true);
    onHide();
  }

  async function callDeleteUnit() {
    const response = await deleteUnit(JSON.parse(item).id);
    if (response !== null) {
      onHide();
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.headOptions}
    >
      <div className={styles.headerModalOptions}>
        <SmallMediumText
          text={Strings.confirmation}
          bold={true}
          color={Colors.gray90}
          style={{ lineHeight: '1px' }}
        />
      </div>
      <Modal.Body className={styles.modalBodydOptions}>
        <LitteText
          text={message}
          color={Colors.gray90}
          bold={false}
          style={{ lineHeight: '12px' }}
        />
      </Modal.Body>
      <div>
        <div className={styles.footer}>
          <Button
            onClick={() => {
              deleteItem();
            }}
            title={Strings.close}
            type="secondary"
          />
        </div>
        <div className={styles.footer}>
          <Button
            onClick={() => {
              deleteItem();
            }}
            title={Strings.erase}
            type="secondary"
          />
        </div>
      </div>
    </Modal>
  );
}
