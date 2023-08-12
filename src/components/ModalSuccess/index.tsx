import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  function goBack() {
    onHide();
    router.back();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.headSuccess}
    >
      <div className={styles.headerModalSuccess}>
        <SmallMediumText
          text={Strings.confirmation}
          bold={true}
          color={Colors.gray90}
          style={{ lineHeight: 0 }}
        />
      </div>
      <Modal.Body className={styles.modalSuccess}>
        <LitteText text={message} color={Colors.gray90} bold={false} />
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