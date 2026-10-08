import type { ModalProps } from 'antd';
import React from 'react';
import type { IFormContentProps } from './FormContent';
import FormContent from './FormContent';
import './index.less';
import AhModal, { IAhModalProps } from '../AhModal';

export type IAhEditModalProps = IFormContentProps & {
  /**
   * 覆盖弹窗设置
   */
  modalProps?: ModalProps & IAhModalProps;
  /**
   * 兼容受控打开（等价于 modalProps.open）
   */
  open?: boolean;
  /**
   * 兼容旧写法（等价于 open）
   */
  visible?: boolean;
  /**
   * 宽度
   */
  width?: number | string;
  /**
   * 高度
   */
  height?: number | string;
  /**
   * 距离顶部的距离
   */
  top?: number | string;
};

/**
 * 编辑弹窗：固定左右分栏布局的弹窗外壳（左 16 编辑区 / 右 8 配置区）。
 * 组件本身不创建表单实例，表单由调用方在外层使用 antd Form 管理。
 */
const AhEditModal: React.FC<IAhEditModalProps> = props => {
  const { modalProps = {}, open, visible } = props;
  const { onCancel: modalOnCancel, open: modalOpen, ...restModalProps } = modalProps;
  const mergedOpen = modalOpen ?? open ?? visible;

  const handleCancel: ModalProps['onCancel'] = e => {
    modalOnCancel?.(e);
    props.onCancel?.();
  };

  return (
    <AhModal
      className="theling-form-modal"
      width={props.width}
      height={props.height}
      open={mergedOpen}
      bodyStyle={{
        padding: 0
      }}
      scrollYStyles={{
        padding: 0
      }}
      onCancel={handleCancel}
      {...restModalProps}
    >
      <FormContent {...props} />
    </AhModal>
  );
};

export default AhEditModal;
