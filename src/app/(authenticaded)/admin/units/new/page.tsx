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
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getAllCities } from 'services/cities';
import { getAllStates } from 'services/states';
import { createUnit } from 'services/units';

type DataProps = {
  [name: string]: string | number;
};

export default function NewUnitPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getStates();
  }, []);

  async function getStates() {
    const response = await getAllStates();
    const statesUpdated = response.data.data as DataStatesModel[];
    setStates(statesUpdated.slice().sort((a, b) => a.UF.localeCompare(b.UF)));
  }

  async function getCities(state_code: string) {
    setIsLoadingCities(true);
    const response = await getAllCities();
    let citiesUpdated = response.data.data as DataCitiesModel[];
    citiesUpdated = citiesUpdated.filter(
      (city: DataCitiesModel) => city.state_code === state_code
    );
    setCities(
      citiesUpdated
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description))
    );
    setIsLoadingCities(false);
  }

  async function onSubmit(data: DataProps) {
    const newUnit: DataUnitsModel = {
      cnpj: data.cnpj.toString(),
      name: data.nome.toString(),
      responsible: data.responsavel.toString(),
      email: data.email.toString(),
      phone_primary: data.telefonePrincipal.toString(),
      phone_secondary: data.telefoneSecundario.toString(),
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString(),
      zip_code: data.cep.toString(),
      citie_code: data.endereco.toString(),
      street: data.rua.toString(),
      number: data.numero.toString(),
      block: data.bloco.toString(),
      lot: data.lote.toString(),
      complement: data.complemento.toString(),
      facebook_link: data.facebook.toString(),
      instagram_link: data.instagram.toString(),
      site_link: data.site.toString(),
      status: Number(data.status),
      created_at: String(new Date()),
      updated_at: String(new Date())
    };

    try {
      const response = await createUnit(newUnit);
      if (response !== null) alert('Unidade criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar unidade!');
    }
  }

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
              <div
                style={{ marginBottom: '2vh', width: '100%' }}
                className={styles.newUnitDataGeografic}
              >
                <select
                  onChange={(event) => {
                    getCities(event.target.value);
                  }}
                >
                  <option value="0">Selecione o estado</option>
                  {states &&
                    states.map((state: DataStatesModel) => (
                      <option key={state.code} value={state.code}>
                        {' '}
                        {state.UF}{' '}
                      </option>
                    ))}
                </select>
                <select>
                  {isLoadingCities ? (
                    <option value="0">Carregando...</option>
                  ) : (
                    <>
                      <option value="0">Selecione a cidade</option>
                      {cities &&
                        cities.map((city: DataCitiesModel) => (
                          <option key={city.code} value={city.code}>
                            {city.description}
                          </option>
                        ))}
                    </>
                  )}
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
                <Link href="/admin/units" target="_blank">
                  <Icon
                    typeIcon={TypeIcon.ExternalLink}
                    color={Colors.greenDark}
                    size={20}
                  />
                </Link>
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
            <div style={{ width: '43%', marginLeft: '2%', height: '100%' }}>
              <InputForm
                type="file"
                name="logo"
                control={control}
                style={{ height: '27vh' }}
                error={errors.logo?.message}
              />
            </div>
          </div>
        </div>
        <div className={styles.footerNewUnit}>
          <div className={styles.btnSaveNewUnit}>
            <Button
              type="secondary"
              title={Strings.save}
              onClick={() => {
                handleSubmit(onSubmit);
              }}
            />
          </div>
          <div className={styles.btnCancelNewUnit}>
            <Button type="cancel" title={Strings.cancel} onClick={() => {}} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
