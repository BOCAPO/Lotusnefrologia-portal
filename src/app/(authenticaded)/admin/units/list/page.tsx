'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { Table } from 'components/Table';

import styles from './unitslist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { getAllUnits, getUnitsPerPage } from 'services/units';

export default function ListUnitsPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);

  React.useEffect(() => {
    getUnits();
  }, [data?.length, page]);

  async function getUnits() {
    if (page === 1) {
      const response = await getAllUnits();
      setData(response.data);
    } else {
      const response = await getUnitsPerPage(page);
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
          />
        </div>
      </div>
    </React.Fragment>
  );
}
