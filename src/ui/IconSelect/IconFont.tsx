import { createFromIconfontCN } from '@ant-design/icons';
import type { IconFontProps } from '@ant-design/icons/lib/components/IconFont';
import React from 'react';
import AhAntdConfig from '../utils/AhAntdConfig';

const IconCreateFont = createFromIconfontCN({
  scriptUrl: AhAntdConfig.getOtherConfig().iconPath || '/icon/theling_icon.js'
});

/**
 * 自定义icon组件，需要配置和iconFont进行使用
 * <br />
 * 如果不指定iconPtah的话，就用/icon/theling_icon.js这个地址的js文件
 */
const IconFont: React.FC<IconFontProps> = props => {
  const { style = {}, ...other } = props;
  return <IconCreateFont style={{ fontSize: 14, ...style }} {...other} />;
};

export default IconFont;
