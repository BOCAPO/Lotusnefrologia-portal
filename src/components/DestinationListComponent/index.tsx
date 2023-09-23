'use client';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import styles from './destinationlist.module.css';

interface DestinationListProps {
  items: { id: number; name: string; photo_path: string }[];
}

const DestinationList: React.FC<DestinationListProps> = ({ items }) => {
  return (
    <Droppable droppableId="destination">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={styles.containerDestinationList}
        >
          {items.map((item, index) => (
            <Draggable
              key={item.id}
              draggableId={item?.id.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={styles.itemDestinationList}
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

export default DestinationList;
