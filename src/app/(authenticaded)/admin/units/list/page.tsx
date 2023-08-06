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
import { getAllUnits } from 'services/units';

export default function ListUnitsPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    getUnits();
  }, [data?.length]);

  async function getUnits() {
    const response = await getAllUnits();
    console.log(response.data);
    setData(response.data);
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyUnitsList}>
        <div className={styles.headerUnitsList}>
          <div className={styles.btnAddUnit}>
            <Button
              title={Strings.inserUnit}
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
          />
        </div>
      </div>
    </React.Fragment>
  );
}
