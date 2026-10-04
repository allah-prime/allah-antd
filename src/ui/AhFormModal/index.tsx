import type { ModalProps } from 'antd';
import React from 'react';
import type { IFormContentProps } from './FormContent';
import FormContent from './FormContent';
import './index.less';
import AhModal, { IAhModalProps } from '../AhModal';

export type IAhFormModalProps = IFormContentProps & {
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
 * 自定义弹出编辑表单。
 * 这个是负载的左右布局，一般用在详情表单中使用，左侧为文本内容等需要进行编辑。
 * 关联操作的东西，右侧是一些配置的东西
 */
const Index: React.FC<IAhFormModalProps> = props => {
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

export default Index;
