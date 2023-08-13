import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import imageBg from '../assets/images/Logo-7.png';

import { Colors } from 'configs/Colors_default';

interface Custom404Styles {
  container: React.CSSProperties;
  heading: React.CSSProperties;
  link: React.CSSProperties;
  imgBg404: React.CSSProperties;
}

const custom404Styles: Custom404Styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
    backgroundColor: `${Colors.greenLight}`,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  link: {
    color: 'blue',
    textDecoration: 'underline'
  },
  imgBg404: {
    opacity: 0.4,
    width: '20%',
    height: '13%'
  }
};

export default function Custom404() {
  return (
    <React.Fragment>
      <div style={custom404Styles.container}>
        <Image src={imageBg} alt="Logo" style={custom404Styles.imgBg404} />
        <h1>Oops! Página não encontrada.</h1>
        <p>A página que você está procurando não existe.</p>
        <Link href="/home">Retornar a página inicial</Link>
      </div>
    </React.Fragment>
  );
}
