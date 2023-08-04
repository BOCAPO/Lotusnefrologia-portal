import Link from 'next/link';

import { SmallMediumText } from 'components/Text';

import styles from './menuadmin.module.css';

import { Colors } from 'configs/Colors_default';
import { menusAdmin } from 'utils/menus';

type Props = {
  style?: React.CSSProperties;
  id?: string;
};

export default function MenuAdmin({ style, id }: Props): JSX.Element {
  return (
    <div className={styles.menuAdmin} style={style} id={id}>
      {menusAdmin?.map((menu, index) => (
        <Link key={index} href={menu.link !== null ? menu.link : ''}>
          <div className={styles.menuAdminItem}>
            <SmallMediumText
              text={menu.title !== null ? menu.title : ''}
              bold={false}
              style={{ lineHeight: 2, margin: 0 }}
              color={Colors.greenDark}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
