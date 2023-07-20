import React, { ChangeEvent } from 'react';
import { Control, Controller } from 'react-hook-form';

import { Icon, TypeIcon } from 'components/Icone';
import { MediumText } from 'components/Text';

import { styles } from './styles';

import { Colors } from 'configs/Colors_default';
import {
  cellPhoneMask,
  cepMask,
  coinMask,
  cpfCnpjMask,
  dateMask,
  onlyLetters,
  phoneMask
} from 'utils/masks';

type MaskProps =
  | 'coin'
  | 'date'
  | 'cpfCnpj'
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
  placeholder?: string;
  editable?: boolean;
  iconType?: object;
  containerStyle?: React.CSSProperties;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  type?: string;
  getValue?: (_text: string) => void;
};

export function InputForm({
  mask,
  error = null,
  label,
  name,
  containerStyle = {},
  inputRef,
  iconType = {},
  getValue,
  control,
  className = '',
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

  function masks(text: string, mask?: MaskProps) {
    switch (mask) {
      case 'date':
        return dateMask(text);
      case 'cpfCnpj':
        return cpfCnpjMask(text);
      case 'phone':
        return phoneMask(text);
      case 'cellPhone':
        return cellPhoneMask(text);
      case 'cep':
        return cepMask(text);
      case 'onlyLetters':
        return onlyLetters(text);
      case 'coin':
        return coinMask(text, true);
      default:
        return text;
    }
  }

  return (
    <div style={containerStyle}>
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
              const updatedValue = mask ? masks(text, mask) : text;
              onChange(updatedValue);
              getValue && getValue(updatedValue.toString());
            };

            return (
              <input
                ref={inputRef}
                {...rest}
                style={styles.input}
                name={name}
                value={value || ''}
                className={className}
                type={showInputContent ? type : 'password'}
                onChange={handleChange}
              />
            );
          }}
        />
        {Object.keys(iconType).length >= 1 && (
          <Icon typeIcon={iconType} size={20} callback={showContent} color="" />
        )}
      </div>
      {error && <input style={styles.messageError}>{error}</input>}
    </div>
  );
}
