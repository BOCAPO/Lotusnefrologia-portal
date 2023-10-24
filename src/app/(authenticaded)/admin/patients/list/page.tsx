'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalOptions from 'components/ModalOptions';
import { Table } from 'components/Table';

import styles from './patientslist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { ResponseGetModel } from 'models/ResponseGetModel';
import {
  getAllPatients,
  getPatientsPerPage,
  getSearchedPatients
} from 'services/patients';

export default function PatientListPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [quantityPatients, setQuantityPatients] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(1);
  const [showModalOptions, setShowModalOptions] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  React.useEffect(() => {
    if (search === '') {
      getPatients();
    }
  }, [quantityPatients, page, search]);

  async function getPatients() {
    if (page === 1) {
      const response = await getAllPatients();
      const dataUpdated = response.data as ResponseGetModel;
      setData(dataUpdated);
      setQuantityPatients(dataUpdated.total);
    } else {
      const response = await getPatientsPerPage(page);
      const dataUpdated = response.data as ResponseGetModel;
      setData(dataUpdated);
      setQuantityPatients(dataUpdated.total);
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

  function updateQuantitySpecialists(status: boolean) {
    if (status) {
      setQuantityPatients(quantityPatients - 1);
    }
  }

  async function handleSearch(search: string, event?: any) {
    if (event) {
      event.preventDefault();
    }
    if (search === '') {
      getPatients();
    } else {
      setLoading(true);
      const response = await getSearchedPatients(search);
      const data = response.data as ResponseGetModel;
      setData(data);
      setQuantityPatients(data.total);
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyPatientList}>
        <div className={styles.headerPatientList}>
          <div className={styles.btnAddPatient}>
            <Button
              title={Strings.insertPatient}
              type="secondary"
              onClick={() => {
                router.push('/admin/patients/new');
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
        <div className={styles.tablePatientList}>
          <Table
            headers={Strings.headersPatient}
            headersResponse={Strings.headersPatientsResponse}
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
        typeItem="patient"
        reset={updateQuantitySpecialists}
      />
    </React.Fragment>
  );
}
