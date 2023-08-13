'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Icon, TypeIcon } from 'components/Icone';
import MenuAdmin from 'components/MenuAdmin';
import MenuProfile from 'components/MenuProfile';
import { MediumText } from 'components/Text';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './layout.module.css';

import LogoHome from 'assets/images/Logo-7.png';
import { Colors } from 'configs/Colors_default';
import { AuthContextProvider } from 'contexts/AuthContext';
import { useIsClient } from 'hooks/useIsClient';
import { Prefs } from 'repository/Prefs';

// export const metadata: Metadata = {
//   title: 'Portal Lótus Nefrologia - Login',
//   description: 'Portal Lótus Nefrologia - Login',
//   authors: [
//     { name: 'WorkingTech', url: '' },
//     { name: 'Danilo Alves', url: '' }
//   ],
//   viewport: 'width=device-width, initial-scale=1.0',
//   robots: 'index, follow',
//   keywords: 'Portal Lótus Nefrologia - Login'
// };

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
        <AuthContextProvider>
          <header className={styles.header}>
            <div className={styles.logoHome}>
              <Image src={LogoHome} alt="Logo da Home Page" />
            </div>
            {/* <div className={styles.searchBar}>
              <input type="search" placeholder={Strings.search} />
              <div className={styles.iconSearch}>
                <Icon
                  typeIcon={TypeIcon.Search}
                  size={20}
                  color={Colors.gray60}
                  callback={() => {}}
                />
              </div>
            </div> */}
            <div className={styles.buttonsHeader}>
              <MediumText
                text={nameUser !== undefined ? nameUser : 'Usuário'}
                bold={true}
                color={Colors.gray90}
                style={{ lineHeight: 5, marginRight: 10 }}
              />
              <button className={styles.firstMenuAdmin}>
                <Icon
                  typeIcon={TypeIcon.UserLogged}
                  size={25}
                  callback={() => {}}
                  color={Colors.gray60}
                />
              </button>
              <MenuProfile />
              <button className={styles.secondMenuAdmin}>
                <Icon
                  typeIcon={TypeIcon.Notification}
                  size={25}
                  color={Colors.gray60}
                  callback={() => {}}
                />
              </button>
              <button className={styles.thirtyMenuAdmin}>
                <Icon
                  typeIcon={TypeIcon.More}
                  size={25}
                  callback={() => {}}
                  color={Colors.gray60}
                />
              </button>
              <MenuAdmin />
            </div>
          </header>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
