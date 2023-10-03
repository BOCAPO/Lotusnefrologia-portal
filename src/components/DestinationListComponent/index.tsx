'use client';
import React from 'react';

import styles from './destinationlist.module.css';

import { Strings } from 'assets/Strings';

interface DestinationListProps {
  items: { id: number; name: string; photo_path: string; isFixed: boolean }[];
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
            <div className="d-flex justify-content-around align-items-center w-75">
              <p className={styles.titleItem}>{item.name}</p>
              <p className={styles.titleItem}>
                <strong>
                  {item.isFixed ? Strings.isFixed : Strings.isNotFixed}
                </strong>
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DestinationList;
