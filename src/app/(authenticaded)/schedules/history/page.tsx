'use client';

import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import Modal from 'components/ModalBoxSchedule';
import { Table } from 'components/Table';

import styles from './history.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { getAllAppointments } from 'services/appointments';
import { getAllSpecialists } from 'services/specialists';

export default function SchedulesPage(): JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const [specialists, setSpecialists] = React.useState<any>(null);
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    getAppointments();
    getSpecialists();
  }, []);

  async function getAppointments() {
    const response = await getAllAppointments();
    setData(response.data);
  }

  async function getSpecialists() {
    const response = await getAllSpecialists();
    const specialistsUpdated = response.data.data as DataSpecialistsModel[];
    setSpecialists(
      specialistsUpdated.slice().sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyHistory}>
        <div className={styles.headerHistory}>
          <div className={styles.btnAddSchedule}>
            <Button
              title="Realizar Agendamento"
              type="secondary"
              onClick={() => {
                setVisible(true);
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
        <div className={styles.tableHistory}>
          <Table headers={Strings.headersHistory} response={data} />
        </div>
      </div>
      <Modal
        show={visible}
        onHide={() => {
          setVisible(false);
        }}
        specialists={specialists !== null ? specialists : []}
      />
    </React.Fragment>
  );
}
