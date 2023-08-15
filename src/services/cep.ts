import cep from 'cep-promise';

export async function getCep(cepConsult: string) {
  return await cep(cepConsult);
}
