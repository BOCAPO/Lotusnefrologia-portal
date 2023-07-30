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
import dataUnits from 'tests/mocks/dataUnits'; //mock de teste de dados

export default function ListUnitsPage() {
  //   const { data, isLoading } = useGetUnits();
  const router = useRouter();
  //   if (isLoading) return <Loading />;

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyUnitsList}>
        <div className={styles.headerUnitsList}>
          <div className={styles.btnAddUnit}>
            <Button
              title="Cadastrar Unidade"
              type="secondary"
              onClick={() => {
                router.push('/admin/units/new');
              }}
            />
          </div>
          <div className={styles.searchBar}>
            <input type="search" placeholder="Pesquisar" />
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
          <Table headers={Strings.headersUnits} data={dataUnits} />
        </div>
      </div>
    </React.Fragment>
  );
}
