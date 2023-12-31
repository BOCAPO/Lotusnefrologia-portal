'use client';

import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import { Table } from 'components/Table';

import styles from './history.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { format } from 'date-fns';
import { DataChatsModel } from 'models/DataChatsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import {
  getHistory,
  getHistoryMessages,
  getHistoryPerPage,
  getSearchedHistory
} from 'services/chat';
import printHistoryChats from 'utils/print.js';

export default function HistoryChatsPage(): JSX.Element {
  const [data, setData] = React.useState<any>(null);
  const [quantityRegisters, setQuantityRegisters] = React.useState<number>(0);
  const [search, setSearch] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);
  const [dataMessages, setDataMessages] = React.useState<any>(null);

  React.useEffect(() => {
    if (search === '') {
      getChatHistory();
    }
  }, [quantityRegisters, page, search]);

  async function getChatHistory() {
    if (page === 1) {
      const response = await getHistory();
      const dataUpdated = response.data as ResponseGetModel;
      dataUpdated.data = dataUpdated?.data?.map((item: any) => {
        item.patientName = item.patient.name;
        item.cpf = item.patient.cpf;
        item.Date =
          item.start_time !== null
            ? format(new Date(item.start_time.slice(0, 10)), 'dd/MM/yyyy')
            : 'Não informado';
        item.Time =
          item.start_time !== null
            ? item.start_time.slice(11, 16)
            : 'Não informado';
        item.roomName =
          item.room.name !== null ? item.room.name : 'Não informado';
        item.attendantName =
          item.attendant !== null ? item.attendant.name : 'Não informado';
        item.unitName =
          item.patient.unit.length > 0
            ? item.patient.unit[0].name
            : 'Não informado';

        return item;
      });
      setData(dataUpdated);
      setQuantityRegisters(dataUpdated?.data?.length);
    } else {
      const response = await getHistoryPerPage(page);
      const dataUpdated = response.data as ResponseGetModel;
      dataUpdated.data = dataUpdated?.data?.map((item: any) => {
        item.patientName = item.patient.name;
        item.cpf = item.patient.cpf;
        item.Date =
          item.start_time !== null
            ? format(new Date(item.start_time.slice(0, 10)), 'dd/MM/yyyy')
            : 'Não informado';
        item.Time =
          item.start_time !== null
            ? item.start_time.slice(11, 16)
            : 'Não informado';
        item.roomName =
          item.room.name !== null ? item.room.name : 'Não informado';
        item.attendantName =
          item.attendant !== null ? item.attendant.name : 'Não informado';
        item.unitName =
          item.patient.unit.lenght > 0
            ? item.patient.unit[0].name
            : 'Não informado';

        return item;
      });
      setData(dataUpdated);
      setQuantityRegisters(dataUpdated?.data?.length);
    }
    setIsLoading(false);
  }

  // async function getAllHistoryChat() {
  //   const response = await getHistoryWithoutPagination();
  //   let dataUpdated = response.data as unknown as DataHistoryChatsModel[];
  //   dataUpdated = dataUpdated?.map((item: any) => {
  //     item.patientName = item.patient.name;
  //     item.cpf = item.patient.cpf;
  //     item.Date =
  //       item.start_time !== null
  //         ? format(new Date(item.start_time.slice(0, 10)), 'dd/MM/yyyy')
  //         : 'Não informado';
  //     item.Time =
  //       item.start_time !== null
  //         ? item.start_time.slice(11, 16)
  //         : 'Não informado';
  //     item.roomName =
  //       item.room.name !== null ? item.room.name : 'Não informado';
  //     item.attendantName =
  //       item.attendant !== null ? item.attendant.name : 'Não informado';
  //     item.unitName =
  //       item.patient.unit.lenght > 0
  //         ? item.patient.unit[0].name
  //         : 'Não informado';

  //     return item;
  //   });
  //   setDataComplete(dataUpdated);
  // }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  async function handleSearch(search: string, event?: any) {
    if (event) {
      event.preventDefault();
    }
    if (search === '') {
      getChatHistory();
    } else {
      setIsLoading(true);
      const response = await getSearchedHistory(search);
      const dataUpdated = response.data as ResponseGetModel;
      dataUpdated.data = dataUpdated?.data?.map((item: any) => {
        item.patientName = item.patient.name;
        item.cpf = item.patient.cpf;
        item.Date =
          item.start_time !== null
            ? format(new Date(item.start_time.slice(0, 10)), 'dd/MM/yyyy')
            : 'Não informado';
        item.Time =
          item.start_time !== null
            ? item.start_time.slice(11, 16)
            : 'Não informado';
        item.roomName =
          item.room.name !== null ? item.room.name : 'Não informado';
        item.attendantName =
          item.attendant !== null ? item.attendant.name : 'Não informado';
        item.unitName =
          item.patient.unit.lenght > 0
            ? item.patient.unit[0].name
            : 'Não informado';

        return item;
      });
      setData(dataUpdated);
      setQuantityRegisters(dataUpdated?.data?.length);
      setIsLoading(false);
    }
  }

  async function handleDataChat(data: string) {
    const dataMensagens = await getHistoryMessages(JSON.parse(data).room_uuid);
    if (
      dataMensagens.data !== null &&
      dataMensagens.data !== undefined &&
      dataMensagens.data[0] !== undefined &&
      (dataMensagens.data[0] as DataChatsModel).messages.length > 0
    ) {
      setDataMessages((dataMensagens.data[0]! as DataChatsModel).messages);
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyHistoryChat}>
        <div className={styles.headerHistoryChat}>
          <div className={styles.btnAddHistoryChat}>
            <Button
              title={Strings.print}
              type="secondary"
              onClick={() => printHistoryChats(dataMessages)}
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
        <Table
          headers={Strings.headersHistoryChat}
          response={data}
          isLoading={isLoading}
          headersResponse={Strings.headersHistoryChatResponse}
          onClick={handleSelectionPage}
          onItemClick={handleDataChat}
        />
      </div>
    </React.Fragment>
  );
}
