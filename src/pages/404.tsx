import Link from 'next/link';
import React from 'react';

export default function Custom404() {
  return (
    <React.Fragment>
      <div>
        <h1>Oops! Página não encontrada.</h1>
        <p>A página que você está procurando não existe.</p>
        <Link href="/home">Retornar a página inicial</Link>
      </div>
    </React.Fragment>
  );
}
