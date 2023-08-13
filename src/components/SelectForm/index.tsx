import { ChangeEvent } from 'react';
import { Control, Controller } from 'react-hook-form';

import styles from './selectform.module.css';

type Props = {
  control: Control;
  error?: string | null;
  name: string;
  data?: any;
  isLoading?: boolean;
  containerStyle?: React.CSSProperties;
  onSelectChange?: (_value: string) => void; // Adicione o tipo de callback aqui
  getValue?: (_text: string) => void;
};

export function SelectForm({
  control,
  error = null,
  name,
  data,
  isLoading,
  containerStyle,
  onSelectChange, // Receba o callback como uma prop
  getValue,
  value
}: Props) {
  return (
    <div style={containerStyle}>
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
            <div style={{ width: '100%' }}>
              <select
                className={styles.selectGeneral}
                onChange={handleChange}
                value={value}
              >
                {isLoading ? (
                  <option value="0">Carregando...</option>
                ) : (
                  <>
                    <option value="0">Selecione</option>
                    {data &&
                      data.map((item: any) => (
                        <option
                          key={item.id ? item.id : item.code}
                          value={item.id ? item.id : item.code}
                          style={{ padding: '5%' }}
                          selected={value === (item.id ? item.id : item.code)}
                        >
                          {item.name ? item.name : item.description}
                        </option>
                      ))}
                  </>
                )}
              </select>
            </div>
          );
        }}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
