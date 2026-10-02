import type { UniqueIdentifier } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext } from '@dnd-kit/sortable';
import { ArrayUtil } from '../../theling-utils';
import type { IOptions7 } from '../../theling-utils/@types/IZlData';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import SortableItem, { ISortableItemProps } from '../DndKit/SortableItem';
import './index.less';
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import type { IListOptionsProps } from '../ListOptions/types';

type IListCardsProps = IListOptionsProps & {
  renderItem?: ISortableItemProps['renderItem'];
};

const ListCards: React.FC<IListCardsProps> = props => {
  const {
    titleRender,
    title = '配置菜单选项',
    tips,
    value = [],
    onChange,
    onDelete,
    extraRender,
    renderItem
  } = props;

  const [options, setOptions] = React.useState<IOptions7<string>[]>(value);

  // 当前选择的那个
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  useEffect(() => {
    if (value) {
      setOptions(JSON.parse(JSON.stringify(value)));
    } else {
      setOptions([]);
    }
  }, [value]);
  const onRemove = (index: number) => {
    const newOptions = [...options];
    const item = options[index];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    onChange?.(newOptions, item, index, 'del');
    onDelete?.(options[index], index);
  };

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
          const activeIndex = options.findIndex(item => item.value === activeId);
          const overIndex = options.findIndex(item => item.value === over.id);
          if (activeIndex !== overIndex) {
            const newOpts = ArrayUtil.arrayMove(options, activeIndex, overIndex);
            setOptions(newOpts);
            onChange?.(newOpts, newOpts[overIndex], overIndex, 'move');
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <>
        {titleRender || <h3>{title}</h3>}
        {tips && <div className="theling_tip">{tips}</div>}
        <div className="theling_cards" style={{ display: options.length > 0 ? 'block' : 'none' }}>
          <SortableContext items={options.map(item => item.value)}>
            {options.map((item, index) => (
              <SortableItem
                key={item.value}
                id={item.value}
                index={index}
                data={item}
                sorting={activeId === item.value}
                containerId="A"
                renderItem={
                  renderItem ||
                  ((handleProps, listeners) => (
                    <Card style={{ width: '100%', marginBottom: 10 }} key={item.value}>
                      <div style={{ display: 'flex' }}>
                        <div
                          {...handleProps}
                          {...listeners}
                          style={{ cursor: 'move', marginRight: 10 }}
                        >
                          <HolderOutlined />
                        </div>
                        <div style={{ width: '92%', marginRight: 10 }}>
                          <div
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: '#1b0c0c'
                            }}
                          >
                            {item.label || '-'}
                          </div>
                          <p
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: '#a1a0a2'
                            }}
                          >
                            {item.description || '-'}
                          </p>
                        </div>
                        <div>
                          {extraRender ? (
                            <>{extraRender(item)}</>
                          ) : (
                            <DeleteOutlined onClick={() => onRemove(index)} />
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                }
              />
            ))}
          </SortableContext>
        </div>
      </>
    </DndContext>
  );
};

export default ListCards;
