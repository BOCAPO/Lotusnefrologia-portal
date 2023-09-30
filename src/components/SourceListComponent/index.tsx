'use client';
import React from 'react';

import styles from './sourcelist.module.css';

interface SourceListProps {
  items: { id: number; name: string; photo_path: string }[];
  onItemChange: (selectedItems: any[]) => void;
}

const SourceList: React.FC<SourceListProps> = ({ items, onItemChange }) => {
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);

  const handleItemSelection = (item: any) => {
    const updatedSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter((id) => id !== item)
      : [...selectedItems, item];

    setSelectedItems(updatedSelectedItems);
    onItemChange(updatedSelectedItems);
  };

  return (
    <div className={styles.containerSourceList}>
      {items &&
        items.map((item, index) => (
          <div key={index} className={styles.itemSourceList}>
            <input
              type="checkbox"
              key={index}
              value={item.id}
              style={{ marginRight: '5%' }}
              onChange={() => handleItemSelection(item)}
              checked={selectedItems.includes(item)}
            />
            {item.photo_path ? (
              <img
                src={item.photo_path}
                alt={item.name}
                style={{ marginRight: '5%' }}
              />
            ) : (
              <div style={{ marginRight: '5%' }}></div>
            )}
            <p className={styles.titleItem}>{item.name}</p>
          </div>
        ))}
    </div>
  );
};

export default SourceList;
