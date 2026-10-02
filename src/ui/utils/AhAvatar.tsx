import { Avatar } from 'antd';
import React from 'react';
import './AhAvatar.less';

type IAhAvatarProps = {
  /**
   * 用户名
   */
  name?: string;
  /**
   * 头像
   */
  headImgUrl?: string;
  /**
   * 后缀文本
   */
  suffixText?: string;
  /**
   * 是否显示名称
   */
  showName?: boolean;
  /**
   * 名称的颜色
   */
  nameColor?: string;
  /**
   * 鼠标经过时，是否显示左边距和底部阴影，true显示，false不显示
   */
  hover?: boolean;
  /**
   * 最大显示宽度
   */
  maxWidth?: number;
  /**
   * 头像样式
   */
  avatarStyle?: React.CSSProperties;
  /**
   * 圆的还是方的
   */
  shape?: 'circle' | 'square';
};

const AvatarRender: React.FC<IAhAvatarProps> = ({
  headImgUrl,
  name,
  suffixText,
  showName,
  nameColor = '#000',
  hover = true,
  avatarStyle = {} as React.CSSProperties,
  shape = 'circle'
}) => {
  if (hover) {
    avatarStyle = {
      ...avatarStyle,
      marginLeft: '8px'
    };
  }

  return (
    <>
      {headImgUrl ? (
        <Avatar
          src={headImgUrl}
          size="small"
          className="ah-avatar"
          style={avatarStyle}
          shape={shape}
        />
      ) : (
        <Avatar size="small" className="ah-avatar" style={avatarStyle} shape={shape}>
          {name?.substring(0, 1)}
        </Avatar>
      )}
      {showName && (
        <span
          style={{
            marginLeft: 8,
            color: nameColor
          }}
        >
          {name}
        </span>
      )}
      {suffixText && (
        <span
          style={{
            marginLeft: 8
          }}
        >
          {suffixText}
        </span>
      )}
    </>
  );
};

/**
 * 头像组件
 */
const AhAvatar: React.FC<IAhAvatarProps> = props => {
  return (
    <div
      style={{
        maxWidth: props.maxWidth
      }}
      className={
        props.hover
          ? 'ZlAvatar_headerDropdownDiv ZlAvatar_headerDropdownDivB'
          : 'AhAvatar_headerDropdownDiv'
      }
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <AvatarRender {...props} />
      </span>
    </div>
  );
};

export default AhAvatar;
