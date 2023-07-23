import Link from 'next/link';

import { SmallMediumText } from 'components/Text';

import styles from './submenutop.module.css';

import { Colors } from 'configs/Colors_default';
import { MenuModel } from 'models/MenuModel';

type Props = {
  menu: MenuModel[] | null;
  style?: React.CSSProperties;
};

export default function SubMenuTop({ menu, style }: Props) {
  return (
    <div className={styles.subMenu} style={style}>
      {menu?.map((internalMenu: MenuModel, index: number) => (
        <Link
          key={index}
          href={internalMenu.link !== null ? internalMenu.link : ''}
        >
          <div className={styles.subMenuItem}>
            <SmallMediumText
              text={internalMenu.title !== null ? internalMenu.title : ''}
              bold={false}
              color={Colors.greenDark}
              style={{ lineHeight: 2, margin: 0 }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
