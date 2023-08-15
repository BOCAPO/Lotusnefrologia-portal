'use client';

import { useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';

import { Button } from 'components/Button';
import { LitteText, SmallMediumText } from 'components/Text';

import styles from './modaloptions.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { deletePatient } from 'services/patients';
import { deleteSpecialist } from 'services/specialists';
import { deleteUnit } from 'services/units';
import { deleteUser } from 'services/users';

type Props = {
  message: string;
  show: boolean;
  onHide: () => void;
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
  const router = useRouter();

  async function deleteItem() {
    switch (typeItem) {
      case 'unit':
        await callDeleteUnit();
        break;
      case 'specialist':
        await callDeleteSpecialist();
        break;
      case 'patient':
        await callDeletePatient();
        break;
      case 'user':
        await callDeleteUser();
        break;
      default:
        break;
    }
    reset && reset(true);
    onHide();
  }

  async function goEdit() {
    switch (typeItem) {
      case 'unit':
        router.push(`edit/${JSON.parse(item).id}`);
        break;
      case 'specialist':
        router.push(`edit/${JSON.parse(item).id}`);
        break;
      case 'patient':
        router.push(`edit/${JSON.parse(item).id}`);
        break;
      case 'user':
        router.push(`edit/${JSON.parse(item).id}`);
        break;
      default:
        break;
    }
  }

  async function callDeleteUnit() {
    const response = await deleteUnit(JSON.parse(item).id);
    if (response !== null) {
      onHide();
    }
  }

  async function callDeleteSpecialist() {
    const response = await deleteSpecialist(JSON.parse(item).id);
    if (response !== null) {
      onHide();
    }
  }

  async function callDeletePatient() {
    const response = await deletePatient(JSON.parse(item).id);
    if (response !== null) {
      onHide();
    }
  }

  async function callDeleteUser() {
    const response = await deleteUser(JSON.parse(item).id);
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
              goEdit();
            }}
            title={Strings.edit}
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
        <div className={styles.footer}>
          <Button
            onClick={() => {
              onHide();
            }}
            title={Strings.cancel}
            type="cancel"
          />
        </div>
      </div>
    </Modal>
  );
}
