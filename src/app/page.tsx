import { InputForm } from 'components/Input';
import { LargeText } from 'components/Text';

import styles from './page.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

export default function Login() {
  const {
    control,
    setValue,
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
