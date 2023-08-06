'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import { SmallMediumText } from 'components/Text';

import styles from './unitsnew.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

type DataProps = {
  [name: string]: string | number;
};

export default function NewUnitPage() {
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
      <div className={styles.bodyNewUnit}>
        <div className={styles.headerNewUnit}>
          <SmallMediumText
            text={Strings.inserUnit}
            bold={true}
            color={Colors.gray90}
            style={{ lineHeight: '5px' }}
          />
        </div>
        <div className={styles.formNewUnit}>
          <div>
            <InputForm
              placeholder="Cnpj"
              type="text"
              name="cnpj"
              control={control}
              error={errors.cnpj?.message}
              containerStyle={{ width: '20%' }}
              style={{ height: '40px', padding: '0 10px' }}
            />
            <InputForm
              placeholder="Nome"
              type="text"
              name="nome"
              control={control}
              containerStyle={{ width: '42.5%' }}
              style={{ height: '40px', padding: '0 10px' }}
              error={errors.nome?.message}
            />
            <InputForm
              placeholder="Responsável"
              type="text"
              name="responsavel"
              control={control}
              containerStyle={{ width: '32.5%' }}
              style={{ height: '40px', padding: '0 10px' }}
              error={errors.responsavel?.message}
            />
          </div>
          <div>
            <InputForm
              placeholder="E-mail"
              type="email"
              name="email"
              control={control}
              style={{ height: '40px' }}
              error={errors.email?.message}
            />
            <InputForm
              placeholder="Telefone Principal"
              type="text"
              name="telefonePrincipal"
              control={control}
              style={{ height: '40px' }}
              error={errors.telefonePrincipal?.message}
            />
            <InputForm
              placeholder="Telefone Secundário"
              type="text"
              name="telefoneSecundario"
              control={control}
              style={{ height: '40px' }}
              error={errors.telefoneSecundario?.message}
            />
            <InputForm
              placeholder="Latitude"
              type="text"
              name="latitude"
              control={control}
              style={{ height: '40px' }}
              error={errors.latitude?.message}
            />
            <InputForm
              placeholder="Longitude"
              type="text"
              name="longitude"
              control={control}
              style={{ height: '40px' }}
              error={errors.longitude?.message}
            />
            <Icon
              typeIcon={TypeIcon.ExternalLink}
              color={Colors.greenDark}
              size={20}
            />
          </div>
          <div>
            <InputForm
              placeholder="CEP"
              type="text"
              name="cep"
              control={control}
              style={{ height: '40px' }}
              error={errors.cep?.message}
            />
            <InputForm
              placeholder="Logradouro"
              type="text"
              name="logradouro"
              control={control}
              style={{ height: '40px' }}
              error={errors.logradouro?.message}
            />
            <InputForm
              placeholder="Número"
              type="text"
              name="numero"
              control={control}
              style={{ height: '40px' }}
              error={errors.numero?.message}
            />
            <InputForm
              placeholder="Quadra"
              type="text"
              name="quadra"
              control={control}
              style={{ height: '40px' }}
              error={errors.quadra?.message}
            />
            <InputForm
              placeholder="Lote"
              type="text"
              name="lote"
              control={control}
              style={{ height: '40px' }}
              error={errors.lote?.message}
            />
            <InputForm
              placeholder="Complemento"
              type="text"
              name="complemento"
              control={control}
              error={errors.complemento?.message}
              style={{ height: '40px' }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}