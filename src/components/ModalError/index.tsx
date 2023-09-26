import Modal from 'react-bootstrap/Modal';

import { Button } from 'components/Button';
import { LitteText, SmallMediumText } from 'components/Text';

import styles from './modalerror.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

type Props = {
  message: string;
  show: boolean;
  onHide: () => void;
};

export default function ModalError({ message, onHide, ...props }: Props) {
  function goBack() {
    onHide();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.headError}
    >
      <div className={styles.headerModalError}>
        <SmallMediumText
          text={Strings.titleError}
          bold={true}
          color={Colors.gray90}
          style={{ lineHeight: '1px' }}
        />
      </div>
      <Modal.Body className={styles.modalBodydError}>
        <LitteText
          text={message}
          color={Colors.redInvalid}
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
          type="danger"
        />
      </div>
    </Modal>
  );
}
