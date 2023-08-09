'use client';

import React from 'react';

import { Icon, TypeIcon } from 'components/Icone';
import { SmallMediumText } from 'components/Text';

import styles from './formTwoColumns.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataScaleModel } from 'models/DataScaleModel';

type Props = {
  headers: string[];
  data: DataScaleModel[] | null;
  style?: React.CSSProperties;
  onItemClick?: (_item: DataScaleModel) => void;
};

export function FormTwoColumns({
  headers,
  data,
  onItemClick
}: Props): JSX.Element {
  const [keys, setKeys] = React.useState<string[]>([]);

  const handleItemClick = (item: DataScaleModel) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  React.useEffect(() => {
    if (data !== null && data.length > 0) {
      const objectKeys: string[] = Object.keys(data[0]);
      setKeys(objectKeys);
    }
  }, [data]);

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
            {data?.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {keys.map((key: string, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={styles.rows}
                    onClick={() => handleItemClick(row)}
                  >
                    {String(row[key]).toLocaleUpperCase()}
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
    </div>
  );
}
