'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalOptions from 'components/ModalOptions';
import { Table } from 'components/Table';

import styles from './specialistlist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import {
  getAllSpecialists,
  getSearchedSpecialists,
  getSpecialistsPerPage
} from 'services/specialists';

export default function SpecialistListPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [quantitySpecialists, setQuantitySpecialists] =
    React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(1);
  const [showModalOptions, setShowModalOptions] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  React.useEffect(() => {
    if (search === '') {
      getSpecialist();
    }
  }, [quantitySpecialists, page, search]);

  async function getSpecialist() {
    let response: any;
    if (page === 1) {
      response = await getAllSpecialists();
    } else {
      response = await getSpecialistsPerPage(page);
    }
    setLoading(true);
    const dataUpdated = response.data.data as ResponseGetModel[];
    setQuantitySpecialists(response.data.total);
    let specialties: string[] = [];
    dataUpdated.map((element: any) => {
      element.specialties.map((specialty: DataSpecialtiesModel) => {
        specialties.push(specialty.description);
      });
      element.specialties = specialties.join(' | ');
      specialties = [];
    });
    setData(response.data);
    setLoading(false);
  }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  function handleItemSelection(item: any) {
    setSelectedItem(item);
    setShowModalOptions(true);
  }

  function updateQuantitySpecialists(status: boolean) {
    if (status) {
      setQuantitySpecialists(quantitySpecialists - 1);
    }
  }

  async function handleSearch(search: string, event?: any) {
    if (event) {
      event.preventDefault();
    }
    if (search === '') {
      getSpecialist();
    } else {
      setLoading(true);
      const response = await getSearchedSpecialists(search);
      const dataUpdated = response.data.data as ResponseGetModel[];
      setQuantitySpecialists(response.data.total as number);
      let specialties: string[] = [];
      dataUpdated.map((element: any) => {
        element.specialties.map((specialty: DataSpecialtiesModel) => {
          specialties.push(specialty.description);
        });
        element.specialties = specialties.join(' | ');
        specialties = [];
      });
      setData(response.data);
      setQuantitySpecialists(data.total);
      setLoading(false);
    }
  }

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
        <div className={styles.tableSpecialistList}>
          <Table
            headers={Strings.headersSpecialist}
            headersResponse={Strings.headersSpecialistResponse}
            response={data}
            isLoading={loading}
            onClick={handleSelectionPage}
            onItemClick={handleItemSelection}
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
        typeItem="specialist"
        reset={updateQuantitySpecialists}
      />
    </React.Fragment>
  );
}
