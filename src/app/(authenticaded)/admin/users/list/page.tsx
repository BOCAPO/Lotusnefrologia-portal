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
import { getAllUsers, getSearchedUsers, getUsersPerPage } from 'services/users';

export default function UsersListPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [quantityUsers, setQuantityUsers] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(1);
  const [showModalOptions, setShowModalOptions] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  React.useEffect(() => {
    if (search === '') {
      getUsers();
    }
  }, [quantityUsers, page, search]);

  async function getUsers() {
    if (page === 1) {
      const response = await getAllUsers();
      const data = response.data as ResponseGetModel;
      data.data = data.data.sort((a: any, b: any) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      });

      setData(data);
      setQuantityUsers(data.total);
    } else {
      const response = await getUsersPerPage(page);
      const data = response.data as ResponseGetModel;
      data.data = data.data.sort((a: any, b: any) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      });

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

  async function handleSearch(search: string, event?: any) {
    if (event) {
      event.preventDefault();
    }
    if (search === '') {
      getUsers();
    } else {
      setLoading(true);
      const response = await getSearchedUsers(search);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityUsers(data.total);
      setLoading(false);
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
            <input
              type="search"
              placeholder={Strings.search}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSearch(search, event);
                }
              }}
            />
            <div className={styles.iconSearch}>
              <Icon
                typeIcon={TypeIcon.Search}
                size={20}
                color={Colors.gray60}
                callback={() => {
                  handleSearch(search);
                }}
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
