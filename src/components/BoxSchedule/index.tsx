import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { SmallMediumText } from 'components/Text';

import styles from './boxSchedule.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

type DataProps = {
  [name: string]: string | number;
};

type Props = {
  visible: boolean;
};

export function BoxSchedule({ visible = false }: Props) {
  const {
    control,
    // handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  return (
    <>
      {visible && (
        <div className={styles.containerBoxSchedule}>
          <div className={styles.bodyBoxSchedule}>
            <SmallMediumText
              text={Strings.schedule}
              bold={true}
              color={Colors.gray90}
            />
            <div>
              <InputForm
                control={control}
                placeholder={Strings.description}
                type="text"
                name="description"
                error={errors.descriptionRequired?.message?.toString()}
              />
              <select>
                <option value="1">1</option>
              </select>
            </div>
            <div>
              <InputForm
                control={control}
                placeholder={Strings.pacient}
                type="text"
                name="pacient"
                error={errors.pacientRequired?.message?.toString()}
              />
            </div>
            <div>
              <InputForm
                control={control}
                placeholder={Strings.speciality}
                type="text"
                name="speciality"
                error={errors.specialityRequired?.message?.toString()}
              />
              <InputForm
                control={control}
                placeholder={Strings.specialist}
                type="text"
                name="specialist"
                error={errors.specialistRequired?.message?.toString()}
              />
            </div>
            <div>
              <InputForm
                control={control}
                placeholder={Strings.date}
                type="date"
                name="date"
                error={errors.dateRequired?.message?.toString()}
              />
              <InputForm
                control={control}
                placeholder={Strings.hour}
                type="time"
                name="hour"
                error={errors.hourRequired?.message?.toString()}
              />
            </div>
            <div>
              <InputForm
                control={control}
                placeholder={Strings.observation}
                type="text"
                name="observation"
                error={errors.observationRequired?.message?.toString()}
              />
            </div>
            <div>
              <div>
                <Button
                  title={Strings.save}
                  type="primary"
                  style={{ width: '100%' }}
                  // onClick={handleSubmit(handleLogin)}
                />
                <div>
                  <Button
                    title={Strings.cancel}
                    type="secondary"
                    style={{ width: '100%' }}
                    // onClick={handleSubmit(handleLogin)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
