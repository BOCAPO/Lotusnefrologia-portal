import Image from 'next/image';

import { SmallMediumText } from 'components/Text';

import styles from './styles.module.css';

import { Colors } from 'configs/Colors_default';
import { menus } from 'utils/menus';

export function MenuTop() {
  const menusArray = Object.values(menus);
  return (
    <div className={styles.container}>
      {menusArray.map((menu, index) => (
        <div key={index} className={styles.buttonsMenu}>
          <div className={styles.cardIcon}>
            <Image src={menu.image} alt={menu.title} />
          </div>
          <SmallMediumText
            text={menu.title}
            bold={false}
            color={Colors.greenDark}
            style={{ lineHeight: 3, margin: 0, marginBottom: 40 }}
          />
        </div>
      ))}
    </div>
  );
}
