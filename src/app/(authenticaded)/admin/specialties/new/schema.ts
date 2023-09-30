import { Strings } from 'assets/Strings';
import * as Yup from 'yup';

export const schema = Yup.object({
  specialty: Yup.string().required(Strings.schemaDescriptionRequired),
  status: Yup.string().required(Strings.schemaStatusRequired)
});
