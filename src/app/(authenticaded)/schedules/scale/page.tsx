'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { FormTwoColumns } from 'components/FormTwoColumns';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import { LitteText, SmallMediumText } from 'components/Text';

import styles from './scale.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataScaleModel } from 'models/DataScaleModel';
import dataScale from 'tests/mocks/dataScale'; //mock de teste de dados

type DataProps = {
  [name: string]: string | number;
};

export default function ScalePage(): JSX.Element {
  const [selectedItem, setSelectedItem] = React.useState<string>(''); //array de string vazio

  function handleItemSelection(item: DataScaleModel) {
    setSelectedItem(item.name);
  }

  const {
    control,
    // handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyScale}>
        <div style={{ width: '30%' }}>
          <FormTwoColumns
            headers={Strings.headersScale}
            data={dataScale}
            onItemClick={handleItemSelection}
          />
        </div>
        <div className={styles.formInserScale}>
          <div className={styles.titleScale}>
            <SmallMediumText
              text={Strings.scheduleConfirmation + ': ' + `${selectedItem}`}
              style={{ textAlign: 'left', lineHeight: 2 }}
              bold={true}
              color={Colors.gray90}
            />
          </div>
          <div className={styles.bodyScale}>
            {selectedItem === '' ? (
              <LitteText
                text={Strings.selectSpecialist}
                style={{ textAlign: 'center', lineHeight: 2, opacity: 0.5 }}
                bold={true}
                color={Colors.gray90}
              />
            ) : (
              <div className={styles.scheduleScale}>
                <InputForm
                  control={control}
                  name="initialHour"
                  type="time"
                  containerStyle={{ width: '30%' }}
                  placeholder={Strings.date}
                  error={errors.initialHour?.message?.toString()}
                />
                <InputForm
                  control={control}
                  name="finalHour"
                  type="time"
                  placeholder={Strings.hour}
                  containerStyle={{ width: '30%' }}
                  error={errors.finalHour?.message?.toString()}
                />
                <select>
                  {Strings.timeOfAttendance.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
                <Button
                  title=""
                  type="secondary"
                  onClick={() => {}}
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  icon={
                    <Icon
                      typeIcon={TypeIcon.Search}
                      size={20}
                      color={Colors.gray60}
                      style={{ marginRight: 5 }}
                    />
                  }
                />
              </div>
            )}
          </div>
          <div className={styles.footerScale}>
            <div>
              <Button
                title={Strings.save}
                type="secondary"
                onClick={() => {}}
              />
            </div>
            <div>
              <Button
                title={Strings.cancel}
                type="cancel"
                onClick={() => {
                  setSelectedItem('');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
