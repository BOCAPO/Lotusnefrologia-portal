import type { Metadata } from 'next';

import { AuthContextProvider } from 'contexts/AuthContext';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/global.css';

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
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
