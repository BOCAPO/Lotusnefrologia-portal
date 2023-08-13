import React, { ChangeEvent } from 'react';
import { Control, Controller } from 'react-hook-form';

import { Icon, TypeIcon } from 'components/Icone';
import { MediumText } from 'components/Text';

import stylesCss from './input.module.css';

import { styles } from './styles';

import { Colors } from 'configs/Colors_default';
import {
  cellPhoneMak,
  cepMask,
  cnpjMask,
  coinMask,
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
  | 'onlyLetters';

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
  inputRef,
  maxLength = 100,
  iconType = {},
  readonly = false,
  getValue,
  control,
  style,
  type = 'text',
  ...rest
}: Props) {
  const [showInputContent, setShowInputContent] = React.useState(
    type === 'password' ? false : true
  );

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
      {label && (
        <MediumText
          text={label}
          color={error ? Colors.redInvalid : Colors.gray90}
          bold={false}
        />
      )}
      <div
        style={{
          ...styles.inputContent,
          ...(label && { marginTop: 12 }),
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
              <input
                ref={inputRef}
                {...rest}
                name={name}
                maxLength={maxLength}
                value={value}
                readOnly={readonly}
                style={style}
                className={`${stylesCss.input} ${rest.className}`}
                type={showInputContent ? type : 'password'}
                onChange={handleChange}
              />
            );
          }}
        />
        {Object.keys(iconType).length >= 1 && (
          <div className={stylesCss.iconContainer}>
            <Icon
              typeIcon={iconType}
              size={20}
              callback={() => {
                showContent;
              }}
              color=""
            />
          </div>
        )}
      </div>
      {error && <p className={stylesCss.messageError}>{error}</p>}
    </div>
  );
}
