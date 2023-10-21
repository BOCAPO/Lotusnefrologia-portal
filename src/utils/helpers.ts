import { addDays, format } from 'date-fns';

export default function formatDate(inputDateStr: string) {
  const inputDate = new Date(inputDateStr);
  if (!isNaN(inputDate.getTime())) {
    const dateWithOneDayAdded = addDays(inputDate, 1);
    const formattedDate = format(dateWithOneDayAdded, 'dd/MM/yyyy');
    return formattedDate;
  } else {
    return inputDateStr;
  }
}
interface CepData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
}

export async function buscarInformacoesCEP(
  cep: string
): Promise<CepData | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error('Não foi possível obter os dados do CEP.');
    }
    const data = await response.json();
    if (data.erro) {
      return null;
    }
    const cepData: CepData = {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge
    };

    return cepData;
  } catch (error) {
    return null;
  }
}
