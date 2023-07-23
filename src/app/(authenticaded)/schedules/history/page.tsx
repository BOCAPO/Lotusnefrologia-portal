'use client';

import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { Table } from 'components/Table';

import styles from './page.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

export default function SchedulesPage() {
  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyHistory}>
        <div className={styles.headerHistory}>
          <Button
            title="Realizar Agendamento"
            type="secondary"
            onClick={() => {}}
          />
          <div className={styles.searchBar}>
            <input type="search" placeholder="Pesquisar" />
            <div className={styles.iconSearch}>
              <Icon
                typeIcon={TypeIcon.Search}
                size={20}
                color={Colors.gray60}
                callback={() => {}}
              />
            </div>
          </div>
        </div>
        <div className={styles.tableHistory}>
          <Table headers={Strings.headersHistory} data={null} />
        </div>
      </div>
    </React.Fragment>
  );
}
