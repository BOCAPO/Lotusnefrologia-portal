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
import { format } from 'date-fns';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { Prefs } from 'repository/Prefs';
import {
  getAllAppointmensTags,
  getAllAppointmentsWithSchedule
} from 'services/appointments';
import { getPatientsWithoutPagination } from 'services/patients';
import { getSpecialistsWithoutPagination } from 'services/specialists';
import { getAllUnits } from 'services/units';

export default function SchedulesPage(): JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [specialists, setSpecialists] = React.useState<any>(null);
  const [patients, setPatients] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [tags, setTags] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getAppointments();
    getSpecialists();
    getAppointmentTags();
    getPatients();
    getUnits();
  }, []);

  async function getAppointments() {
    const response = await getAllAppointmentsWithSchedule('');
    const dataUpdated = response.data as ResponseGetModel;
    dataUpdated.data = dataUpdated?.data?.map((item: any) => {
      item.cpf = item.patient.cpf;
      item.patient = item.patient.name;
      item.unit = item.unit.name;
      item.newDate = format(new Date(item.time.slice(0, 10)), 'dd/MM/yyyy');
      item.newTime = item.time.slice(11, 16);
      return item;
    });
    dataUpdated.data = dataUpdated?.data?.slice().sort((a: any, b: any) => {
      if (a.newDate < b.newDate) {
        return -1;
      }
      if (a.newDate > b.newDate) {
        return 1;
      }
      return 0;
    });
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
    let unitsPermited = JSON.parse(Prefs.getUnits()!);
    unitsPermited = unitsPermited!.map((item: DataUnitsModel) => item.id);
    const response = await getAllUnits();
    const unitsUpdated = response.data.data as DataUnitsModel[];

    const newUnitsPermitd: any = [];

    unitsUpdated.map((item: any) => {
      unitsPermited?.map((item2: any) => {
        if (item.id === item2) {
          newUnitsPermitd.push(item);
        }
      });
    });
    setUnits(
      newUnitsPermitd.sort((a: DataUnitsModel, b: DataUnitsModel) =>
        a.name.localeCompare(b.name)
      )
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
