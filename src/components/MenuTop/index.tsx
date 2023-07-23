'use client';

import Image from 'next/image';
import Link from 'next/link';

import SubMenuTop from 'components/SubMenuTop';
import { MediumText } from 'components/Text';

import styles from './menutop.module.css';

import { Colors } from 'configs/Colors_default';
import { menus } from 'utils/menus';

export function MenuTop() {
  const menusArray = Object.values(menus);
  return (
    <div className={styles.container}>
      {menusArray.map((menu, index) => (
        <div key={index} className={styles.buttonsMenu}>
          <Link href={menu.link !== null ? menu.link : ''}>
            <div className={styles.cardIcon}>
              <Image
                src={menu.image !== null ? menu.image : ''}
                alt={menu.title}
              />
            </div>
            <MediumText
              text={menu.title}
              bold={false}
              color={Colors.greenDark}
              style={{ lineHeight: 3, margin: 0, marginBottom: 40 }}
            />
          </Link>
          <SubMenuTop
            menu={menu.internalMenus !== null ? menu.internalMenus : null}
            style={{ display: 'none' }}
          />
        </div>
      ))}
    </div>
  );
}
