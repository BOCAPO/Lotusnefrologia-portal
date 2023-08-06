import Spinner from 'react-bootstrap/Spinner';

import styles from './spinner.module.css';

export function SpinnerLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Spinner
        animation="border"
        role="status"
        className={styles.customSpinner}
      >
        <span className="visually-hidden">Carregando...</span>
      </Spinner>
    </div>
  );
}
