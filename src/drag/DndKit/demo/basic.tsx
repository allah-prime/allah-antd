import { DndContext, MeasuringStrategy } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cryptoUtils } from '@allahjs/utils';
import { Card } from 'antd';
import { useEffect } from 'react';
import { DroppableContainer, SortableItem, useDndKit } from '../..';

const buildNewItem = (item: any) => ({
  ...item,
  ahKey: cryptoUtils.getUuid(),
  id: cryptoUtils.getUuid()
});

function BasicExample() {
  const {
    sensors,
    collectionB,
    setCollectionB,
    setCollectionA,
    setActiveItem,
    onDragStart,
    onDragOver,
    onDragEnd
  } = useDndKit<any>({ buildNewItem });

  useEffect(() => {
    setCollectionA([
      { label: 'item1', ahKey: '1', id: '1' },
      { label: 'item2', ahKey: '2', id: '2' }
    ]);
    setCollectionB([
      { label: 'item3', ahKey: '3', id: '3' },
      { label: 'item4', ahKey: '4', id: '4' },
      { label: 'item5', ahKey: '5', id: '5' },
      { label: 'item6', ahKey: '6', id: '6' },
      { label: 'item7', ahKey: '7', id: '7' }
    ]);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
      // 开始拖拽时
      onDragStart={onDragStart}
      // 拖拽时
      onDragOver={onDragOver}
      // 拖拽结束时
      onDragEnd={onDragEnd}
      // 取消拖拽时
      onDragCancel={() => {
        setActiveItem(null);
      }}
    >
      <DroppableContainer
        key="B"
        id="B"
        items={collectionB.map(item => item.ahKey)}
        style={{ width: '300px', height: '300px', border: '1px solid black' }}
      >
        <SortableContext
          items={collectionB.map(item => item.ahKey)}
          strategy={verticalListSortingStrategy}
        >
          {collectionB.map((item: any, index) => (
            <SortableItem
              handle
              containerId="B"
              id={item.ahKey}
              key={item.ahKey}
              index={index}
              renderItem={(handleProps, listeners) => (
                <div {...handleProps} {...listeners}>
                  <Card>{item.ahKey}</Card>
                </div>
              )}
            />
          ))}
        </SortableContext>
      </DroppableContainer>
    </DndContext>
  );
}

export default BasicExample;
