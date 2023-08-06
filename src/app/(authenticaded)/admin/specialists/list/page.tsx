'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { Table } from 'components/Table';

import styles from './specialistlist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { getAllSpecialists } from 'services/specialists';

export default function SpecialistListPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getSpecialist();
  }, []);

  async function getSpecialist() {
    const response = await getAllSpecialists();
    setData(response.data);
    setLoading(false);
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
        <div className={styles.tableSpecialistList}>
          <Table
            headers={Strings.headersSpecialist}
            headersResponse={Strings.headersSpecialistResponse}
            response={data}
            isLoading={loading}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
