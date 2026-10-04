import React, { CSSProperties } from 'react';

/**
 * 调整大小的方向类型
 */
export type ResizeDirection = 'right' | 'left' | 'bottom' | 'bottom-right' | 'bottom-left' | null;

/**
 * 位置接口
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * BaseDragModal 组件属性接口
 */
export interface BaseDragModalProps {
  /** 是否可见 */
  visible?: boolean;
  /** 标题 */
  title?: React.ReactNode;
  /** 宽度 */
  width?: number | string;
  /** 内容 */
  children?: React.ReactNode;
  /** 页脚内容 */
  footer?: React.ReactNode;
  /** 对话框关闭后的回调 */
  afterClose?: () => void;
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean;
  /** 关闭时的回调函数 */
  onClose?: () => void;
  /** 点击遮罩层是否允许关闭 */
  maskClosable?: boolean;
  /** 是否展示遮罩 */
  mask?: boolean;
  /** 遮罩样式 */
  maskStyle?: React.CSSProperties;
  /** 对话框外层容器的类名 */
  wrapClassName?: string;
  /** 对话框外层容器的样式 */
  wrapStyle?: React.CSSProperties;
  /** 对话框内容的样式 */
  bodyStyle?: React.CSSProperties;
  /** 页脚内容的样式 */
  footerStyle?: React.CSSProperties;
  /** 标题的样式 */
  headerStyle?: React.CSSProperties;
  /** 对话框z-index */
  zIndex?: number;
  /** 对话框最小宽度 */
  minWidth?: number;
  /** 对话框默认高度 */
  height?: number;
  /** 对话框最小高度 */
  minHeight?: number;
  /** 初始位置X */
  initialX?: number;
  /** 初始位置Y */
  initialY?: number;
  /** 拖拽ID */
  domId?: string;
  /** 拖拽事件回调 */
  onDragMove?: (delta: { x: number; y: number }) => void;
  /** 位置信息 */
  position?: Position;
  /** 是否固定 */
  isPinned?: boolean;
  /**
   * 是否显示固定按钮
   */
  isPinnedIcon?: boolean;
  /** 固定状态变化回调 */
  onPinnedChange?: (isPinned: boolean) => void;
  /** 是否可调整大小 */
  resizable?: boolean;
  /** 调整大小时的回调 */
  onResize?: (size: { width: number; height: number }) => void;
  /** 调整大小结束时的回调 */
  onResizeEnd?: () => void;
  /** 关闭时是否销毁组件，默认为true */
  destroyOnClose?: boolean;
  /** 自定义左侧标题区域渲染方法 */
  titleRender?: () => React.ReactNode;
}

/**
 * 模态框背景遮罩的属性接口
 */
export interface ModalBackdropProps {
  /**
   * 是否显示模态框
   */
  visible: boolean;
  /**
   * 是否显示遮罩
   */
  mask: boolean;
  /**
   * 是否应用毛玻璃效果
   */
  isBlurred: boolean;
  /**
   * 包装器的类名
   */
  wrapClassName?: string;
  /**
   * 包装器的样式
   */
  wrapStyle?: CSSProperties;
  /**
   * 遮罩的样式
   */
  maskStyle?: CSSProperties;
  /**
   * 模态框的zIndex
   */
  zIndex: number;
  /**
   * 遮罩点击事件处理函数
   */
  onBackdropClick: (e: React.MouseEvent) => void;
}

/**
 * 模态框控制按钮属性接口
 */
export interface ModalControlsProps {
  isPinned: boolean;
  isPinnedIcon: boolean;
  isFullscreen: boolean;
  closable: boolean;
  onPinClick: (e: React.MouseEvent) => void;
  onFullscreenClick: (e: React.MouseEvent) => void;
  onCloseClick: (e: React.MouseEvent) => void;
}

/**
 * 按钮组件属性接口
 */
export interface ButtonComponentProps {
  icon: React.ReactNode;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  isActive: boolean;
  className: string;
}

/**
 * 调整大小手柄属性接口
 */
export interface ResizeHandlesProps {
  resizable: boolean;
  isFullscreen: boolean;
  onResizeStart: (e: React.PointerEvent<HTMLDivElement>, direction: ResizeDirection) => void;
}

/**
 * 可调整大小钩子返回类型
 */
export interface ResizableHookReturn {
  resizeDirection: ResizeDirection;
  isResizing: boolean;
  handleResizeStart: (e: React.PointerEvent<HTMLDivElement>, direction: ResizeDirection) => void;
  handleResizeEnd: () => void;
}
