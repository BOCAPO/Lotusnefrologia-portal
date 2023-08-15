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
import { DataUnitsModel } from 'models/DataUnitsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import {
  getAllAppointmensTags,
  getAllAppointments
} from 'services/appointments';
import { getPatientsWithoutPagination } from 'services/patients';
import { getSpecialistsWithoutPagination } from 'services/specialists';
import { getAllUnits } from 'services/units';

export default function SchedulesPage(): JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const [specialists, setSpecialists] = React.useState<any>(null);
  const [patients, setPatients] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [tags, setTags] = React.useState<any>(null);
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getAppointments();
    getSpecialists();
    getAppointmentTags();
    getPatients();
    getUnits();
  }, []);

  async function getAppointments() {
    const response = await getAllAppointments();
    const dataUpdated = response.data as ResponseGetModel;
    setData(dataUpdated);
    setLoading(false);
  }

  async function getAppointmentTags() {
    const response = await getAllAppointmensTags();
    setTags(response.data.data);
  }

  async function getSpecialists() {
    const response = await getSpecialistsWithoutPagination();
    const specialistsUpdated = response.data as ResponseGetModel;
    setSpecialists(specialistsUpdated);
  }

  async function getPatients() {
    const response = await getPatientsWithoutPagination();
    const patientsUpdated = response.data as ResponseGetModel;
    setPatients(patientsUpdated);
  }

  async function getUnits() {
    const response = await getAllUnits();
    const unitsUpdated = response.data.data as DataUnitsModel[];
    setUnits(unitsUpdated.slice().sort((a, b) => a.name.localeCompare(b.name)));
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
          <Table
            headers={Strings.headersHistory}
            response={data}
            isLoading={loading}
            headersResponse={Strings.headersHistoryResponse}
          />
        </div>
      </div>
      <Modal
        show={visible}
        onHide={() => {
          setVisible(false);
        }}
        specialists={specialists !== null ? specialists : []}
        tags={tags !== null ? tags : []}
        patients={patients !== null ? patients : []}
        units={units !== null ? units : []}
      />
    </React.Fragment>
  );
}
