import { Strings } from 'assets/Strings';
import * as Yup from 'yup';

export const schema = Yup.object({
  cpf: Yup.string().required(Strings.schemaRequiredCpf).max(14),
  name: Yup.string().required(Strings.schemaNameRequired).max(100),
  unit: Yup.string().required(Strings.schemaRequiredUnit),
  email: Yup.string().required(Strings.schemaEmailRequired).max(100),
  phonePrimary: Yup.string().required(Strings.schemaPhonePrimaryRequired),
  state: Yup.string().required(Strings.schemaStateRequired),
  citieCode: Yup.string().required(Strings.schemaCityRequired),
  zipCode: Yup.string().required(Strings.schemaZipCodeRequired).max(9),
  street: Yup.string().required(Strings.schemaStreetRequired).max(100),
  block: Yup.string().max(10),
  lot: Yup.string().max(10),
  complement: Yup.string().max(100),
  birthDate: Yup.string().required(Strings.schemaBirthDateRequired),
  status: Yup.string().required(Strings.schemaStatusRequired)
});
