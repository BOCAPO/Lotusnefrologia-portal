'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalOptions from 'components/ModalOptions';
import { Table } from 'components/Table';

import styles from './userslist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { getAllUsers, getUsersPerPage } from 'services/users';

export default function UsersListPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [quantityUsers, setQuantityUsers] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);
  const [showModalOptions, setShowModalOptions] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  React.useEffect(() => {
    getUsers();
  }, [quantityUsers, page]);

  async function getUsers() {
    if (page === 1) {
      const response = await getAllUsers();
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityUsers(data.total);
    } else {
      const response = await getUsersPerPage(page);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityUsers(data.total);
    }
    setLoading(false);
  }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  function handleItemSelection(item: any) {
    setSelectedItem(item);
    setShowModalOptions(true);
  }

  function updateQuantityUnits(status: boolean) {
    if (status) {
      setQuantityUsers(quantityUsers - 1);
    }
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
            onItemClick={handleItemSelection}
            onClick={handleSelectionPage}
          />
        </div>
      </div>
      <ModalOptions
        message={Strings.whatDoYouWantToDo}
        show={
          showModalOptions &&
          selectedItem !== null &&
          selectedItem !== undefined
        }
        onHide={() => {
          setShowModalOptions(false);
        }}
        item={selectedItem}
        typeItem="user"
        reset={updateQuantityUnits}
      />
    </React.Fragment>
  );
}
