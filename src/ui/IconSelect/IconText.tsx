import React from 'react';

type IProps = {
  icon?: React.ReactNode | React.ReactElement;
  text: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
};

/**
 * icon和文字组件
 * @param icon 图标
 * @param text 文字
 * @param onClick 点击事件
 */
const IconText: React.FC<IProps> = ({ icon, text, onClick, style }) => (
  <div onClick={onClick} className={onClick ? 'ah_cursor_pointer' : ''} style={style}>
    {icon || <span style={{ display: 'inline-block', width: 14, height: 14 }} />}
    <span style={{ marginLeft: 4 }}>{text}</span>
  </div>
);

export default IconText;
