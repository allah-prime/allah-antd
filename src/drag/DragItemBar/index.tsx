import type { UniqueIdentifier } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext } from '@dnd-kit/sortable';
import SortableItem from '../DndKit/SortableItem';
import { arrayUtils } from '@allahjs/utils';
import React, { useEffect, useState } from 'react';

export interface IContainerProps<T> {
  /**
   * 拖拽的内容
   */
  renderItem: (item: T) => React.ReactNode;
  /**
   * key值
   */
  rowKey: string;
  /**
   * 拖拽后的数据
   */
  onChange: (v: T[]) => void;
  /**
   * 默认数据
   */
  value: T[];
}

const DragItemBar = <T extends Record<string, any>>({
  value = [],
  onChange,
  rowKey,
  renderItem
}: IContainerProps<T>): React.ReactNode => {
  const [items, setItems] = useState<T[]>(value);

  // 当前选择的那个
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  useEffect(() => {
    if (value) {
      setItems(JSON.parse(JSON.stringify(value)));
    } else {
      setItems([]);
    }
  }, [value]);

  return (
    <DndContext
      onDragStart={({ active }) => {
        if (!active) {
          return;
        }
        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        setActiveId(null);
        if (over) {
          const activeIndex = items.findIndex(item => item[rowKey] === activeId);
          const overIndex = items.findIndex(item => item[rowKey] === over.id);
          if (activeIndex !== overIndex) {
            const newItems = arrayUtils.arrayMove(items, activeIndex, overIndex);
            setItems(newItems);
            onChange?.(newItems);
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={items.map(item => item[rowKey])}>
        {items.map((item, index) => (
          <SortableItem
            key={item[rowKey]}
            id={item[rowKey]}
            index={index}
            data={item}
            sorting={activeId === item[rowKey]}
            containerId="dragItemBar"
            style={{ display: 'block' }}
            renderItem={(handleProps, listeners) => (
              <div {...handleProps} {...listeners} style={{ cursor: 'move' }}>
                {renderItem(item)}
              </div>
            )}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DragItemBar;
