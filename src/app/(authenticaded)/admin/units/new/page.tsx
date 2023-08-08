'use client';

import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
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
          <div style={{ marginBottom: '2vh' }}>
            <InputForm
              placeholder={Strings.placeholderCNJP}
              type="text"
              name="cnpj"
              control={control}
              error={errors.cnpj?.message}
              containerStyle={{ width: '20%' }}
              style={{ height: '40px', padding: '22px' }}
            />
            <InputForm
              placeholder={Strings.placeholderName}
              type="text"
              name="nome"
              control={control}
              containerStyle={{ width: '42.5%' }}
              style={{ height: '40px', padding: '22px' }}
              error={errors.nome?.message}
            />
            <InputForm
              placeholder={Strings.placeholderResponsable}
              type="text"
              name="responsavel"
              control={control}
              containerStyle={{ width: '32.5%' }}
              style={{ height: '40px', padding: '22px' }}
              error={errors.responsavel?.message}
            />
          </div>
          <div style={{ marginBottom: '2vh' }}>
            <InputForm
              placeholder={Strings.placeholderEmail}
              type="email"
              name="email"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              containerStyle={{ width: '30%' }}
              error={errors.email?.message}
            />
            <InputForm
              placeholder={Strings.placeholderPhonePrimay}
              type="text"
              name="telefonePrincipal"
              control={control}
              containerStyle={{ width: '20%' }}
              style={{ height: '40px', padding: '22px' }}
              error={errors.telefonePrincipal?.message}
            />
            <InputForm
              placeholder={Strings.placeholderPhoneSecondary}
              type="text"
              name="telefoneSecundario"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.telefoneSecundario?.message}
            />
            <InputForm
              placeholder={Strings.placeholderLatitude}
              type="text"
              name="latitude"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.latitude?.message}
            />
            <InputForm
              placeholder={Strings.placeholderLongitude}
              type="text"
              name="longitude"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.longitude?.message}
            />
            <Link href="/admin/units" target="_blank">
              <Icon
                typeIcon={TypeIcon.ExternalLink}
                color={Colors.greenDark}
                size={20}
              />
            </Link>
          </div>
          <div style={{ marginBottom: '2vh' }}>
            <InputForm
              placeholder={Strings.placeholderZipCode}
              type="text"
              name="cep"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.cep?.message}
            />
            <InputForm
              placeholder={Strings.placeholderStreet}
              type="text"
              name="logradouro"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.logradouro?.message}
            />
            <InputForm
              placeholder={Strings.placeholderNumber}
              type="text"
              name="numero"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.numero?.message}
            />
            <InputForm
              placeholder={Strings.placeholderBlock}
              type="text"
              name="quadra"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.quadra?.message}
            />
            <InputForm
              placeholder={Strings.placeholderLot}
              type="text"
              name="lote"
              control={control}
              style={{ height: '40px', padding: '22px' }}
              error={errors.lote?.message}
            />
            <InputForm
              placeholder={Strings.placeholderComplement}
              type="text"
              name="complemento"
              control={control}
              error={errors.complemento?.message}
              style={{ height: '40px', padding: '22px' }}
            />
          </div>
          <div style={{ marginBottom: '2vh', width: '100%' }}>
            <div style={{ width: '50%' }}>
              <div style={{ marginBottom: '2vh', width: '100%' }}>
                <select>
                  <option value="0">Selecione o estado</option>
                </select>
                <select>
                  <option value="0">Selecione a cidade</option>
                </select>
                <select>
                  <option value="0">Selecione o status</option>
                </select>
              </div>
              <div className={styles.linksUnit}>
                <InputForm
                  placeholder={Strings.placeholderLinkFacebook}
                  type="text"
                  name="linkFacebook"
                  control={control}
                  containerStyle={{ width: '95%' }}
                  style={{ height: '40px', padding: '22px' }}
                  error={errors.linkFacebook?.message}
                />
                <Icon
                  typeIcon={TypeIcon.ExternalLink}
                  color={Colors.greenDark}
                  size={20}
                />
              </div>
              <div className={styles.linksUnit}>
                <InputForm
                  placeholder={Strings.placeholderLinkInstagram}
                  type="text"
                  name="linkInstagram"
                  control={control}
                  containerStyle={{ width: '95%' }}
                  style={{ height: '40px', padding: '22px' }}
                  error={errors.linkInstagram?.message}
                />
                <Icon
                  typeIcon={TypeIcon.ExternalLink}
                  color={Colors.greenDark}
                  size={20}
                />
              </div>
              <div className={styles.linksUnit}>
                <InputForm
                  placeholder={Strings.placeholderLinkSite}
                  type="text"
                  name="linkSite"
                  control={control}
                  containerStyle={{ width: '95%' }}
                  style={{ height: '40px', padding: '22px' }}
                  error={errors.linkSite?.message}
                />
                <Icon
                  typeIcon={TypeIcon.ExternalLink}
                  color={Colors.greenDark}
                  size={20}
                />
              </div>
            </div>
            <div style={{ width: '50%' }}>
              <InputForm
                type="file"
                name="logo"
                control={control}
                error={errors.logo?.message}
              />
            </div>
          </div>
        </div>
        <footer>
          <div>
            <Button type="secondary" title={Strings.save} onClick={() => {}} />
            <Button type="cancel" title={Strings.cancel} onClick={() => {}} />
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
}
