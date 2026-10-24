import React from 'react';

export type IFormReqLabelProps = {
  /**
   * 左边距
   */
  left?: number;
  color?: string;
  children?: React.ReactNode;
};

const FormReqLabel: React.FC<IFormReqLabelProps> = ({ children, left = -3, color = 'red' }) => {
  return (
    <span style={{ marginLeft: left }}>
      {children}
      <span style={{ color }}>&nbsp;*&nbsp;</span>
    </span>
  );
};

export default FormReqLabel;
