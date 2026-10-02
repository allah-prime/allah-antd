import React from 'react';
import { theme } from 'antd';

/**
 * @description 将 Ant Design 的 Design Token 同步到 CSS 变量
 * @param tokens - 从 theme.useToken() 获取的 token 对象
 * @param prefix - CSS 变量前缀，默认为 'ant'
 * @param container - 要设置 CSS 变量的容器元素，默认为 document.documentElement
 */
export function syncTokensToCssVariables(
  tokens: ReturnType<typeof theme.useToken>['token'],
  prefix: string = 'ant',
  container: HTMLElement = document.documentElement
) {
  // 需要同步的 token 映射
  const tokenMap = {
    // 颜色相关
    colorPrimary: 'color-primary',
    colorSuccess: 'color-success',
    colorWarning: 'color-warning',
    colorError: 'color-error',
    colorInfo: 'color-info',
    colorText: 'color-text',
    colorTextSecondary: 'color-text-secondary',
    colorTextTertiary: 'color-text-tertiary',
    colorTextQuaternary: 'color-text-quaternary',
    colorTextLightSolid: 'color-text-light-solid',
    colorBgContainer: 'color-bg-container',
    colorBgElevated: 'color-bg-elevated',
    colorBgLayout: 'color-bg-layout',
    colorBorder: 'color-border',
    colorBorderSecondary: 'color-border-secondary',
    colorSplit: 'color-split',

    // 尺寸相关
    borderRadius: 'border-radius',
    borderRadiusLG: 'border-radius-lg',
    borderRadiusSM: 'border-radius-sm',
    borderRadiusXS: 'border-radius-xs',

    // 间距相关
    padding: 'padding',
    paddingXS: 'padding-xs',
    paddingSM: 'padding-sm',
    paddingMD: 'padding-md',
    paddingLG: 'padding-lg',
    paddingXL: 'padding-xl',
    paddingXXS: 'padding-xxs',

    margin: 'margin',
    marginXS: 'margin-xs',
    marginSM: 'margin-sm',
    marginMD: 'margin-md',
    marginLG: 'margin-lg',
    marginXL: 'margin-xl',
    marginXXS: 'margin-xxs',

    // 字体相关
    fontSize: 'font-size',
    fontSizeSM: 'font-size-sm',
    fontSizeLG: 'font-size-lg',
    fontSizeXL: 'font-size-xl',
    fontSizeHeading1: 'font-size-heading1',
    fontSizeHeading2: 'font-size-heading2',
    fontSizeHeading3: 'font-size-heading3',
    fontSizeHeading4: 'font-size-heading4',
    fontSizeHeading5: 'font-size-heading5',

    lineHeight: 'line-height',
    lineHeightLG: 'line-height-lg',
    lineHeightSM: 'line-height-sm',

    // 控件相关
    controlHeight: 'control-height',
    controlHeightSM: 'control-height-sm',
    controlHeightLG: 'control-height-lg',
    controlHeightXS: 'control-height-xs',

    // 阴影
    boxShadow: 'box-shadow',
    boxShadowSecondary: 'box-shadow-secondary',

    // 动画
    motionDurationFast: 'motion-duration-fast',
    motionDurationMid: 'motion-duration-mid',
    motionDurationSlow: 'motion-duration-slow',

    // Z-index
    zIndexBase: 'z-index-base',
    zIndexPopupBase: 'z-index-popup-base'
  };

  // 遍历 tokenMap，设置 CSS 变量
  Object.entries(tokenMap).forEach(([tokenKey, cssVarName]) => {
    const tokenValue = tokens[tokenKey as keyof typeof tokens];
    if (tokenValue !== undefined) {
      const cssVarFullName = `--${prefix}-${cssVarName}`;

      // 处理不同类型的值
      let cssValue: string;
      if (typeof tokenValue === 'number') {
        // 对于数值，如果是尺寸相关的，添加 'px' 单位
        if (
          cssVarName.includes('padding') ||
          cssVarName.includes('margin') ||
          cssVarName.includes('radius') ||
          cssVarName.includes('font-size') ||
          cssVarName.includes('height')
        ) {
          cssValue = `${tokenValue}px`;
        } else {
          cssValue = String(tokenValue);
        }
      } else {
        cssValue = String(tokenValue);
      }

      container.style.setProperty(cssVarFullName, cssValue);
    }
  });
}

/**
 * @description 清除指定前缀的 CSS 变量
 * @param prefix - CSS 变量前缀
 * @param container - 要清除 CSS 变量的容器元素
 */
export function clearCssVariables(
  prefix: string = 'ant',
  container: HTMLElement = document.documentElement
) {
  const style = container.style;

  // 遍历所有样式属性，移除指定前缀的 CSS 变量
  for (let i = style.length - 1; i >= 0; i--) {
    const property = style[i];
    if (property.startsWith(`--${prefix}-`)) {
      style.removeProperty(property);
    }
  }
}

/**
 * @description React Hook，用于自动同步 Design Token 到 CSS 变量
 * @param prefix - CSS 变量前缀
 * @param container - 要设置 CSS 变量的容器元素
 * @returns 当前的 tokens
 */
export function useCssTokenSync(prefix: string = 'ant', container?: HTMLElement) {
  const { token } = theme.useToken();

  React.useEffect(() => {
    syncTokensToCssVariables(token, prefix, container);

    // 清理函数
    return () => {
      if (container && container !== document.documentElement) {
        clearCssVariables(prefix, container);
      }
    };
  }, [token, prefix, container]);

  return token;
}
