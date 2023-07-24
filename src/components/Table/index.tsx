import React from 'react';

import { SmallMediumText } from 'components/Text';

import styles from './table.module.css';

import { Colors } from 'configs/Colors_default';

type Props = {
  headers: string[];
  data: string[][] | null;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export function Table({ headers, data }: Props) {
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
            {data?.map((row, index) => (
              <tr key={index}>
                {row?.map((cell, index) => (
                  <td key={index} className={styles.rows}>
                    {cell}
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
            {data?.map((row, index) => <option key={index}>{index}</option>)}
          </select>
        </div>
        <SmallMediumText
          bold={false}
          style={{ lineHeight: 2, marginLeft: '2%' }}
          text={`Exibindo 1 de ${data?.length}`}
          color={Colors.gray70}
        />
      </div>
    </React.Fragment>
  );
}
