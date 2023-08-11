'use client';

import React from 'react';

import { Icon, TypeIcon } from 'components/Icone';
import { SmallMediumText } from 'components/Text';

import styles from './formtwocolumns.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { ResponseGetModel } from 'models/ResponseGetModel';

type Props = {
  headers: string[];
  headersResponse?: string[];
  response?: ResponseGetModel;
  style?: React.CSSProperties;
  isLoading?: boolean;
  onItemClick?: (_item: any) => void;
};

export function FormTwoColumns({
  headers,
  headersResponse,
  response,
  isLoading = true,
  onItemClick
}: Props): JSX.Element {
  const [keys, setKeys] = React.useState<string[] | undefined>([]);
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
      const objectKeys: string[] = Object.keys(response?.data[0]);
      const commonKeys = headersResponse?.filter(
        (key) => objectKeys?.includes(key)
      );
      setKeys(commonKeys);
    }
  }, [response?.data?.length]);

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
        <table className={styles.tableScale}>
          <thead>
            <tr className={styles.headers}>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {response?.data.map((row: any, index: number) => (
              <tr key={index} onClick={handleRowClick} data-user-id={row.id}>
                {keys?.map((key, index) => (
                  <td key={index} className={styles.rows}>
                    {key === 'status' ? (
                      row[key] === 0 ? (
                        <span>Ativo</span>
                      ) : (
                        <span>Inativo</span>
                      )
                    ) : row[key] === null ? (
                      'Não informado'
                    ) : key === 'birthday' ? (
                      new Date(row[key]).toLocaleDateString('pt-BR')
                    ) : (
                      row[key].toString()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              : `Exibindo ${response?.current_page} de ${
                  Number(response?.links.length) - 2
                }`
          }
          color={Colors.gray70}
        />
      </div>
    </div>
  );
}
