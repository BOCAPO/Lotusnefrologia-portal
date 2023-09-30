import { Strings } from 'assets/Strings';
import * as Yup from 'yup';

export const schema = Yup.object({
  unit: Yup.string().required(Strings.schemaRequiredUnit),
  supplier: Yup.string().required(Strings.schemaRequiredSupplier),
  date: Yup.string().required(Strings.schemaRequiredDateInvoice),
  cnpj: Yup.string().required(Strings.schemaRequiredCnpj),
  invoice: Yup.string().required(Strings.schemaRequiredInvoice),
  series: Yup.string().required(Strings.schemaSeriesRequired)
});
