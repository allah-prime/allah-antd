import type { ButtonProps } from 'antd';
import React from 'react';
import './SoleButton.less';

const defStyles = {
  height: '26px',
  lineHeight: '26px'
};

const SoleButton: React.FC<ButtonProps> = ({ onClick, children, style = {}, icon }) => {
  const textRender = icon ? <span>{children}</span> : children;

  return (
    <div
      className="SoleButton SoleButton-default"
      onClick={e => {
        onClick?.(e as any);
      }}
      style={{ ...defStyles, ...style }}
    >
      <span style={{ marginRight: 4 }}>{icon}</span>
      {textRender}
    </div>
  );
};

export default SoleButton;
