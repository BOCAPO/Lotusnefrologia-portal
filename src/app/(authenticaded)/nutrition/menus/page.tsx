'use client';

import React from 'react';

import { Button } from 'components/Button';
import { MenuTop } from 'components/MenuTop';

import styles from './menusnew.module.css';

export default function NewMenuPage(): JSX.Element {
  return (
    <React.Fragment>
      <MenuTop />
      <div>
        <div className={styles.bodyFormFirstColumn}>
          <p>Período</p>

          <div className="d-flex flex-column">
            <p>Organizar por</p>
            <div className="d-flex flex-row">
              <Button
                title="Semanal"
                type="secondary"
                onClick={() => {}}
                style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
              />
              <Button
                title="Diário"
                type="secondary"
                onClick={() => {}}
                style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
              />
            </div>
          </div>
        </div>
        <div className={styles.bodyFormSecondColumn}></div>
      </div>
    </React.Fragment>
  );
}
