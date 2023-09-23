'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';

import styles from './menusnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

type DataProps = {
  [name: string]: string | number;
};

export default function NewMenuPage(): JSX.Element {
  const [optionOrganizedBy, setOptionOrganizedBy] = React.useState<string>('');
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });
  return (
    <React.Fragment>
      <MenuTop />
      <div className="d-flex">
        <div className={styles.bodyFormFirstColumn}>
          <p className={styles.titlePeriod}>{Strings.period}</p>
          <div className="d-flex flex-column w-100 pt-5">
            <p className={styles.subtitlePeriod}>
              {Strings.organizedBy}: {optionOrganizedBy}
            </p>
            <div className="d-flex flex-row w-100 justify-content-around mt-4">
              <div className={styles.w45Period}>
                <Button
                  title="Semanal"
                  type="primary"
                  onClick={() => {
                    setOptionOrganizedBy('Semanal');
                  }}
                />
              </div>
              <div className={styles.w45Period}>
                <Button
                  title="Diário"
                  type="button"
                  onClick={() => {
                    setOptionOrganizedBy('Diário');
                  }}
                />
              </div>
            </div>
            <div className="my-5">
              <label>
                {optionOrganizedBy === 'Semanal' ? (
                  <p className={styles.subtitlePeriod}>{Strings.startDate}</p>
                ) : (
                  <p className={styles.subtitlePeriod}>{Strings.date}</p>
                )}
              </label>
              <InputForm
                control={control}
                type="date"
                name="startDate"
                error={errors.startDate?.message}
                className={styles.inputDateMenu}
              />

              {optionOrganizedBy === 'Semanal' ? (
                <React.Fragment>
                  <label className="mt-5">
                    <p className={styles.subtitlePeriod}>{Strings.endDate}</p>
                  </label>
                  <InputForm
                    control={control}
                    type="date"
                    name="endDate"
                    error={errors.startDate?.message}
                    className={styles.inputDateMenu}
                  />
                </React.Fragment>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className={styles.bodyFormSecondColumn}>
          <div className="w-100">
            <p className={styles.titlePeriod}>{Strings.planningOfTheMenu}</p>
          </div>
          <div className="w-100 d-flex">
            <div className={styles.searchBar}>
              <input type="search" placeholder={Strings.search} />
              <div className={styles.iconSearch}>
                <Icon
                  typeIcon={TypeIcon.Search}
                  size={20}
                  color={Colors.gray60}
                  callback={() => {}}
                />
              </div>
            </div>
            <div className="mx-5">
              <p className={styles.subtitlePeriod}>{Strings.periodSelected}</p>
              <p className={styles.subtitlePeriod}>
                <span>
                  {Strings.status}: <strong>{Strings.planning}</strong>
                </span>
              </p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </React.Fragment>
  );
}
