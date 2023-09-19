'use client';

import React, { ChangeEvent } from 'react';
import { Control, Controller } from 'react-hook-form';

import { Icon, TypeIcon } from 'components/Icone';

import stylesCss from './input.module.css';

import { styles } from './styles';

import {
  cellPhoneMak,
  cepMask,
  cnpjMask,
  coinMask,
  coinMaskIntl,
  cpfCnpjMask,
  cpfMask,
  dateMask,
  onlyLetters,
  phoneMak
} from 'utils/masks';

type MaskProps =
  | 'coin'
  | 'date'
  | 'cpfCnpj'
  | 'cpf'
  | 'cnpj'
  | 'phone'
  | 'cellPhone'
  | 'cep'
  | 'onlyLetters'
  | 'coinMaskIntl';

type Props = {
  control: Control;
  mask?: MaskProps | null;
  error?: string | null;
  label?: string;
  name: string;
  maxLength?: number | undefined;
  placeholder?: string;
  editable?: boolean;
  iconType?: object;
  containerStyle?: React.CSSProperties;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  type?: string;
  min?: number;
  style?: React.CSSProperties | undefined;
  readonly?: boolean;
  getValue?: (_text: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function InputForm({
  mask,
  error = null,
  label,
  name,
  containerStyle = {},
  min,
  inputRef,
  maxLength = 100,
  iconType = {},
  readonly = false,
  getValue,
  control,
  placeholder,
  style,
  type = 'text',
  ...rest
}: Props) {
  const [showInputContent, setShowInputContent] = React.useState(
    type === 'password' ? false : true
  );

  React;

  function showContent() {
    if (iconType !== TypeIcon.Password) return;
    setShowInputContent(!showInputContent);
  }

  function setMasks(text: string, mask?: MaskProps) {
    if (['cpf', 'cnpj', 'cpfCnpj'].includes(mask!)) {
      return cpfCnpjMasks(text, mask);
    }
    return masks(text, mask);
  }

  function masks(text: string, mask?: MaskProps) {
    switch (mask) {
      case 'date':
        return dateMask(text);
      case 'phone':
        return phoneMak(text);
      case 'cellPhone':
        return cellPhoneMak(text);
      case 'cep':
        return cepMask(text);
      case 'onlyLetters':
        return onlyLetters(text);
      case 'coin':
        return coinMask(text, true);
      case 'coinMaskIntl':
        return coinMaskIntl(Number(text));
      default:
        text;
    }
  }

  function cpfCnpjMasks(text: string, mask?: MaskProps) {
    switch (mask) {
      case 'cpfCnpj':
        return cpfCnpjMask(text);
      case 'cnpj':
        return cnpjMask(text);
      case 'cpf':
        return cpfMask(text);
      default:
        text;
    }
  }

  return (
    <div style={containerStyle} className={stylesCss.container}>
      <div
        style={{
          ...styles.inputContent,
          ...(error && styles.inputContentError)
        }}
      >
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => {
            const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
              const text = event.target.value;
              const updatedValue =
                mask !== null && mask !== undefined
                  ? setMasks(text, mask!)
                  : text;
              onChange(updatedValue);
              getValue && getValue(updatedValue!.toString());
            };

            return (
              <div className={stylesCss.inputGroup}>
                <input
                  ref={inputRef}
                  {...rest}
                  name={name}
                  maxLength={maxLength}
                  min={min}
                  value={value}
                  readOnly={readonly}
                  style={style}
                  placeholder={
                    value === undefined || value === '' ? placeholder : ''
                  }
                  className={`${stylesCss.input} ${rest.className} ${stylesCss.custonInput}`}
                  type={
                    showInputContent && type === 'password'
                      ? 'text'
                      : showInputContent === false && type === 'password'
                      ? 'password'
                      : type
                  }
                  onChange={handleChange}
                />
                {value !== undefined && value !== '' && (
                  <label htmlFor={name} className={stylesCss.inputLabel}>
                    {label}
                  </label>
                )}
              </div>
            );
          }}
        />
        {Object.keys(iconType).length >= 1 && (
          <div className={stylesCss.iconContainer}>
            <Icon
              typeIcon={!showInputContent ? iconType : TypeIcon.PasswordOff}
              size={20}
              callback={showContent}
              color=""
            />
          </div>
        )}
      </div>
      {error && <p className={stylesCss.messageError}>{error}</p>}
    </div>
  );
}
