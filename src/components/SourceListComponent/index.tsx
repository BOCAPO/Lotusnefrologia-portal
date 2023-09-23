'use client';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import styles from './sourcelist.module.css';

interface SourceListProps {
  items: { id: number; name: string; photo_path: string }[];
}

const SourceList: React.FC<SourceListProps> = ({ items }) => {
  return (
    <Droppable droppableId="source">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={styles.containerSourceList}
        >
          {items.map((item, index) => (
            <Draggable
              key={item.id}
              draggableId={item.id.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={styles.itemSourceList}
                >
                  <div className="w-25">
                    <img src={item.photo_path} alt={item.name} />
                  </div>
                  <div className="w-75 d-flex justify-content-start align-items-center px-4">
                    <p className={styles.titleItem}>{item.name}</p>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default SourceList;
