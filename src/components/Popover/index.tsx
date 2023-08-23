import Popover from 'react-bootstrap/Popover';

import styles from './popover.module.css';

export function PopoverComponent() {
  return (
    <Popover id="popover-basic" className={styles.popoverBasic}>
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        <div></div>
      </Popover.Body>
    </Popover>
  );
}
