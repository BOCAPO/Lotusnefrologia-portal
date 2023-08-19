'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';

import { Button } from 'components/Button';
import { TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { LargeText, MediumText } from 'components/Text';

import styles from './page.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import LogoHome from 'assets/images/Logo@2x.png';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { useAuth } from 'hooks/useAuth';

type DataProps = {
  [name: string]: string | number;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });
  async function handleLogin(data: DataProps) {
    try {
      setIsLoading(true);
      const response = await signIn(String(data.login), String(data.password));
      if (response !== undefined) {
        router.push('/home');
      } else {
        throw new Error('Erro ao realizar login');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div className={styles.logoLogin}>
          <Image src={LogoHome} alt="Logo Lótus Nefrologia" />
        </div>
        <div className={styles.login}>
          <LargeText
            text={Strings.entry}
            color={Colors.gray90}
            bold={true}
            style={{ lineHeight: 0, marginBottom: '5vh', marginTop: '4vh' }}
          />
          <div className={styles.inputLogin}>
            <InputForm
              control={control}
              name="login"
              placeholder={Strings.login}
              mask="cpfCnpj"
              maxLength={14}
              containerStyle={{ width: '100%' }}
              error={errors.login?.message?.toString()}
              className={styles.inputLoginContent}
            />
          </div>
          <div className={styles.inputPassword}>
            <InputForm
              name="password"
              control={control}
              type="password"
              placeholder={Strings.password}
              containerStyle={{ width: '100%' }}
              iconType={TypeIcon.Password}
              error={errors.password?.message?.toString()}
              className={styles.inputLoginContent}
            />
          </div>
          <div className={styles.forgotPassword}>
            <MediumText
              text={Strings.forgotPassord}
              bold={false}
              color={Colors.greenDark}
              style={{ lineHeight: '2px' }}
              className={styles.forgotPasswordText}
            />
          </div>
          <div>
            <Button
              title={Strings.buttonLogin}
              type="primary"
              isLoading={isLoading}
              onClick={handleSubmit(handleLogin)}
            ></Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
