import { Strings } from 'assets/Strings';
import * as Yup from 'yup';

export const schema = Yup.object({
  cnpj: Yup.string().required(Strings.schemaRequiredCnpj),
  name: Yup.string().required(Strings.schemaNameRequired).max(100),
  responsible: Yup.string()
    .required(Strings.schemaResponsibleRequired)
    .max(100),
  email: Yup.string().required(Strings.schemaEmailRequired).max(100),
  phonePrimary: Yup.string().required(Strings.schemaPhonePrimaryRequired),
  latitude: Yup.string().required(Strings.schemaLatitudeRequired).max(20),
  longitude: Yup.string().required(Strings.schemaLongitudeRequired).max(20),
  cityCode: Yup.string().required(Strings.schemaCityRequired).max(100),
  zipCode: Yup.string().required(Strings.schemaZipCodeRequired).max(9),
  street: Yup.string().required(Strings.schemaStreetRequired).max(100),
  block: Yup.string().max(10),
  lot: Yup.string().max(10),
  complement: Yup.string().max(100),
  status: Yup.string().required(Strings.schemaStatusRequired),
  state: Yup.string().required(Strings.schemaStateRequired).max(2)
});
