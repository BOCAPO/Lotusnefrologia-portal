'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { LargeText, SmallMediumText } from 'components/Text';

import styles from './page.module.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { useAuth } from 'hooks/useAuth';
import * as Yup from 'yup';

type DataProps = {
  [name: string]: string | number;
};

const schema = Yup.object({
  login: Yup.string().required(Strings.loginRequired),
  password: Yup.string().required(Strings.passwordRequired)
});

export default function Login() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn } = useAuth();

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
      await signIn(String(data.login), String(data.password));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div className={styles.login}>
          <LargeText
            text={Strings.entry}
            color={Colors.gray90}
            bold={true}
            style={{ lineHeight: 0 }}
          />
          <InputForm
            name="login"
            placeholder={Strings.login}
            editable={!isLoading}
            error={errors.login?.message?.toString()}
            control={control}
            containerStyle={{ width: '100%', marginTop: 16 }}
          />
          <InputForm
            name="password"
            type="password"
            placeholder={Strings.password}
            editable={!isLoading}
            error={errors.login?.message?.toString()}
            control={control}
            style={{ padding: '2%' }}
            containerStyle={{ width: '100%', marginTop: 20 }}
          />
          <div className={styles.forgotPassword}>
            <SmallMediumText
              text={Strings.forgotPassord}
              bold={false}
              color={Colors.greenDark}
              style={{ lineHeight: 5 }}
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
