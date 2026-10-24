import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import type { Transform } from '@dnd-kit/utilities';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { getColor, useMountStatus } from './dndKitUtils';
import './SortableItem.less';

export interface SortableItemProps extends ISortableItemProps {
  /**
   * 当前的容器id
   */
  containerId: UniqueIdentifier;
  /**
   * 当前的id
   */
  id: UniqueIdentifier;
  /**
   * 是否被移动拖拽
   */
  moveDragging?: boolean;
  /**
   * 额外的数据
   */
  data?: any;
}

function SortableItem({
  disabled,
  id,
  index,
  moveDragging,
  data,
  children,
  style,
  handle,
  renderItem,
  ...props
}: SortableItemProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition
  } = useSortable({
    id,
    data
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <DndFormItem
      ref={disabled ? undefined : setNodeRef}
      dragging={moveDragging || isDragging}
      sorting={isSorting}
      handleProps={{ ref: setActivatorNodeRef }}
      index={index}
      color={getColor(id)}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      style={style}
      handle={handle}
      renderItem={renderItem}
      {...props}
    >
      {children}
    </DndFormItem>
  );
}
export default SortableItem;

export interface ISortableItemProps {
  dragOverlay?: boolean;
  color?: string;
  /**
   * 是否被禁用
   */
  disabled?: boolean;
  dragging?: boolean;

  /**
   * 开启手柄拖拽模式
   */
  handle?: boolean;
  handleProps?: any;
  height?: number;

  /**
   * 下标
   */
  index: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  children?: React.ReactNode;
  /**
   * 自定义渲染
   */
  renderItem?: (
    handleProps: any,
    listeners: DraggableSyntheticListeners | undefined
  ) => React.ReactNode;
  onClick?: () => void;
  /**
   * 选项的样式
   */
  wrapperItemStyle?: React.CSSProperties;
}

/**
 * 渲染的元素
 */
export const DndFormItem = React.memo(
  React.forwardRef<HTMLLIElement, ISortableItemProps>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handleProps,
        index,
        listeners,
        transform,
        sorting,
        transition,
        children,
        style,
        handle,
        renderItem,
        onClick,
        wrapperItemStyle
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }
        document.body.style.cursor = 'grabbing';
        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      return (
        <div
          onClick={onClick}
          className={classNames(
            'DndKit_Wrapper',
            fadeIn && 'DndKit_Wrapper_fadeIn',
            sorting && 'DndKit_Wrapper_sorting',
            dragOverlay && 'DndKit_Wrapper_dragOverlay'
          )}
          style={
            {
              transition: [transition].filter(Boolean).join(', '),
              '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
              '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
              '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
              '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
              '--index': index,
              '--color': color,
              ...style
            } as React.CSSProperties
          }
          ref={ref as any}
        >
          {renderItem ? (
            renderItem(handleProps, listeners)
          ) : (
            <div
              className={classNames(
                'DndKit_Wrapper_Item',
                dragging && 'moveDragging',
                handle && 'DndKit_Wrapper_Item_withHandle',
                dragOverlay && 'DndKit_Wrapper_Item_dragOverlay',
                disabled && 'DndKit_Wrapper_Item_disabled'
              )}
              style={{
                width: '100%',
                ...wrapperItemStyle
              }}
              {...(!handle ? listeners : undefined)}
              tabIndex={!handle ? 0 : undefined}
              data-cypress="draggable-item"
            >
              {children}
            </div>
          )}
        </div>
      );
    }
  )
);
