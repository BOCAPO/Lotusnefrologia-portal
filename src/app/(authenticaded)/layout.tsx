import { Metadata } from 'next';

import { MediumLargeText } from 'components/Text';

import styles from './layout.module.css';

import { Colors } from 'configs/Colors_default';

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
  return (
    <html lang="pt-br">
      <body>
        <header className={styles.header}>
          <div>
            <MediumLargeText
              text="Lótus Nefrologia"
              bold={true}
              color={Colors.greenDark}
              className={styles.logoHeader}
              style={{ lineheight: 5 }}
            />
          </div>
          <div></div>
        </header>
        {children}
      </body>
    </html>
  );
}
