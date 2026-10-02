import { DndContext, MeasuringStrategy } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { zlhash } from '../../../theling-utils';
import { Card } from 'antd';
import { useEffect } from 'react';
import { DroppableContainer, SortableItem, useDndKit } from '../..';

const buildNewItem = (item: any) => ({
  ...item,
  zlKey: zlhash.getUuid(),
  id: zlhash.getUuid()
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
      { label: 'item1', zlKey: '1', id: '1' },
      { label: 'item2', zlKey: '2', id: '2' }
    ]);
    setCollectionB([
      { label: 'item3', zlKey: '3', id: '3' },
      { label: 'item4', zlKey: '4', id: '4' },
      { label: 'item5', zlKey: '5', id: '5' },
      { label: 'item6', zlKey: '6', id: '6' },
      { label: 'item7', zlKey: '7', id: '7' }
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
        items={collectionB.map(item => item.zlKey)}
        style={{ width: '300px', height: '300px', border: '1px solid black' }}
      >
        <SortableContext
          items={collectionB.map(item => item.zlKey)}
          strategy={verticalListSortingStrategy}
        >
          {collectionB.map((item: any, index) => (
            <SortableItem
              handle
              containerId="B"
              id={item.zlKey}
              key={item.zlKey}
              index={index}
              renderItem={(handleProps, listeners) => (
                <div {...handleProps} {...listeners}>
                  <Card>{item.zlKey}</Card>
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
