import React from 'react';
import { IAhFormItemProps } from '@allahjs/utils';

/**
 * 表单的label，基于 antd-mobile 的样式
 */
const AhFormLabel: React.FC<IAhFormItemProps> = props => {
  const { label, leftDom, rightDom, layout, required } = props;
  // 如果没有标签，则不渲染
  if (!label && !leftDom) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: layout !== 'vertical' ? 100 : '100%'
      }}
    >
      {leftDom}
      <div
        style={{
          color: '#666',
          fontSize: layout !== 'vertical' ? 16 : 14,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {required && (
          <span
            style={{
              color: '#ff4d4f',
              marginRight: 4,
              fontSize: 14
            }}
          >
            *
          </span>
        )}
        {label}
      </div>
      {layout === 'vertical' && rightDom && <div style={{ marginLeft: 'auto' }}>{rightDom}</div>}
    </div>
  );
};

export default AhFormLabel;
