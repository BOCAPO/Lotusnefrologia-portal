import { Strings } from 'assets/Strings';
import * as Yup from 'yup';

export const schema = Yup.object({
  cpf: Yup.string().required(Strings.schemaRequiredCpf),
  name: Yup.string().required(Strings.schemaNameRequired).max(100),
  email: Yup.string().required(Strings.schemaEmailRequired).max(100),
  phonePrimary: Yup.string().required(Strings.schemaPhonePrimaryRequired),
  state: Yup.string().required(Strings.schemaStateRequired).max(2),
  cityCode: Yup.string().required(Strings.schemaCityRequired).max(100),
  zipCode: Yup.string().required(Strings.schemaZipCodeRequired).max(9),
  street: Yup.string().required(Strings.schemaStreetRequired).max(100),
  block: Yup.string().max(10),
  lot: Yup.string().max(10),
  complement: Yup.string().max(100),
  status: Yup.string().required(Strings.schemaStatusRequired)
});
