'use client';
import React from 'react';

import styles from './destinationlist.module.css';

interface DestinationListProps {
  items: { id: number; name: string; photo_path: string }[];
  onItemChange: (selectedItems: any[]) => void;
}

const DestinationList: React.FC<DestinationListProps> = ({
  items,
  onItemChange
}) => {
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);

  const handleItemSelection = (item: any) => {
    const updatedSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter((id) => id !== item)
      : [...selectedItems, item];

    setSelectedItems(updatedSelectedItems);
    onItemChange(updatedSelectedItems);
  };

  return (
    <div className={styles.containerDestinationList}>
      {items &&
        items.map((item, index) => (
          <div key={index} className={styles.itemDestinationList}>
            <input
              type="checkbox"
              key={index}
              value={item.id}
              style={{ marginRight: '5%' }}
              onChange={() => handleItemSelection(item)}
              checked={selectedItems.includes(item)}
            />
            <img
              src={item.photo_path}
              alt={item.name}
              style={{ marginRight: '5%' }}
            />
            <p className={styles.titleItem}>{item.name}</p>
          </div>
        ))}
    </div>
  );
};

export default DestinationList;
