import { Form } from 'antd';
import React from 'react';
import { FormItemProps } from '../../theling-utils';

const ProFormContainer: React.FC<
  FormItemProps & {
    name: string;
    labelAlign?: 'left' | 'right';
  }
> = ({ children, name, style, ...other }) => {
  return (
    <Form.Item
      name={name}
      style={style}
      required={other.required}
      tooltip={other.tooltip}
      label={other.label}
      labelAlign={other.labelAlign}
      rules={other.rules}
    >
      {children}
    </Form.Item>
  );
};

export default ProFormContainer;
