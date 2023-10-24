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
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { Prefs } from 'repository/Prefs';
import {
  getAllAppointmensTags,
  getAllAppointmentsWithSchedule,
  getSearchedAppointments
} from 'services/appointments';
import { getPatientsWithoutPagination } from 'services/patients';
import { getSpecialistsWithoutPagination } from 'services/specialists';
import { getAllUnits } from 'services/units';

export default function SchedulesPage(): JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [quantityAppointments, setQuantityAppointments] =
    React.useState<any>(0);
  const [specialists, setSpecialists] = React.useState<any>(null);
  const [patients, setPatients] = React.useState<any>(null);
  const [search, setSearch] = React.useState<string>('');
  const [units, setUnits] = React.useState<any>(null);
  const [tags, setTags] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (search === '') {
      getAppointments();
    }
    getSpecialists();
    getAppointmentTags();
    getPatients();
    getUnits();
  }, [quantityAppointments, search]);

  async function getAppointments() {
    const response = await getAllAppointmentsWithSchedule('');
    const dataUpdated = response.data as ResponseGetModel;
    setQuantityAppointments(dataUpdated?.data?.length);
    dataUpdated.data = dataUpdated?.data?.map((item: any) => {
      item.cpf = item.patient.cpf;
      item.patient = item.patient.name;
      item.unit = item.unit.name;
      item.newDate = format(new Date(item.time.slice(0, 10)), 'dd/MM/yyyy');
      item.newTime = item.time.slice(11, 16);
      return item;
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
    let specialistsUpdated = response.data as unknown as DataSpecialistsModel[];
    specialistsUpdated = specialistsUpdated.sort((a: any, b: any) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
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

  async function handleSearch(search: string, event?: any) {
    if (event) {
      event.preventDefault();
    }
    if (search === '') {
      getAppointments();
    } else {
      setLoading(true);
      const response = await getSearchedAppointments(search);
      const dataUpdated = response.data as ResponseGetModel;
      setQuantityAppointments(dataUpdated?.data?.length);
      dataUpdated.data = dataUpdated?.data?.map((item: any) => {
        item.cpf = item.patient.cpf;
        item.patient = item.patient.name;
        item.unit = item.unit.name;
        item.newDate = format(
          new Date(item.schedule.time.slice(0, 10)),
          'dd/MM/yyyy'
        );
        item.newTime = item.schedule.time.slice(11, 16);
        item.specialist_name = item.specialist.name;
        item.specialty = item.specialty.description;
        switch (item.appointment_status) {
          case 1:
            item.appointment_status = 'Agendado';
            break;
          case 2:
            item.appointment_status = 'Cancelado';
            break;
          case 3:
            item.appointment_status = 'Realizado';
            break;
          case 4:
            item.appointment_status = 'Confirmado';
            break;
          default:
            break;
        }
        return item;
      });
      setData(dataUpdated);
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyHistory}>
        <div className={styles.headerHistory}>
          <div className={styles.btnAddSchedule}>
            <Button
              title={Strings.makeAppointment}
              type="secondary"
              onClick={() => {
                setVisible(true);
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
          setQuantityAppointments(quantityAppointments + 1);
        }}
        specialists={specialists !== null ? specialists : []}
        tags={tags !== null ? tags : []}
        patients={patients !== null ? patients : []}
        units={units !== null ? units : []}
      />
    </React.Fragment>
  );
}
