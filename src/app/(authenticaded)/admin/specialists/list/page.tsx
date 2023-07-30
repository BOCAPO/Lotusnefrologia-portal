'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { Table } from 'components/Table';

import styles from './specialistlist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import dataSpecialist from 'tests/mocks/dataSpecialist'; //mock de teste de dados

export default function SpecialistListPage() {
  const router = useRouter();

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodySpecialistList}>
        <div className={styles.headerSpecialistList}>
          <div className={styles.btnAddSpecialist}>
            <Button
              title={Strings.insertSpecialist}
              type="secondary"
              onClick={() => {
                router.push('/admin/specialists/new');
              }}
            />
          </div>
          <div className={styles.searchBar}>
            <input type="search" placeholder={Strings.search} />
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
        <div className={styles.tableSpecialistList}>
          <Table headers={Strings.headersSpecialist} data={dataSpecialist} />
        </div>
      </div>
    </React.Fragment>
  );
}
