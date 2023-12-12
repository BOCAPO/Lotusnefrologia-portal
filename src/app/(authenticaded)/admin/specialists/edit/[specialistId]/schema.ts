import { Strings } from 'assets/Strings';
import * as Yup from 'yup';

export const schema = Yup.object({
  cpf: Yup.string().required(Strings.schemaRequiredCpf),
  name: Yup.string().required(Strings.schemaNameRequired),
  email: Yup.string().required(Strings.schemaEmailRequired),
  phonePrimary: Yup.string().required(Strings.schemaPhonePrimaryRequired),
  zipCode: Yup.string().required(Strings.schemaZipCodeRequired),
  street: Yup.string().required(Strings.schemaStreetRequired),
  citieCode: Yup.string().required(Strings.schemaStateRequired),
  state: Yup.string().required(Strings.schemaStateRequired),
  status: Yup.string().required(Strings.schemaStatusRequired)
});
