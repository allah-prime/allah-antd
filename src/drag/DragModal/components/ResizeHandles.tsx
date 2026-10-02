import React, { memo } from 'react';
import type { ResizeDirection, ResizeHandlesProps } from '../interface';

/**
 * 调整大小的手柄组件
 */
const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  resizable,
  isFullscreen,
  onResizeStart
}) => {
  // 不可调整大小或全屏时不显示手柄
  if (!resizable || isFullscreen) {
    return null;
  }

  // 创建调整手柄的函数
  const renderResizeHandle = (direction: ResizeDirection) => (
    <div
      key={`resize-handle-${direction}`}
      className={`ah-resize-handle ah-resize-handle-${direction}`}
      onPointerDown={e => onResizeStart(e, direction)}
    />
  );

  return (
    <>
      {renderResizeHandle('right')}
      {renderResizeHandle('left')}
      {renderResizeHandle('bottom')}
      {renderResizeHandle('bottom-right')}
      {renderResizeHandle('bottom-left')}
    </>
  );
};

export default memo(ResizeHandles);
