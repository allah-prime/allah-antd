import { CloseOutlined } from '@ant-design/icons';
import { domUtils } from '@allahjs/utils';
import type { ModalProps } from 'antd';
import { Modal, Spin } from 'antd';
import React, { useMemo } from 'react';
import './index.less';

export type IAhModalProps = {
  /** 宽度 @default '75%' */
  width?: number | string;
  /** 高度 - 默认根据内容自适应 */
  height?: number | string;
  /** 加载中 @default false */
  loading?: boolean;
  /** 内容区域样式，内部会映射到 antd Modal 的 styles.body */
  bodyStyle?: React.CSSProperties;
  /** 右侧的底部按钮 */
  rightFooter?: React.ReactNode;
  /** 是否开启垂直滚动 @default false */
  scrollY?: boolean;
  /** 区域滚动的高度 - 不设置则使用 height */
  scrollYHeight?: number | string;
  /** 滚动区域样式 */
  scrollYStyles?: React.CSSProperties;
  /** 滚动区域内边距 @default 12 */
  scrollYPadding?: number | string;
  /** 标题右侧区域 */
  titleExtra?: React.ReactNode;
} & ModalProps;

// ─── 工具函数 ───

/** 将视口单位 (vh/vw) 或数值转为像素并减去偏移 */
const resolveSizeToPixels = (value: number | string): number => {
  if (typeof value === 'number') return value;

  const trimmed = value.trim();
  if (!trimmed) return 0;

  if (trimmed.endsWith('vh') || trimmed.endsWith('vw')) {
    return domUtils.viewportToPixels(trimmed);
  }

  if (trimmed.endsWith('px')) {
    const parsed = Number.parseFloat(trimmed);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const resolveHeightStyle = (
  value: number | string | undefined,
  offset: number
): React.CSSProperties['height'] => {
  if (value === undefined || value === null) return undefined;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (trimmed.endsWith('vh') || trimmed.endsWith('vw')) {
      return `calc(${trimmed} - ${offset}px)`;
    }
  }

  const px = resolveSizeToPixels(value);
  return Math.max(px - offset, 0);
};

/** 将 padding 值解析为垂直方向总像素（top + bottom） */
const resolveVerticalPadding = (value: number | string): number => {
  const toPixels = (token: string): number => {
    const trimmed = token.trim();
    if (!trimmed) return 0;
    return resolveSizeToPixels(trimmed);
  };

  if (typeof value === 'number') return value * 2;

  const tokens = value.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;
  if (tokens.length === 1) return toPixels(tokens[0]) * 2;
  if (tokens.length === 2) return toPixels(tokens[0]) * 2;
  if (tokens.length === 3) return toPixels(tokens[0]) + toPixels(tokens[2]);
  return toPixels(tokens[0]) + toPixels(tokens[2]);
};

/** 根据头尾区域是否存在，计算中间内容的圆角 */
const getWrapperRadius = (hasHeader: boolean, hasFooter: boolean) => {
  if (hasHeader && hasFooter) return 0;
  if (hasHeader) return '0 0 8px 8px';
  if (hasFooter) return '8px 8px 0 0';
  return 8;
};

const DEFAULT_HEADER_OFFSET = 40;
const DEFAULT_FOOTER_OFFSET = 60;
const STRING_TITLE_OFFSET = 47;
const RIGHT_FOOTER_OFFSET = 57;

// ─── 组件 ───

const AhModal: React.FC<IAhModalProps> = (props) => {
  const {
    style,
    width = '75%',
    height,
    loading = false,
    children,
    closable = true,
    rightFooter,
    bodyStyle,
    scrollY = false,
    scrollYHeight,
    scrollYStyles: scrollYStylesProp,
    scrollYPadding = 12,
    title,
    titleExtra,
    styles: stylesProp,
    footer,
    onCancel,
    ...restModalProps
  } = props;

  const hasHeader = !!title;
  const hasFooter = !!(rightFooter || footer);

  // ─── 高度计算 ───
  const headerOffset = hasHeader
    ? typeof title === 'string'
      ? STRING_TITLE_OFFSET
      : DEFAULT_HEADER_OFFSET
    : 0;
  const footerOffset = rightFooter ? RIGHT_FOOTER_OFFSET : hasFooter ? DEFAULT_FOOTER_OFFSET : 0;
  const offsetHeight = headerOffset + footerOffset;
  const verticalPadding = useMemo(() => resolveVerticalPadding(scrollYPadding), [scrollYPadding]);
  const bodyHeight = resolveHeightStyle(scrollYHeight ?? height, offsetHeight);
  const scrollBodyHeight = resolveHeightStyle(
    scrollYHeight ?? height,
    offsetHeight + verticalPadding
  );

  // ─── Modal.styles 合并（兼容已废弃的 bodyStyle） ───
  const mergedStyles = useMemo<
    ModalProps['styles'] & {
      body: React.CSSProperties;
    }
  >(() => {
    const baseBody: React.CSSProperties = scrollY
      ? {
          overflow: 'hidden',
          borderRadius: hasHeader ? '8px 8px 0 0' : 8,
          padding: 0,
          ...bodyStyle
        }
      : { padding: 8, ...bodyStyle };

    if (typeof stylesProp === 'function') {
      // antd6 styles 支持函数形式，但类型定义中暂未覆盖
      const styleFn = stylesProp as (info: unknown) => Record<string, React.CSSProperties>;
      return ((info: unknown) => {
        const resolved = styleFn(info);
        return {
          ...resolved,
          body: { ...baseBody, ...resolved?.body },
          container: { padding: 0, ...resolved?.container }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    }

    return {
      ...stylesProp,
      body: { ...baseBody, ...stylesProp?.body },
      container: { padding: 0, ...stylesProp?.container }
    };
  }, [stylesProp, scrollY, hasHeader, bodyStyle, hasFooter]);

  // ─── 标题 ───
  const titleNode = useMemo(() => {
    if (typeof title === 'string') {
      return (
        <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8' }} className="ahWL_ah_sb">
          <div>{title}</div>
          {titleExtra && <div>{titleExtra}</div>}
        </div>
      );
    }
    return title ?? null;
  }, [title, titleExtra]);

  // ─── 滚动容器样式 ───
  const wrapperStyle = useMemo<React.CSSProperties>(
    () => ({
      borderRadius: getWrapperRadius(hasHeader, hasFooter),
      padding: scrollY ? 0 : 4,
      overflow: 'hidden',
      ...scrollYStylesProp
    }),
    [scrollY, scrollYStylesProp, hasHeader, hasFooter]
  );

  // ─── 内容区域样式 ───
  const contentStyle = useMemo<React.CSSProperties>(() => {
    if (scrollY) {
      return { height: scrollBodyHeight, padding: scrollYPadding, overflowY: 'auto' as const };
    }
    return bodyHeight !== undefined ? { height: bodyHeight } : {};
  }, [scrollY, bodyHeight, scrollBodyHeight, scrollYPadding]);

  // ─── 弹窗外层样式 ───
  const modalStyle = useMemo<React.CSSProperties>(
    () => ({
      width: width,
      ...(height ? { minHeight: height } : {}),
      ...style
    }),
    [width, height, style]
  );

  return (
    <Modal
      className="ah_modal"
      width={width}
      style={modalStyle}
      styles={mergedStyles}
      height={height}
      centered
      title={titleNode}
      closable={false}
      footer={footer ?? null}
      onCancel={onCancel}
      {...restModalProps}
    >
      {closable && (
        <button
          type="button"
          onClick={onCancel}
          aria-label="关闭"
          className="theling-form-modal-close-button"
          style={{ border: 0, padding: 0 }}
        >
          <CloseOutlined />
        </button>
      )}
      <Spin spinning={loading} style={{ height: '100%' }}>
        <div style={wrapperStyle}>
          <div style={contentStyle}>{children}</div>
        </div>
      </Spin>
      {rightFooter && (
        <div
          className="ah_modal_footer"
          style={{
            padding: mergedStyles?.body?.padding ? '8px 0' : 12
          }}
        >
          {rightFooter}
        </div>
      )}
    </Modal>
  );
};

export default AhModal;
