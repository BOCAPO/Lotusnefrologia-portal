import React from 'react';

import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './table.module.css';

import { Colors } from 'configs/Colors_default';
import { ResponseGetModel } from 'models/ResponseGetModel';

type Props = {
  headers: string[];
  headersResponse?: string[];
  style?: React.CSSProperties;
  onClick?: (selectedValue: string) => void;
  response?: ResponseGetModel;
  onItemClick?: (item: any) => void;
  isLoading?: boolean;
};

export function Table({
  headers,
  response,
  headersResponse,
  isLoading = true,
  onItemClick,
  onClick
}: Props) {
  const [keys, setKeys] = React.useState<string[] | undefined>([]);
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >(response?.links[0]?.label);

  function handleRowClick(event: React.MouseEvent<HTMLTableRowElement>) {
    const item = event.currentTarget.getAttribute('data-id');
    if (item !== undefined && onItemClick) {
      onItemClick(item);
    }
  }

  React.useEffect(() => {
    if (
      response !== undefined &&
      response?.data !== null &&
      response?.data.length > 0
    ) {
      fixedPagination(response);
      const objectKeys: string[] = Object.keys(response?.data[0]);
      const commonKeys = headersResponse?.filter(
        (key) => objectKeys?.includes(key)
      );
      setKeys(commonKeys);
    }
  }, [response?.data?.length]);

  async function fixedPagination(response: any) {
    const links = response.links;
    await links.map((link: any) => {
      if (
        link.label === '&laquo; Anterior' ||
        link.label === 'Próximo &raquo;' ||
        link.label.includes('Anterior') ||
        link.label.includes('Próximo')
      ) {
        links.splice(links.indexOf(link), 1);
      }
    });
  }

  return (
    <React.Fragment>
      <div
        className={styles.containerTable}
        style={
          response !== undefined &&
          response?.data !== undefined &&
          response?.data?.length > 0
            ? { height: '82%' }
            : { height: '90%' }
        }
      >
        {isLoading ? (
          <SpinnerLoading />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr className={styles.headers}>
                {headers?.map((header, index) => <th key={index}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {response !== undefined &&
              response.data !== undefined &&
              response?.data?.length > 0 ? (
                response?.data?.map((row: any, index: number) => (
                  <tr
                    key={index}
                    data-id={JSON.stringify(row)}
                    onClick={handleRowClick}
                  >
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
                ))
              ) : (
                <tr>
                  <td colSpan={headersResponse?.length} className={styles.rows}>
                    <p
                      style={{ margin: 0, width: '100%', textAlign: 'center' }}
                    >
                      Nenhum registro encontrado.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <select
            value={selectedOption}
            onChange={(event) => {
              const selectedValue = event.target.value;
              setSelectedOption(selectedValue);
              onClick && onClick(selectedValue);
            }}
          >
            {response?.links.map(
              (link, index) =>
                link.label !== '&laquo; Anterior' &&
                link.label !== 'Próximo &raquo;' &&
                link.label !== 'Anterior' &&
                link.label !== 'Próximo' && (
                  <option key={index} value={link?.label}>
                    {link?.label}
                  </option>
                )
            )}
          </select>
        </div>
        <SmallMediumText
          bold={false}
          style={{ lineHeight: 2, marginLeft: '2%' }}
          text={
            isLoading
              ? 'Carregando...'
              : `Exibindo ${response?.current_page} de ${Number(
                  Number(response?.last_page)
                )}`
          }
          color={Colors.gray70}
        />
      </div>
    </React.Fragment>
  );
}
