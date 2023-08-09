import { format } from 'date-fns';
import moment from 'moment';

const regexNotPermittedSpecialCharacters =
  /[0-9!@#¨$%^&+×÷|©®™✓%℅√¶∆π¢€£¥₩°•○●□■♤♡◇♧☆¤《》¡¿þƴœæß§ðłɓŋ"*:;></?,.{}[\])(+=._-]+$/;

const regexPhoneStructure =
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/;

const regexCellPhoneStructure =
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{4})-?(\d{4}))$/;

const regexCepStructure = /^[0-9]{5}-[0-9]{3}$/;

function getFirPartCpfIsValid(sum: number, cpf: string) {
  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  return (sum * 10) % 11;
}

function cpfVerifyNumbersEquals(cpf: string) {
  const numbers = cpf.split('');

  const equals = numbers.every((number) => number === numbers[0]);

  if (equals) {
    return false;
  } else {
    return true;
  }
}

function cpfVerifyDigit(cpf: string, rest: number, n: number, v: number) {
  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(n, v))) {
    return false;
  } else {
    return true;
  }
}

function checkCpfIsValid(cpf: string) {
  cpf = cpf.replace(/\D/g, '');

  let sum = 0;
  let rest;

  if (!cpfVerifyNumbersEquals(cpf)) return false;

  rest = getFirPartCpfIsValid(sum, cpf);

  if (cpfVerifyDigit(cpf, rest, 9, 10) === false) return false;

  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if (cpfVerifyDigit(cpf, rest, 10, 11) === false) return false;

  return true;
}

function cnpjFilterString(isString: boolean, cnpj: string) {
  if (isString) {
    if (cnpj.length > 18) return false;

    const digitsOnly = /^\d{14}$/.test(cnpj);
    const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(cnpj);

    if (digitsOnly || validFormat) true;
    else return false;
  }
}

function cnpjCalcValidation(numbers: number[]) {
  const calc = (x: number) => {
    const slice = numbers.slice(0, x);
    let factor = x - 7;
    let sum = 0;

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i];
      sum += n * factor--;
      if (factor < 2) factor = 9;
    }

    const result = 11 - (sum % 11);

    return result > 9 ? 0 : result;
  };
  return calc;
}

function cnpjRemoveInvalidEquals(numbers: number[]) {
  const items = [...new Set(numbers)];
  if (items.length === 1) return false;
}

function checkCnpjIsValid(cnpj: string) {
  if (cnpj === null) return false;

  const isString = typeof cnpj === 'string';
  const validTypes = isString || Number.isInteger(cnpj) || Array.isArray(cnpj);

  if (!validTypes) return false;

  cnpjFilterString(isString, cnpj);

  const match = cnpj.toString().match(/\d/g);
  const numbers = Array.isArray(match) ? match.map(Number) : [];

  if (numbers.length !== 14) return false;

  cnpjRemoveInvalidEquals(numbers);

  const calc = cnpjCalcValidation(numbers);

  const digits = numbers.slice(12);

  const digit0 = calc(12);
  if (digit0 !== digits[0]) return false;

  const digit1 = calc(13);
  return digit1 === digits[1];
}

function checkDateIsValidAndGreaterToday(date: string) {
  if (date.replace(/\D/g, '').length < 8) return false;
  const [day, month, year] = date.split('/');

  const dateIsValid = moment(date, 'DD/MM/YYYY', true).isValid();
  const dateFormatted = `${year}-${month}-${day}`;

  if (dateIsValid) {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (new Date(dateFormatted) >= new Date(today)) {
      return true;
    }
    return false;
  }
  return false;
}

function checkDateIsValid(date: string) {
  if (date.replace(/\D/g, '').length < 8) return false;

  const dateIsValid = moment(date, 'DD/MM/YYYY', true).isValid();

  return dateIsValid;
}

export {
  checkCnpjIsValid,
  checkCpfIsValid,
  checkDateIsValid,
  checkDateIsValidAndGreaterToday,
  regexCellPhoneStructure,
  regexCepStructure,
  regexNotPermittedSpecialCharacters,
  regexPhoneStructure
};

// Path: src\utils\formYupValidations.ts
