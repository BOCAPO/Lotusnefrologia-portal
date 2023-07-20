'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { LargeText, MediumText } from 'components/Text';

import styles from './page.module.css';

import { yupResolver } from '@hookform/resolvers/yup';
import LogoHome from 'assets/images/Logo@2x.png';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import * as Yup from 'yup';

type DataProps = {
  [name: string]: string | number;
};

const schema = Yup.object({
  login: Yup.string().required(Strings.loginRequired),
  password: Yup.string().required(Strings.passwordRequired)
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  // const { signIn } = useAuth();
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
      console.log(data);
      // await signIn(String(data.login), String(data.password));
      router.push('/home');
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
          <InputForm
            name="login"
            placeholder={Strings.login}
            editable={!isLoading}
            error={errors.login?.message?.toString()}
            control={control}
            containerStyle={{ width: '100%' }}
            className={styles.inputLogin}
          />
          <InputForm
            name="password"
            type="password"
            placeholder={Strings.password}
            editable={!isLoading}
            className={styles.inputPassword}
            error={errors.login?.message?.toString()}
            control={control}
            containerStyle={{ width: '100%' }}
          />
          <div className={styles.forgotPassword}>
            <MediumText
              text={Strings.forgotPassord}
              bold={false}
              color={Colors.greenDark}
              style={{ lineHeight: 5 }}
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
    </main>
  );
}
