import { useState } from 'react';

import styles from './colorselector.module.css'; // Estilos CSS

import { DataAppoitmentTag } from 'models/DataAppoitmentTag';

type Props = {
  colors: DataAppoitmentTag[];
  tagSelected?: number;
};

function ColorSelector({ colors }: Props): JSX.Element {
  const [selectedColor, setSelectedColor] = useState('');
  const [isVisibleSelector, setIsVisibleSelector] = useState(false);
  const colorOption: any[] = [];

  colors?.map((color) => {
    colorOption.push({
      id: color.id,
      value: color.color
    });
  });

  const handleColorChange = (newColor: any) => {
    setSelectedColor(newColor);
  };

  return (
    <div className={styles.colorSelector}>
      <div className={styles.tagSelector}>
        <div style={{ width: '20%' }}>
          <span>TAG</span>
        </div>
        <div
          style={{
            width: '70%',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setIsVisibleSelector(!isVisibleSelector)}
        >
          <div
            className={styles.selectedColor}
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      </div>
      {isVisibleSelector && (
        <div className={styles.colorOptions}>
          {colorOption.map((color) => (
            <div
              key={color.value}
              className={`${styles.colorOption} ${
                selectedColor === color.value ? styles.selected : ''
              }`}
              onClick={() => {
                handleColorChange(color.value);
                setIsVisibleSelector(false);
              }}
            >
              <div
                className={styles.colorCircle}
                style={{ backgroundColor: color.value }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ColorSelector;
