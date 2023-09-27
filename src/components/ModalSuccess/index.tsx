import Modal from 'react-bootstrap/Modal';

import { Button } from 'components/Button';
import { LitteText, SmallMediumText } from 'components/Text';

import styles from './modalsuccess.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

type Props = {
  message: string;
  show: boolean;
  onHide: () => void;
};

export default function ModalSuccess({ message, onHide, ...props }: Props) {
  function goBack() {
    onHide();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.headSuccess}
      onHide={onHide}
    >
      <div className={styles.headerModalSuccess}>
        <SmallMediumText
          text={Strings.confirmation}
          bold={true}
          color={Colors.gray90}
          style={{ lineHeight: '1px' }}
        />
      </div>
      <Modal.Body className={styles.modalBodydSuccess}>
        <LitteText
          text={message}
          color={Colors.gray90}
          bold={false}
          style={{ lineHeight: '12px' }}
        />
      </Modal.Body>
      <div className={styles.footer}>
        <Button
          onClick={() => {
            goBack();
          }}
          title={Strings.close}
          type="secondary"
        />
      </div>
    </Modal>
  );
}
