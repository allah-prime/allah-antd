import React, { memo } from 'react';
import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  PushpinFilled,
  PushpinOutlined
} from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import type { ButtonComponentProps, ModalControlsProps } from '../interface';

/**
 * 按钮组件
 */
const ButtonComponent = memo(
  ({ icon, title, onClick, isActive, className }: ButtonComponentProps) => (
    <Tooltip title={title} mouseEnterDelay={0.5}>
      <Button
        type="text"
        size="small"
        icon={icon}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onClick(e);
        }}
        className={`${className} ${isActive ? 'active' : ''}`}
      />
    </Tooltip>
  )
);

/**
 * 弹窗控制按钮组件
 */
const ModalControls: React.FC<ModalControlsProps> = ({
  isPinned,
  isPinnedIcon,
  isFullscreen,
  closable,
  extraControls,
  onPinClick,
  onFullscreenClick,
  onCloseClick
}) => {
  return (
    <div className="ah-drag-modal-controls">
      <Space size={4} onClick={e => e.stopPropagation()}>
        {isPinnedIcon && (
          <ButtonComponent
            icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
            title={isPinned ? '取消固定' : '固定'}
            onClick={onPinClick}
            isActive={isPinned}
            className="ah-drag-modal-pin"
          />
        )}
        {extraControls}
        <ButtonComponent
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          title={isFullscreen ? '退出全屏' : '全屏显示'}
          onClick={onFullscreenClick}
          isActive={isFullscreen}
          className="ah-drag-modal-fullscreen"
        />

        {closable && (
          <ButtonComponent
            icon={<CloseOutlined />}
            title="关闭"
            onClick={onCloseClick}
            isActive={false}
            className="ah-drag-modal-close"
          />
        )}
      </Space>
    </div>
  );
};

export { ButtonComponent };
export default memo(ModalControls);
