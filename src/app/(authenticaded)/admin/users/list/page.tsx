'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { Table } from 'components/Table';

import styles from './userslist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import dataUsers from 'tests/mocks/dataUsers'; //mock de teste de dados

export default function UsersListPage() {
  const router = useRouter();

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyUsersList}>
        <div className={styles.headerUsersList}>
          <div className={styles.btnAddUser}>
            <Button
              title={Strings.insertUser}
              type="secondary"
              onClick={() => {
                router.push('/admin/users/new');
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
        <div className={styles.tableUsersList}>
          <Table headers={Strings.headersUsers} data={dataUsers} />
        </div>
      </div>
    </React.Fragment>
  );
}
