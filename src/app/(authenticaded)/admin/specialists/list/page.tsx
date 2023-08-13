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
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { getAllSpecialists, getSpecialistsPerPage } from 'services/specialists';

export default function SpecialistListPage() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);

  React.useEffect(() => {
    getSpecialist();
  }, [page]);

  async function getSpecialist() {
    let response: any;
    if (page === 1) {
      response = await getAllSpecialists();
    } else {
      response = await getSpecialistsPerPage(page);
    }
    setLoading(true);
    const dataUpdated = response.data.data as ResponseGetModel[];
    let specialties: string[] = [];
    dataUpdated.map((element: any) => {
      element.specialties.map((specialty: DataSpecialtiesModel) => {
        specialties.push(specialty.description);
      });
      element.specialties = specialties.join(' | ');
      specialties = [];
    });
    response.data.data = dataUpdated;
    setData(response.data);
    setLoading(false);
  }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

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
            onClick={handleSelectionPage}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
