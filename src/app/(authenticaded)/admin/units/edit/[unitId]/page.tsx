'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { MenuTop } from 'components/MenuTop';
import ModalSuccess from 'components/ModalSuccess';
import { SelectForm } from 'components/SelectForm';
import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './unitsedit.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { getCep } from 'services/cep';
import { getUnitsById, updateUnitById } from 'services/units';
import { statusGeneral } from 'utils/enums';

type DataProps = {
  [name: string]: string | number;
};

export default function EditUnitPage() {
  const [showModalSuccess, setShowModalSuccess] =
    React.useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  const [cep, setCep] = React.useState('');
  const [loading, setLoading] = React.useState<boolean>(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    getUnitPerId();
  }, [params?.unitId]);

  React.useEffect(() => {
    if (cep.length === 9) {
      const responseCEP = getCep(cep.replace('-', ''));
      responseCEP.then((response) => {
        if (response !== null) {
          setValue('citieCode', response.city);
          setValue('state', response.state);
        }
      });
    }
  }, [cep]);

  async function getUnitPerId() {
    const response = await getUnitsById(Number(params?.unitId));
    const unit = response.data as DataUnitsModel;
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
    setValue('complement', unit.complement!);
    setValue('linkFacebook', unit.facebook_link!);
    setValue('linkInstagram', unit.instagram_link!);
    setValue('linkSite', unit.site_link!);
    setValue('status', unit.status + 1);

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
      citie_code: data.citieCode?.toString(),
      complement: data.complement?.toString(),
      facebook_link: data.linkFacebook?.toString(),
      instagram_link: data.linkInstagram?.toString(),
      site_link: data.linkSite.toString(),
      status: Number(data.status) - 1
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
      // console.log('Erro ao criar unidade!' + error);
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
                type="text"
                name="cnpj"
                mask={'cpfCnpj'}
                maxLength={18}
                control={control}
                error={errors.cnpj?.message}
                className={styles.inputEditUnit}
                containerStyle={{ width: '20%' }}
              />
              <InputForm
                placeholder={Strings.placeholderName}
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
                name="email"
                control={control}
                className={styles.inputEditUnit}
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
                className={styles.inputEditUnit}
                error={errors.phonePrimary?.message}
              />
              <InputForm
                placeholder={Strings.placeholderPhoneSecondary}
                type="text"
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
                name="latitude"
                control={control}
                containerStyle={{ width: '12%' }}
                className={styles.inputEditUnit}
                error={errors.latitude?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLongitude}
                type="text"
                name="longitude"
                control={control}
                containerStyle={{ width: '12%' }}
                className={styles.inputEditUnit}
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
            <div className={styles.marginBotton}>
              <InputForm
                placeholder={Strings.placeholderZipCode}
                type="text"
                name="zipCode"
                mask={'cep'}
                maxLength={9}
                getValue={setCep}
                control={control}
                containerStyle={{ width: '15%' }}
                className={styles.inputEditUnit}
                error={errors.zipCode?.message}
              />
              <InputForm
                placeholder={Strings.placeholderStreet}
                type="text"
                name="street"
                containerStyle={{ width: '20%' }}
                control={control}
                className={styles.inputEditUnit}
                error={errors.street?.message}
              />
              <InputForm
                placeholder={Strings.placeholderNumber}
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
                name="block"
                control={control}
                containerStyle={{ width: '10%' }}
                className={styles.inputEditUnit}
                error={errors.block?.message}
              />
              <InputForm
                placeholder={Strings.placeholderLot}
                type="text"
                name="lot"
                control={control}
                containerStyle={{ width: '10%' }}
                className={styles.inputEditUnit}
                error={errors.lot?.message}
              />
              <InputForm
                placeholder={Strings.placeholderComplement}
                type="text"
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
                  <InputForm
                    placeholder={Strings.placeholderState}
                    control={control}
                    name="state"
                    readonly={true}
                    error={errors.state?.message}
                    className={styles.inputEditUnit}
                    containerStyle={{ width: '30%' }}
                  />
                  <InputForm
                    placeholder={Strings.placeholderCity}
                    readonly={true}
                    control={control}
                    name="citieCode"
                    error={errors.city?.message}
                    className={styles.inputEditUnit}
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
                    className={styles.inputEditUnit}
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
                    className={styles.inputEditUnit}
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
                    className={styles.inputEditUnit}
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
    </React.Fragment>
  );
}
