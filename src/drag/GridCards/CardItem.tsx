import React from 'react';
import { Card } from 'antd';
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import type { IOptions7 } from '@allahjs/utils';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';

interface CardItemProps {
  item: IOptions7<string>;
  index: number;
  isDragging?: boolean;
  isActive?: boolean;
  handleProps?: any;
  listeners?: DraggableSyntheticListeners;
  onRemove?: (index: number) => void;
  extraRender?: (item: IOptions7<string>) => React.ReactNode;
  /** 卡片高度，默认为自适应（保持1:1比例） */
  height?: number | string;
  /** 是否保持正方形比例 */
  keepSquare?: boolean;
}

/**
 * 九宫格卡片项组件
 */
const CardItem: React.FC<CardItemProps> = ({
  item,
  index,
  isDragging = false,
  isActive = false,
  handleProps,
  listeners,
  onRemove,
  extraRender,
  height,
  keepSquare = true
}) => {
  return (
    <Card
      size="small"
      className={isDragging ? 'grid-item-dragging' : 'grid-item'}
      hoverable
      style={{
        position: 'relative',
        ...(keepSquare ? { aspectRatio: '1' } : {}),
        ...(height ? { height } : {}),
        boxShadow: isDragging
          ? '0 0 15px rgba(0,0,0,0.2)'
          : isActive
            ? '0 0 10px rgba(0,0,0,0.1)'
            : 'none',
        width: '100%',
        opacity: !isDragging && isActive ? 0.5 : 1
      }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div {...(handleProps || {})} {...(listeners || {})} style={{ cursor: 'move' }}>
              <HolderOutlined />
            </div>
            <div
              style={{
                textAlign: 'center',
                marginLeft: 4,
                flex: 1,
                fontWeight: 500
              }}
            >
              {item.label || '-'}
            </div>
          </div>
          {!isDragging && onRemove && (
            <div>
              {extraRender ? (
                extraRender(item)
              ) : (
                <DeleteOutlined
                  style={{ color: '#999' }}
                  onClick={e => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                />
              )}
            </div>
          )}
        </div>
      }
    >
      <div
        style={{
          width: '100%',
          fontSize: '14px',
          color: '#666',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}
      >
        {item.description || '-'}
      </div>
    </Card>
  );
};

export default CardItem;
