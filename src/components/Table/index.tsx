import React from 'react';

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
};

export function Table({ headers, response, headersResponse }: Props) {
  const [keys, setKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (
      response !== undefined &&
      response?.data !== null &&
      response?.data.length > 0
    ) {
      const objectKeys: string[] = Object.keys(response?.data[0]);
      const commonKeys = objectKeys.filter(
        (key) => headersResponse?.includes(key)
      );
      setKeys(commonKeys);
    }
  }, [response?.data?.length]);

  return (
    <React.Fragment>
      <div className={styles.containerTable}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headers}>
              {headers?.map((header, index) => <th key={index}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {response?.data?.map((row: any, index: number) => (
              <tr key={index}>
                {/* {row?.map((cell, index) => (
                  <td key={index} className={styles.rows}>
                    {cell}
                  </td>
                ))} */}
                {keys.map((key, index) => (
                  <td key={index} className={styles.rows}>
                    {String(row[key])}
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
          text={`Exibindo ${response?.current_page} de ${
            Number(response?.links.length) - 2
          }`}
          color={Colors.gray70}
        />
      </div>
    </React.Fragment>
  );
}
