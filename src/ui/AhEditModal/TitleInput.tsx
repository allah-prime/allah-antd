import type { HTMLAttributes, InputHTMLAttributes } from 'react';
import React from 'react';
import './index.less';

/**
 * 弹窗的标题输入框
 */
const TitleInput: React.FC<
  HTMLAttributes<Element> &
    InputHTMLAttributes<Element> & {
      onChange?: (value: string) => void;
    }
> = props => {
  return (
    <input
      className="theling-form-modal-title-input"
      placeholder="请输入标题"
      {...props}
      disabled={props.disabled}
      value={props.value}
      onChange={e => props.onChange?.(e.target.value)}
    />
  );
};

export default TitleInput;
