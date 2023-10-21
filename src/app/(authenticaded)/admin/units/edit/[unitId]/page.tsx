'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalError from 'components/ModalError';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './unitsedit.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataCitiesModel } from 'models/DataCitiesModel';
import { DataStateModel, DataStatesModel } from 'models/DataStatesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getAllCities } from 'services/cities';
import { getAllStates } from 'services/states';
import { getUnitsById, updateUnitById } from 'services/units';
import { statusGeneral } from 'utils/enums';
import { buscarInformacoesCEP } from 'utils/helpers';

type DataProps = {
  [name: string]: string | number;
};

export default function EditUnitPage() {
  const [states, setStates] = React.useState<any>(null);
  const [cities, setCities] = React.useState<any>(null);
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const [showModalError, setShowModalError] = React.useState<boolean>(false);
  const router = useRouter();
  const [cep, setCep] = React.useState<any>(null);
  const params = useParams();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [latitude, setLatitude] = React.useState<string>('');
  const [longitude, setLongitude] = React.useState<string>('');
  const [linkFacebook, setLinkFacebook] = React.useState<string>('');
  const [linkInstagram, setLinkInstagram] = React.useState<string>('');
  const [isLoadingCities, setIsLoadingCities] = React.useState<boolean>(false);
  const [linkSite, setLinkSite] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getStates();
    getUnitPerId();
  }, [params?.unitId]);

  async function getStates() {
    const response = await getAllStates();
    const statesUpdated = response.data as unknown as DataStatesModel;
    setStates(
      statesUpdated.sort((a, b) => a.description.localeCompare(b.description))
    );
  }

  async function getCities(state_code: string) {
    setIsLoadingCities(true);
    const response = await getAllCities();
    let citiesUpdated = response.data as unknown as DataCitiesModel[];
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

  async function getUnitPerId() {
    const response = await getUnitsById(Number(params?.unitId));
    const unit = response.data as DataUnitsModel;
    getCities(unit.city?.state_code !== undefined ? unit.city.state_code : '');
    setValue('cnpj', unit.cnpj);
    setValue('name', unit.name);
    setValue('responsible', unit.responsible);
    setValue('email', unit.email);
    setValue('phonePrimary', unit.phone_primary);
    setValue('phoneSecondary', unit.phone_secondary);
    setValue('latitude', unit.latitude);
    setValue('longitude', unit.longitude);
    setValue('zipCode', unit.zip_code);
    setValue('street', unit.street);
    setValue('number', unit.number);
    setValue('block', unit.block);
    setValue('lot', unit.lot);
    setValue('cityCode', unit.city?.code !== undefined ? unit.city.code : '');
    setValue(
      'state',
      unit.city?.state_code !== undefined ? unit.city.state_code : ''
    );
    setValue('complement', unit.complement!);
    setValue('linkFacebook', unit.facebook_link!);
    setValue('linkInstagram', unit.instagram_link!);
    setValue('linkSite', unit.site_link!);
    setValue('status', unit.status + 1);
    setLatitude(unit.latitude);
    setLongitude(unit.longitude);
    setLinkFacebook(unit.facebook_link!);
    setLinkInstagram(unit.instagram_link!);
    setLinkSite(unit.site_link!);
    setLoading(false);
  }

  async function onSubmit(data: DataProps) {
    const editUnit: DataUnitsModel = {
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
      city_code: data.cityCode?.toString(),
      complement: data.complement?.toString(),
      facebook_link: data.linkFacebook?.toString(),
      instagram_link: data.linkInstagram?.toString(),
      site_link: data.linkSite.toString(),
      status: Number(data.status) - 1,
      city_name: '',
      state_name: ''
    };

    try {
      const response = await updateUnitById(Number(params?.unitId), editUnit);
      if (response !== null) {
        setShowModalSuccess(true);
        setTimeout(() => {
          router.back();
        }, 3000);
      }
    } catch (error) {
      setShowModalError(true);
      setTimeout(() => {
        setShowModalError(false);
      }, 3000);
    }
  }

  async function getDataCEP(cep: string) {
    const result = await buscarInformacoesCEP(cep);
    if (result !== null) {
      setValue('street', result.logradouro.toString());
      states.filter((state: DataStateModel) => {
        if (state.UF === result.uf) {
          setValue('state', state.code);
          getCities(state.code.toString());
          setValue('cityCode', result.ibge);
        }
      });
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      {loading ? (
        <SpinnerLoading />
      ) : (
        <div className={styles.bodyEditUnit}>
          <div className={styles.headerEditUnit}>
            <SmallMediumText
              text={Strings.editUnit}
              bold={true}
              color={Colors.gray90}
              style={{ lineHeight: '3px' }}
            />
          </div>
          <div className={styles.formEditUnit}>
            <div className={styles.marginBotton}>
              <InputForm
                placeholder={Strings.placeholderCNJP}
                label={Strings.labelCNPJ}
                type="text"
                name="cnpj"
                mask={'cpfCnpj'}
                readonly={true}
                maxLength={18}
                control={control}
                error={errors.cnpj?.message}
                className={styles.inputEditUnit}
                containerStyle={{ width: '20%' }}
              />
              <InputForm
                placeholder={Strings.placeholderName}
                label={Strings.labelName}
                type="text"
                name="name"
                control={control}
                containerStyle={{ width: '42.5%' }}
                className={styles.inputEditUnit}
                error={errors.name?.message}
              />
              <InputForm
                placeholder={Strings.placeholderResponsable}
                type="text"
                label={Strings.labelResponsable}
                name="responsible"
                control={control}
                containerStyle={{ width: '32.5%' }}
                className={styles.inputEditUnit}
                error={errors.responsible?.message}
              />
            </div>
            <div className={styles.marginBotton}>
              <InputForm
                placeholder={Strings.placeholderEmail}
                type="email"
                label={Strings.labelEmail}
                name="email"
                control={control}
                className={styles.inputEditUnit}
                containerStyle={{ width: '25%' }}
                error={errors.email?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhonePrimary}
                label={Strings.labelPhone}
                type="text"
                name="phonePrimary"
                control={control}
                mask={'phone'}
                containerStyle={{ width: '15%' }}
                className={styles.inputEditUnit}
                error={errors.phonePrimary?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhoneSecondary}
                type="text"
                label={Strings.labelPhone}
                name="phoneSecondary"
                control={control}
                mask={'phone'}
                containerStyle={{ width: '15%' }}
                className={styles.inputEditUnit}
                error={errors.phoneSecondary?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLatitude}
                type="text"
                label={Strings.labelLatitude}
                name="latitude"
                control={control}
                containerStyle={{ width: '12%' }}
                className={styles.inputEditUnit}
                error={errors.latitude?.message}
                getValue={setLatitude}
              />
              <InputForm
                placeholder={Strings.placeholderLongitude}
                type="text"
                label={Strings.labelLongitude}
                name="longitude"
                control={control}
                containerStyle={{ width: '12%' }}
                className={styles.inputEditUnit}
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
                label={Strings.labelZipCode}
                type="text"
                name="zipCode"
                mask={'cep'}
                maxLength={9}
                control={control}
                containerStyle={{ width: '15%' }}
                className={styles.inputEditUnit}
                error={errors.zipCode?.message}
                getValue={setCep}
                onBlur={() => {
                  getDataCEP(cep);
                }}
              />
              <InputForm
                placeholder={Strings.placeholderStreet}
                type="text"
                name="street"
                containerStyle={{ width: '20%' }}
                control={control}
                label={Strings.labelStreet}
                className={styles.inputEditUnit}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
                label={Strings.labelNumber}
                type="text"
                name="number"
                control={control}
                containerStyle={{ width: '10%' }}
                className={styles.inputEditUnit}
                error={errors.number?.message}
              />
              <InputForm
                placeholder={Strings.placeholderBlock}
                type="text"
                label={Strings.labelBlock}
                name="block"
                control={control}
                containerStyle={{ width: '10%' }}
                className={styles.inputEditUnit}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                type="text"
                label={Strings.labelLot}
                name="lot"
                control={control}
                containerStyle={{ width: '10%' }}
                className={styles.inputEditUnit}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
                type="text"
                label={Strings.labelComplement}
                name="complement"
                control={control}
                error={errors.complement?.message}
                className={styles.inputEditUnit}
              />
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ width: '50%' }}>
                <div
                  style={{ width: '100%' }}
                  className={styles.EditUnitDataGeografic}
                >
                  <SelectForm
                    control={control}
                    item={Strings.labelState}
                    name="state"
                    disabled={true}
                    data={states !== null ? states : null}
                    onSelectChange={handleStateCode}
                    error={errors.state?.message}
                    containerStyle={{ width: '30%' }}
                  />
                  <SelectForm
                    control={control}
                    item={Strings.labelCity}
                    name="cityCode"
                    disabled={true}
                    data={cities !== null ? cities : null}
                    isLoading={isLoadingCities}
                    error={errors.city?.message}
                    containerStyle={{ width: '30%' }}
                  />
                  <SelectForm
                    control={control}
                    item={Strings.status}
                    name="status"
                    data={statusGeneral}
                    error={errors.status?.message}
                    containerStyle={{ width: '30%' }}
                  />
                </div>
                <div className={styles.linksUnit}>
                  <InputForm
                    placeholder={Strings.placeholderLinkFacebook}
                    label={Strings.labelLinkFacebook}
                    type="text"
                    name="linkFacebook"
                    control={control}
                    containerStyle={{ width: '95%' }}
                    className={styles.inputEditUnit}
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
                    label={Strings.labelLinkInstagram}
                    name="linkInstagram"
                    control={control}
                    containerStyle={{ width: '95%' }}
                    className={styles.inputEditUnit}
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
                    label={Strings.labelLinkSite}
                    name="linkSite"
                    control={control}
                    containerStyle={{ width: '95%' }}
                    className={styles.inputEditUnit}
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
          <div className={styles.footerEditUnit}>
            <div className={styles.btnSaveEditUnit}>
              <Button
                type="secondary"
                title={Strings.edit}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className={styles.btnCancelEditUnit}>
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
      )}
      <ModalSuccess
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        message={Strings.messageSuccessUpdateUnit}
      />
      <ModalError
        show={showModalError}
        onHide={() => setShowModalError(false)}
        message={Strings.messageErrorUpdateUnit}
      />
    </React.Fragment>
  );
}
