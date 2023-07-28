'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Icon, TypeIcon } from 'components/Icone';
import { MediumText } from 'components/Text';

import styles from './layout.module.css';

import LogoHome from 'assets/images/Logo-7.png';
import { Colors } from 'configs/Colors_default';
import { useIsClient } from 'hooks/useIsClient';
import { Prefs } from 'repository/Prefs';

export const metadata: Metadata = {
  title: 'Portal Lótus Nefrologia - Login',
  description: 'Portal Lótus Nefrologia - Login',
  authors: [
    { name: 'WorkingTech', url: '' },
    { name: 'Danilo Alves', url: '' }
  ],
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow',
  keywords: 'Portal Lótus Nefrologia - Login'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const isClient = useIsClient();
  const [nameUser, setNameUser] = useState('' as string | undefined);
  useEffect(() => {
    if (isClient) {
      setNameUser(Prefs.getNameUser()?.toString());
    }
  }, [isClient]);

  return (
    <html lang="pt-br">
      <body className={styles.bodyAuth}>
        <header className={styles.header}>
          <div className={styles.logoHome}>
            <Image src={LogoHome} alt="Logo da Home Page" />
          </div>
          <div className={styles.searchBar}>
            <input type="search" placeholder="Pesquisar" />
            <div className={styles.iconSearch}>
              <Icon
                typeIcon={TypeIcon.Search}
                size={20}
                color={Colors.gray60}
                callback={() => {}}
              />
            </div>
          </div>
          <div className={styles.buttonsHeader}>
            <MediumText
              text={nameUser !== undefined ? nameUser : 'Usuário'}
              bold={true}
              color={Colors.gray90}
              style={{ lineheight: 5, marginRight: 10 }}
            />
            <button className={styles.buttonsConfigHeader}>
              <Icon
                typeIcon={TypeIcon.UserLogged}
                size={25}
                callback={() => {}}
                color={Colors.gray60}
              />
            </button>
            <button className={styles.buttonsConfigHeader}>
              <Icon
                typeIcon={TypeIcon.Notification}
                size={25}
                color={Colors.gray60}
                callback={() => {}}
              />
            </button>
            <button className={styles.buttonsConfigHeader}>
              <Icon
                typeIcon={TypeIcon.More}
                size={25}
                callback={() => {}}
                color={Colors.gray60}
              />
            </button>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
