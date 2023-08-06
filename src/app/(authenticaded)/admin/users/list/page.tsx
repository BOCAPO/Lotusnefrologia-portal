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
import { getAllUsers } from 'services/users';
import dataUsers from 'tests/mocks/dataUsers'; //mock de teste de dados

export default function UsersListPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getUsers();
  }, [dataUsers?.length]);

  async function getUsers() {
    const response = await getAllUsers();
    setData(response.data);
    setLoading(false);
  }

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
          <Table
            headers={Strings.headersUsers}
            response={data}
            headersResponse={Strings.headersUsersResponse}
            isLoading={loading}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
