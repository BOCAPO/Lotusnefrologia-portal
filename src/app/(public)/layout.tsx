import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AuthContextProvider } from 'contexts/AuthContext';
import '../../styles/global.css';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
