import { ChangeEvent } from 'react';
import { Control, Controller } from 'react-hook-form';

import styles from './selectform.module.css';

type Props = {
  control: Control;
  error?: string | null;
  name: string;
  data?: any;
  className?: string;
  label?: string;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: React.CSSProperties;
  item?: string;
  onSelectChange?: (_value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  getValue?: (_text: string) => void;
};

export function SelectForm({
  control,
  error = null,
  name,
  data,
  label,
  disabled = false,
  isLoading,
  item,
  containerStyle,
  onSelectChange, // Receba o callback como uma prop
  getValue,
  ...rest
}: Props) {
  return (
    <div style={containerStyle} className={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
            const selectedValue = event.target.value;
            getValue && getValue(selectedValue);
            onChange(selectedValue);
            onSelectChange && onSelectChange(selectedValue);
          };

          return (
            <div
              style={{ width: '100%', display: 'flex' }}
              className={styles.selectGroup}
            >
              <select
                {...rest}
                className={`${styles.selectGeneral} ${rest.className}`}
                onChange={handleChange}
                value={value}
                disabled={disabled}
              >
                {isLoading ? (
                  <option value="0">Carregando...</option>
                ) : (
                  <>
                    <option value="0">
                      Selecione {item !== undefined ? `${item}` : ''}
                    </option>
                    {data &&
                      data.map((item: any) => (
                        <option
                          key={item.id ? item.id : item.code}
                          value={item.id ? item.id : item.code}
                          style={{ padding: '5%' }}
                        >
                          {item.name ? item.name : item.description}
                        </option>
                      ))}
                  </>
                )}
              </select>
              {value !== undefined && value !== '' && (
                <label htmlFor={name} className={styles.selectLabel}>
                  {label}
                </label>
              )}
            </div>
          );
        }}
      />
      {error && <p className={styles.messageError}>{error}</p>}
    </div>
  );
}
