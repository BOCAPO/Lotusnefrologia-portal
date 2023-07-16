import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { InputForm } from 'components/Input';
import { LargeText } from 'components/Text';

import styles from './page.module.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import * as Yup from 'yup';

type DataProps = {
  [name: string]: string | number;
};

const schema = Yup.object({
  login: Yup.string().required(Strings.loginRequired).max(14),
  password: Yup.string().required(Strings.passwordRequired)
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div className={styles.login}>
          <LargeText text={Strings.entry} color={Colors.gray90} bold={false} />
          <InputForm />
        </div>
      </div>
    </main>
  );
}
