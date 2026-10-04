import type { UniqueIdentifier } from '@dnd-kit/core';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { arrayUtils } from '@allahjs/utils';
import type { IOptions7 } from '@allahjs/utils';
import React, { useEffect, useState } from 'react';
import SortableItem from '../DndKit/SortableItem';
import './index.less';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { IListOptionsProps } from '../ListOptions/types';
import CardItem from './CardItem';

type IGridCardsProps = IListOptionsProps & {
  columns?: number;
  gap?: number;
  /** 卡片高度，默认为自适应（保持1:1比例） */
  cardHeight?: number | string;
  /** 是否保持卡片为正方形 */
  keepSquare?: boolean;
  /**
   * 自定义渲染
   */
  renderItem?: (
    handleProps: any,
    listeners: DraggableSyntheticListeners | undefined,
    item: IOptions7<string>,
    isDragging: boolean,
    index: number
  ) => React.ReactNode;
  style?: React.CSSProperties;
};

const GridCards: React.FC<IGridCardsProps> = props => {
  const {
    titleRender,
    title = '九宫格配置',
    tips,
    value = [],
    onChange,
    onDelete,
    extraRender,
    columns = 3,
    gap = 8,
    renderItem,
    cardHeight,
    keepSquare = true,
    style
  } = props;

  const [options, setOptions] = React.useState<IOptions7<string>[]>(value);
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

  /**
   * 默认的渲染函数
   */
  const defRenderItem = (
    handleProps: any,
    listeners: any,
    item: IOptions7<string>,
    index: number
  ) => {
    return (
      <CardItem
        item={item}
        index={index}
        isActive={activeId === item.value}
        handleProps={handleProps}
        listeners={listeners}
        onRemove={onRemove}
        extraRender={extraRender}
        height={cardHeight}
        keepSquare={keepSquare}
      />
    );
  };

  /**
   * 渲染拖拽覆盖层
   */
  const renderDragOverlay = () => {
    if (!activeId) return null;

    const activeItem = options.find(item => item.value === activeId);
    const activeIndex = options.findIndex(item => item.value === activeId);

    return (
      activeItem && (
        <CardItem
          item={activeItem}
          index={activeIndex}
          isDragging
          height={cardHeight}
          keepSquare={keepSquare}
        />
      )
    );
  };

  return (
    <DndContext
      onDragStart={({ active }) => {
        if (!active) return;
        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        setActiveId(null);
        if (over) {
          const activeIndex = options.findIndex(item => item.value === activeId);
          const overIndex = options.findIndex(item => item.value === over.id);
          if (activeIndex !== overIndex) {
            const newOpts = arrayUtils.arrayMove(options, activeIndex, overIndex);
            setOptions(newOpts);
            onChange?.(newOpts, newOpts[overIndex], overIndex, 'move');
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      modifiers={[restrictToWindowEdges]}
    >
      <>
        {titleRender || (title && <h3>{title}</h3>)}
        {tips && <div className="theling_tip">{tips}</div>}
        <div
          className="theling_grid_cards"
          style={{
            display: options.length > 0 ? 'grid' : 'none',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: gap,
            padding: gap,
            ...style
          }}
        >
          <SortableContext items={options.map(item => item.value)} strategy={rectSortingStrategy}>
            {options.map((item, index) => (
              <SortableItem
                key={item.value}
                id={item.value}
                index={index}
                data={item}
                sorting={activeId === item.value}
                containerId="A"
                renderItem={(handleProps, listeners) =>
                  renderItem
                    ? renderItem(handleProps, listeners, item, activeId === item.value, index)
                    : defRenderItem(handleProps, listeners, item, index)
                }
              />
            ))}
          </SortableContext>
        </div>

        {/* 拖拽覆盖层 */}
        <DragOverlay style={{ zIndex: 9999 }}>{renderDragOverlay()}</DragOverlay>
      </>
    </DndContext>
  );
};

export default GridCards;
