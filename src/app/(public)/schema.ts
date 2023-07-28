import { Strings } from 'assets/Strings';
import * as Yup from 'yup';

export const schema = Yup.object({
  login: Yup.string().required(Strings.loginRequired).max(14),
  // .test(
  //   'cpfValidation',
  //   Strings.schemaValidationCpfCnpj,
  //   function (value: string) {
  //     if (value.length <= 14) {
  //       return checkCpfIsValid(value);
  //     } else {
  //       toast.error(Strings.schemaValidationCpfCnpj);
  //       return false;
  //     }
  //   }
  // ),
  password: Yup.string().required(Strings.passwordRequired)
});
