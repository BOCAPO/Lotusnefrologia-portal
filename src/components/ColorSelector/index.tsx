import { useState } from 'react';

import styles from './colorselector.module.css'; // Estilos CSS

import { DataAppoitmentTag } from 'models/DataAppoitmentTag';

type Props = {
  colors: DataAppoitmentTag[] | null;
  tagSelected?: number;
  onColorChange?: (selectedColor: string) => void;
};

function ColorSelector({
  colors,
  tagSelected,
  onColorChange
}: Props): JSX.Element {
  const [selectedColor, setSelectedColor] = useState(() => {
    if (tagSelected !== undefined && colors) {
      const selectedTag = colors.find((color) => color.id === tagSelected);
      return selectedTag ? selectedTag.color : '';
    }
    return '';
  });
  const [isVisibleSelector, setIsVisibleSelector] = useState(false);
  const colorOption: any[] = [];

  colors?.map((color) => {
    colorOption.push({
      id: color.id,
      value: color.color
    });
  });

  const handleColorChange = (newColor: any) => {
    setSelectedColor(newColor.value);
    onColorChange && onColorChange(newColor.id);
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
                handleColorChange(color);
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
