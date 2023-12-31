export const cpfCnpjMask = (value: string) => {
  if (value.length > 14) {
    return cnpjMask(value);
  } else {
    return cpfMask(value);
  }
};

export const cnpjMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

export const cpfMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const dateMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1');
};

export const phoneMak = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})(\d+?)$/, '$1');
};

export const cellPhoneMak = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})(\d+?)$/, '$1');
};

export const cepMask = (value: string) => {
  return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})+?$/, '$1-$2');
};

export function coinMask(value: string, dollarSing: boolean) {
  value = value.replace(/\D/g, '');

  if (value === null || value === '') return '';

  value = value.replace(/(\d)(\d{2})$/, '$1,$2');
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');

  if (dollarSing) {
    return `R$ ${value}`;
  } else {
    return value;
  }
}

export function onlyLetters(value: string) {
  return value.replace(
    /[0-9!@#¨$%^&+×÷|©®™✓%℅√¶∆π¢€£¥₩°•○●□■♤♡◇♧☆¤《》¡¿þƴœæß§ðłɓŋ"*:;></?,.{}[\])(+=._-]+/g,
    ''
  );
}

export function coinMaskIntl(value: number) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
