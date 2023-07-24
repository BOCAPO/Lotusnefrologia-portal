'use client';

import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { Table } from 'components/Table';

import styles from './page.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import dataHIstory from 'tests/mocks/dataHistory'; //mock de teste de dados

export default function SchedulesPage() {
  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyHistory}>
        <div className={styles.headerHistory}>
          <div className={styles.btnAddSchedule}>
            <Button
              title="Realizar Agendamento"
              type="secondary"
              onClick={() => {}}
            />
          </div>
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
          <Table headers={Strings.headersHistory} data={dataHIstory} />
        </div>
      </div>
    </React.Fragment>
  );
}