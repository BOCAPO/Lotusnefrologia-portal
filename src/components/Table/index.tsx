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
  onClick?: () => void;
  response?: ResponseGetModel;
  isLoading?: boolean;
};

export function Table({
  headers,
  response,
  headersResponse,
  isLoading = true
}: Props) {
  const [keys, setKeys] = React.useState<string[] | undefined>([]);

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
      const objectKeys: string[] = Object.keys(response?.data[0]);
      const commonKeys = headersResponse?.filter(
        (key) => objectKeys?.includes(key)
      );
      setKeys(commonKeys);
    }
  }, [response?.data?.length]);

  return (
    <React.Fragment>
      <div className={styles.containerTable}>
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
                  <tr key={index}>
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
    </React.Fragment>
  );
}
