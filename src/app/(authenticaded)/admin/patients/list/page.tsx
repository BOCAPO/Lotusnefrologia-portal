'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { Table } from 'components/Table';

import styles from './patientslist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { getAllPatients, getPatientsPerPage } from 'services/patients';

export default function PatientListPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);

  React.useEffect(() => {
    getPatients();
  }, [data?.length, page]);

  async function getPatients() {
    if (page === 1) {
      const response = await getAllPatients();
      setData(response.data);
    } else {
      const response = await getPatientsPerPage(page);
      setData(response.data);
    }
    setLoading(false);
  }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

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
        <div className={styles.tablePatientList}>
          <Table
            headers={Strings.headersPatient}
            headersResponse={Strings.headersPatientsResponse}
            response={data}
            isLoading={loading}
            onClick={handleSelectionPage}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
