'use client';

import React from 'react';

import { Icon, TypeIcon } from 'components/Icone';
import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './formtwocolumns.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';

type Props = {
  headers: string[];
  headersResponse?: string[];
  response?: ResponseGetModel;
  style?: React.CSSProperties;
  isLoading?: boolean;
  onItemClick?: (_item: any) => void;
  type?: string;
};

export function FormTwoColumns({
  headers,
  response,
  isLoading = true,
  type,
  onItemClick
}: Props): JSX.Element {
  const [dataAdapted, setDataAdapted] = React.useState<any[]>([]);
  function handleRowClick(event: React.MouseEvent<HTMLTableRowElement>) {
    const userId = event.currentTarget.getAttribute('data-user-id');
    if (userId !== undefined && onItemClick !== undefined) {
      onItemClick(userId);
    }
  }
  React.useEffect(() => {
    if (
      response !== undefined &&
      response?.data !== null &&
      response?.data.length > 0
    ) {
      const links = response.links;
      links.map((link) => {
        if (
          link.label === '&laquo; Anterior' ||
          link.label === 'Próximo &raquo;'
        ) {
          links.splice(links.indexOf(link), 1);
        }
      });
      switch (type) {
        case 'scaleSchedule':
          adptedDataSpecialist(response?.data);
          break;

        default:
          break;
      }
    }
  }, [response?.data?.length]);

  async function adptedDataSpecialist(data: any) {
    data.forEach((element: DataSpecialistsModel) => {
      element.units.forEach((unit) => {
        const dataAdapted = {
          id: element.id,
          firstColumn: element.name,
          secondColumn: unit.name
        };
        setDataAdapted((oldArray) => [...oldArray, dataAdapted]);
      });
    });
  }

  return (
    <div className={styles.bodyFormTwoColumns}>
      <div className={styles.searchBarFormTwoColumns}>
        <input
          placeholder={Strings.search}
          style={{ width: '100%' }}
          type="search"
        />
        <div className={styles.iconSearch}>
          <Icon
            typeIcon={TypeIcon.Search}
            size={20}
            color={Colors.gray60}
            callback={() => {}}
          />
        </div>
      </div>
      <div className={styles.containerTable}>
        {isLoading ? (
          <SpinnerLoading />
        ) : (
          <table className={styles.tableScale}>
            <thead>
              <tr className={styles.headers}>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataAdapted.map((row: any, index: number) => (
                <tr key={index} onClick={handleRowClick} data-user-id={row.id}>
                  <td className={styles.rows}>{row.firstColumn}</td>
                  <td className={styles.rows}>{row.secondColumn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!isLoading ? (
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <select>
              {response?.links.map((link, index) => (
                <option key={index}>{link?.label}</option>
              ))}
            </select>
          </div>
          <SmallMediumText
            bold={false}
            style={{ lineHeight: 2, marginLeft: '2%' }}
            text={
              isLoading
                ? 'Carregando...'
                : `Exibindo ${response?.current_page} de ${Number(
                    response?.links.length
                  )}`
            }
            color={Colors.gray70}
          />
        </div>
      ) : null}
    </div>
  );
}
