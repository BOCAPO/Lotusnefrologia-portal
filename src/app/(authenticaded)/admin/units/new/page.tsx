'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
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
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function NewUnitPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [latitude, setLatitude] = React.useState<string>('');
  const [longitude, setLongitude] = React.useState<string>('');
  const [linkFacebook, setLinkFacebook] = React.useState<string>('');
  const [linkInstagram, setLinkInstagram] = React.useState<string>('');
  const [linkSite, setLinkSite] = React.useState<string>('');

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

  const handleStateCode = (selectedStateCode: any) => {
    getCities(selectedStateCode.toString());
  };

  async function onSubmit(data: DataProps) {
    const newUnit: DataUnitsModel = {
      cnpj: data.cnpj.toString(),
      name: data.name.toString(),
      responsible: data.responsible.toString(),
      email: data.email.toString(),
      phone_primary: data.phonePrimary.toString(),
      phone_secondary: data.phoneSecondary.toString(),
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString(),
      zip_code: data.zipCode.toString(),
      street: data.street.toString(),
      number: data.number.toString(),
      block: data.block.toString(),
      lot: data.lot.toString(),
      citie_code: data.citieCode.toString(),
      complement: data.complement.toString(),
      facebook_link: data.linkFacebook.toString(),
      instagram_link: data.linkInstagram.toString(),
      site_link: data.linkSite.toString(),
      status: Number(data.status) - 1
    };

    try {
      const response = await createUnit(newUnit);
      if (response !== null) {
        setShowModalSuccess(true);
        setTimeout(() => {
          router.back();
        }, 2500);
      }
    } catch (error) {
      // console.log('Erro ao criar unidade!' + error);
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyNewUnit}>
        <div className={styles.headerNewUnit}>
          <SmallMediumText
            text={Strings.insertUnit}
            bold={true}
            color={Colors.gray90}
            style={{ lineHeight: '3px' }}
          />
        </div>
        <div className={styles.formNewUnit}>
          <div className={styles.marginBotton}>
            <InputForm
              placeholder={Strings.placeholderCNJP}
              type="text"
              name="cnpj"
              mask={'cpfCnpj'}
              maxLength={18}
              control={control}
              error={errors.cnpj?.message}
              className={styles.inputNewUnit}
              containerStyle={{ width: '20%' }}
            />
            <InputForm
              placeholder={Strings.placeholderName}
              type="text"
              name="name"
              control={control}
              containerStyle={{ width: '42.5%' }}
              className={styles.inputNewUnit}
              error={errors.name?.message}
            />
            <InputForm
              placeholder={Strings.placeholderResponsable}
              type="text"
              name="responsible"
              control={control}
              containerStyle={{ width: '32.5%' }}
              className={styles.inputNewUnit}
              error={errors.responsible?.message}
            />
          </div>
          <div className={styles.marginBotton}>
            <InputForm
              placeholder={Strings.placeholderEmail}
              type="email"
              name="email"
              control={control}
              className={styles.inputNewUnit}
              containerStyle={{ width: '25%' }}
              error={errors.email?.message}
            />
            <InputForm
              placeholder={Strings.placeholderPhonePrimay}
              type="text"
              name="phonePrimary"
              control={control}
              mask={'phone'}
              containerStyle={{ width: '15%' }}
              className={styles.inputNewUnit}
              error={errors.phonePrimary?.message}
            />
            <InputForm
              placeholder={Strings.placeholderPhoneSecondary}
              type="text"
              name="phoneSecondary"
              control={control}
              mask={'phone'}
              containerStyle={{ width: '15%' }}
              className={styles.inputNewUnit}
              error={errors.phoneSecondary?.message}
            />
            <InputForm
              placeholder={Strings.placeholderLatitude}
              type="text"
              name="latitude"
              control={control}
              containerStyle={{ width: '12%' }}
              className={styles.inputNewUnit}
              error={errors.latitude?.message}
              getValue={setLatitude}
            />
            <InputForm
              placeholder={Strings.placeholderLongitude}
              type="text"
              name="longitude"
              control={control}
              containerStyle={{ width: '12%' }}
              className={styles.inputNewUnit}
              error={errors.longitude?.message}
              getValue={setLongitude}
            />
            <Link
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
            >
              <Icon
                typeIcon={TypeIcon.ExternalLink}
                color={Colors.greenDark}
                size={20}
              />
            </Link>
          </div>
          <div className={styles.marginBotton}>
            <InputForm
              placeholder={Strings.placeholderZipCode}
              type="text"
              name="zipCode"
              mask={'cep'}
              maxLength={9}
              control={control}
              containerStyle={{ width: '15%' }}
              className={styles.inputNewUnit}
              error={errors.zipCode?.message}
            />
            <InputForm
              placeholder={Strings.placeholderStreet}
              type="text"
              name="street"
              containerStyle={{ width: '20%' }}
              control={control}
              className={styles.inputNewUnit}
              error={errors.street?.message}
            />
            <InputForm
              placeholder={Strings.placeholderNumber}
              type="text"
              name="number"
              control={control}
              containerStyle={{ width: '10%' }}
              className={styles.inputNewUnit}
              error={errors.number?.message}
            />
            <InputForm
              placeholder={Strings.placeholderBlock}
              type="text"
              name="block"
              control={control}
              containerStyle={{ width: '10%' }}
              className={styles.inputNewUnit}
              error={errors.block?.message}
            />
            <InputForm
              placeholder={Strings.placeholderLot}
              type="text"
              name="lot"
              control={control}
              containerStyle={{ width: '10%' }}
              className={styles.inputNewUnit}
              error={errors.lot?.message}
            />
            <InputForm
              placeholder={Strings.placeholderComplement}
              type="text"
              name="complement"
              control={control}
              error={errors.complement?.message}
              className={styles.inputNewUnit}
            />
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ width: '50%' }}>
              <div
                style={{ width: '100%' }}
                className={styles.newUnitDataGeografic}
              >
                <SelectForm
                  control={control}
                  name="state"
                  data={states}
                  error={errors.state?.message}
                  onSelectChange={handleStateCode}
                  containerStyle={{ width: '30%' }}
                />
                <SelectForm
                  control={control}
                  name="citieCode"
                  data={cities !== null ? cities : null}
                  isLoading={isLoadingCities}
                  error={errors.city?.message}
                  containerStyle={{ width: '30%' }}
                />
                <SelectForm
                  control={control}
                  name="status"
                  data={statusGeneral}
                  error={errors.status?.message}
                  containerStyle={{ width: '30%' }}
                />
              </div>
              <div className={styles.linksUnit}>
                <InputForm
                  placeholder={Strings.placeholderLinkFacebook}
                  type="text"
                  name="linkFacebook"
                  control={control}
                  containerStyle={{ width: '95%' }}
                  className={styles.inputNewUnit}
                  error={errors.linkFacebook?.message}
                  getValue={setLinkFacebook}
                />
                <Link href={linkFacebook} target="_blank">
                  <Icon
                    typeIcon={TypeIcon.ExternalLink}
                    color={Colors.greenDark}
                    size={20}
                  />
                </Link>
              </div>
              <div className={styles.linksUnit}>
                <InputForm
                  placeholder={Strings.placeholderLinkInstagram}
                  type="text"
                  name="linkInstagram"
                  control={control}
                  containerStyle={{ width: '95%' }}
                  className={styles.inputNewUnit}
                  error={errors.linkInstagram?.message}
                  getValue={setLinkInstagram}
                />
                <Link href={linkInstagram} target="_blank">
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
                  className={styles.inputNewUnit}
                  error={errors.linkSite?.message}
                  getValue={setLinkSite}
                />
                <Link href={linkSite} target="_blank">
                  <Icon
                    typeIcon={TypeIcon.ExternalLink}
                    color={Colors.greenDark}
                    size={20}
                  />
                </Link>
              </div>
            </div>
            <div style={{ width: '43%', marginLeft: '2%', height: '100%' }}>
              {/* <InputForm
                type="file"
                name="logo"
                control={control}
                style={{ height: '27vh' }}
                error={errors.logo?.message}
              /> */}
            </div>
          </div>
        </div>
        <div className={styles.footerNewUnit}>
          <div className={styles.btnSaveNewUnit}>
            <Button
              type="secondary"
              title={Strings.save}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
          <div className={styles.btnCancelNewUnit}>
            <Button
              type="cancel"
              title={Strings.cancel}
              onClick={() => {
                router.back();
              }}
            />
          </div>
        </div>
      </div>
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={Strings.messageSuccessInsertUnit}
      />
    </React.Fragment>
  );
}
