'use client';

import { Icon, TypeIcon } from 'components/Icone';
import { SmallMediumText } from 'components/Text';

import styles from './formTwoColumns.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

type Props = {
  headers: string[];
  data: string[][] | null;
  style?: React.CSSProperties;
  onItemClick?: (item: string[]) => void;
};

export function FormTwoColumns({
  headers,
  data,
  onItemClick
}: Props): JSX.Element {
  const handleItemClick = (item: string[]) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

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
              {headers?.map((header, index) => <th key={index}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => (
              <tr key={index}>
                {row?.map((cell, index) => (
                  <td
                    key={index}
                    className={styles.rows}
                    onClick={() => handleItemClick(row)}
                  >
                    {cell.toLocaleUpperCase()}
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
