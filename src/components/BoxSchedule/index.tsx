import { useState } from 'react';
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

export function BoxSchedule({ visible }: Props) {
  const [statusVisible, setStatusVisible] = useState(visible);
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
              style={{ lineHeight: 2, textAlign: 'left', width: '100%' }}
            />
            <div className={styles.twoColumns}>
              <InputForm
                control={control}
                placeholder={Strings.description}
                type="text"
                name="description"
                containerStyle={{
                  width: '65%',
                  marginBottom: '25px',
                  height: '40px',
                  marginRight: '25%'
                }}
                error={errors.descriptionRequired?.message?.toString()}
                style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
              />
              <select>
                <option value="1">1</option>
              </select>
            </div>
            <div className={styles.twoColumns}>
              <InputForm
                control={control}
                placeholder={Strings.pacient}
                type="text"
                containerStyle={{
                  width: '95%',
                  marginBottom: '25px',
                  height: '40px'
                }}
                name="pacient"
                error={errors.pacientRequired?.message?.toString()}
                style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
              />
            </div>
            <div className={styles.twoColumns}>
              <InputForm
                control={control}
                placeholder={Strings.speciality}
                type="text"
                containerStyle={{
                  width: '42.5%',
                  marginBottom: '25px',
                  height: '40px',
                  marginRight: '10%'
                }}
                name="speciality"
                error={errors.specialityRequired?.message?.toString()}
                style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
              />
              <InputForm
                control={control}
                placeholder={Strings.specialist}
                type="text"
                containerStyle={{
                  width: '42.5%',
                  marginBottom: '25px',
                  height: '40px'
                }}
                name="specialist"
                error={errors.specialistRequired?.message?.toString()}
                style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
              />
            </div>
            <div className={styles.twoColumns}>
              <InputForm
                control={control}
                placeholder={Strings.date}
                type="date"
                name="date"
                containerStyle={{
                  width: '42.5%',
                  marginBottom: '25px',
                  height: '40px',
                  marginRight: '10%'
                }}
                error={errors.dateRequired?.message?.toString()}
                style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
              />
              <InputForm
                control={control}
                placeholder={Strings.hour}
                type="time"
                name="hour"
                containerStyle={{
                  width: '42.5%',
                  marginBottom: '25px',
                  height: '40px'
                }}
                error={errors.hourRequired?.message?.toString()}
                style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
              />
            </div>
            <div className={styles.observation}>
              <textarea
                placeholder="Observação"
                className={styles.observationInput}
                name="observation"
                style={{
                  width: '95%',
                  height: '100px',
                  fontSize: 12
                }}
              ></textarea>
            </div>
            <div className={styles.boxScheduleBtns}>
              <div className={styles.btnDefault}>
                <Button
                  title={Strings.save}
                  type="secondary"
                  // onClick={handleSubmit(handleLogin)}
                />
              </div>
              <div className={styles.btnDefault}>
                <Button
                  title={Strings.cancel}
                  type="cancel"
                  onClick={() => setStatusVisible(!statusVisible)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
