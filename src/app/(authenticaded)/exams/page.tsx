/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { Modal } from 'react-bootstrap';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { TableExams } from 'components/TableExams';

import styles from './exams.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { getAllExams, getSearchExams } from 'services/exams';
import { getExamsTypesWithoutPagination } from 'services/examsTypes';
import { getPatientsWithoutPagination } from 'services/patients';
import { getSpecialistsWithoutPagination } from 'services/specialists';

export default function ExamsPage(): JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [quantityExams, setQuantityExams] = React.useState<number>(0);
  const [specialists, setSpecialists] = React.useState<any>(null);
  const [search, setSearch] = React.useState<string>('');
  const [patients, setPatients] = React.useState<any>(null);
  const [examTypes, setExamTypes] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (search === '') {
      getExams();
      getSpecialists();
      getPatients();
      getExamTypes();
    }
  }, [quantityExams, search]);

  async function getExams() {
    const response = await getAllExams();
    const dataUpdated = response.data as ResponseGetModel;
    dataUpdated.data = dataUpdated?.data?.map((item: any) => {
      item.patientName = item.patient.name;
      item.specialistName =
        item.specialist !== null ? item.specialist.name : 'Não informado';
      item.exam_type = item.exam_type.description;
      item.attachment = item.path;
      return item;
    });
    setData(dataUpdated);
    setQuantityExams(dataUpdated?.data?.length);
    setIsLoading(false);
  }

  async function getSpecialists() {
    const response = await getSpecialistsWithoutPagination();
    const specialistsUpdated =
      response.data as unknown as DataSpecialistsModel[];
    setSpecialists(specialistsUpdated);
  }

  async function getPatients() {
    const response = await getPatientsWithoutPagination();
    const patientsUpdated = response.data as ResponseGetModel;
    setPatients(patientsUpdated);
  }

  async function getExamTypes() {
    const response = await getExamsTypesWithoutPagination();
    const examsTypesUpdated = response.data as ResponseGetModel;
    setExamTypes(examsTypesUpdated);
  }

  const handleOnUpdate = (value: number) => {
    setQuantityExams(Number(quantityExams) + value);
  };

  async function handleSearch(search: string, event?: any) {
    if (event) {
      event.preventDefault();
    }
    if (search === '') {
      getExams();
    } else {
      setIsLoading(true);
      const response = await getSearchExams(search);
      const dataUpdated = response.data as ResponseGetModel;
      dataUpdated.data = dataUpdated?.data?.map((item: any) => {
        item.patientName = item.patient.name;
        item.specialistName =
          item.specialist !== null ? item.specialist.name : 'Não informado';
        item.exam_type = item.exam_type.description;
        item.attachment = item.path;
        return item;
      });
      setData(dataUpdated);
      setQuantityExams(dataUpdated?.data?.length);
      setIsLoading(false);
    }
    getSpecialists();
    getPatients();
    getExamTypes();
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyExams}>
        <div className={styles.headerExams}>
          <div className={styles.btnAddExam}>
            <Button
              title={Strings.insertExam}
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
        <TableExams
          headers={Strings.headersExams}
          response={data}
          isLoading={isLoading}
          headersResponse={Strings.headersExamsResponse}
        />
      </div>
      <Modal
        show={visible}
        onHide={() => {
          setVisible(false);
        }}
        specialists={specialists !== null ? specialists : []}
        patients={patients !== null ? patients : []}
        examsTypes={examTypes !== null ? examTypes : []}
        onUpdate={handleOnUpdate}
      />
    </React.Fragment>
  );
}
