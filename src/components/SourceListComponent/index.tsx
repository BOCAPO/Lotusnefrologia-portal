'use client';
import React from 'react';

import styles from './sourcelist.module.css';

import { Strings } from 'assets/Strings';

interface SourceListProps {
  items: { id: number; name: string; photo_path: string; isFixed: boolean }[];
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
      {items?.length > 0 ? (
        items &&
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
            <div className="d-flex justify-content-around align-items-center w-75">
              <p className={styles.titleItem}>{item.name}</p>
              <p className={styles.titleItem}>
                <strong>
                  {item.isFixed ? Strings.isFixed : Strings.isNotFixed}
                </strong>
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.itemSourceList}>
          <p className={styles.titleItem}>{Strings.selectOneUnit}</p>
        </div>
      )}
    </div>
  );
};

export default SourceList;
