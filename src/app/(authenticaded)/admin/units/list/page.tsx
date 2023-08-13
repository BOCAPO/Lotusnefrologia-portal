'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalOptions from 'components/ModalOptions';
import { Table } from 'components/Table';

import styles from './unitslist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { getAllUnits, getUnitsPerPage } from 'services/units';

export default function ListUnitsPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [quantityUnits, setQuantityUnits] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);
  const [showModalOptions, setShowModalOptions] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  React.useEffect(() => {
    getUnits();
  }, [quantityUnits, page]);

  async function getUnits() {
    if (page === 1) {
      const response = await getAllUnits();
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityUnits(data.total);
    } else {
      const response = await getUnitsPerPage(page);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityUnits(data.total);
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
      setQuantityUnits(quantityUnits - 1);
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyUnitsList}>
        <div className={styles.headerUnitsList}>
          <div className={styles.btnAddUnit}>
            <Button
              title={Strings.insertUnit}
              type="secondary"
              onClick={() => {
                router.push('/admin/units/new');
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
        <div className={styles.tableUnitsList}>
          <Table
            headers={Strings.headersUnits}
            headersResponse={Strings.headersUnitsResponse}
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
        typeItem="unit"
        page={page}
        reset={updateQuantityUnits}
      />
    </React.Fragment>
  );
}
