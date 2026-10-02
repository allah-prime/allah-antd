import { DndContext, DragMoveEvent } from '@dnd-kit/core';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import DragModal, { DragModalProps } from './BaseDragModal';

// ─── 全局缓存 ───────────────────────────────────────────────
type PositionData = { x: number; y: number };
type SizeData = { width: number; height: number };
const positionCache = new Map<string, PositionData>();
const sizeCache = new Map<string, SizeData>();
const SAFE_MARGIN = 20;
/** 标题栏最少留在视口内的高度，避免高弹窗把纵向拖拽锁死 */
const TITLE_BAR_KEEP = 56;

/**
 * 清除指定 domId 的缓存（组件卸载时调用）
 */
export function clearDragModalCache(domId: string) {
  positionCache.delete(domId);
  sizeCache.delete(domId);
}

// ─── 工具函数 ───────────────────────────────────────────────
/**
 * 单轴夹紧。区间倒置时（窗口比弹窗还小）仍允许在两端之间移动。
 */
function clampAxis(value: number, min: number, max: number): number {
  if (max < min) {
    return Math.min(min, Math.max(max, value));
  }
  return Math.max(min, Math.min(value, max));
}

/**
 * 将位置约束到「标题栏仍在视口内」。
 * 若按整窗四边夹紧，高度接近视口的弹窗会把 Y 锁死，只剩横向可拖。
 */
function clampToViewport(pos: PositionData, size: SizeData): PositionData {
  const minX = SAFE_MARGIN + TITLE_BAR_KEEP - size.width;
  const maxX = window.innerWidth - TITLE_BAR_KEEP - SAFE_MARGIN;
  const minY = SAFE_MARGIN;
  const maxY = window.innerHeight - TITLE_BAR_KEEP - SAFE_MARGIN;
  return {
    x: clampAxis(pos.x, minX, maxX),
    y: clampAxis(pos.y, minY, maxY)
  };
}

/** 解析 getContainer 得到挂载节点 */
function resolveContainer(
  getContainer?: HTMLElement | (() => HTMLElement) | string | false
): HTMLElement {
  if (getContainer === false) return document.body;
  if (typeof getContainer === 'string') {
    const el = document.querySelector(getContainer);
    return el instanceof HTMLElement ? el : document.body;
  }
  if (typeof getContainer === 'function') {
    const el = getContainer();
    return el instanceof HTMLElement ? el : document.body;
  }
  if (getContainer instanceof HTMLElement) return getContainer;
  return document.body;
}

// ─── Props ──────────────────────────────────────────────────
interface DragModalProviderProps extends Omit<DragModalProps, 'position'> {
  /** 弹窗内容 */
  children: ReactNode;
  /** 是否可见 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 初始X坐标 */
  initialX?: number;
  /** 初始Y坐标 */
  initialY?: number;
  /** 是否默认固定 */
  defaultPinned?: boolean;
  /** 固定状态变化的回调 */
  onPinnedChange?: (pinned: boolean) => void;
  /** 是否可调整大小 */
  resizable?: boolean;
  /** 调整大小的回调 */
  onResize?: (size: { width: number; height: number }) => void;
  /** 关闭时是否销毁组件 */
  destroyOnClose?: boolean;
  /** 自定义左侧标题区域渲染方法 */
  titleRender?: () => ReactNode;
  /** 动画持续时间(毫秒) */
  animationDuration?: number;
  /** 自定义DOM ID */
  domId?: string;
  /** 指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom */
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
}

/**
 * 封装了DndContext的DragModal提供者组件
 * 提供完整拖拽功能的Modal组件
 *
 * 职责边界：
 * - Provider 持有 position / size 唯一真相源并管理全局缓存
 * - BaseDragModal 只消费外部传入的 position，通过回调报告 resize
 */
const DragModalProvider: React.FC<DragModalProviderProps> = ({
  children,
  visible,
  onClose,
  initialX,
  initialY,
  defaultPinned = false,
  onPinnedChange,
  resizable = true,
  onResize,
  destroyOnClose = true,
  animationDuration = 300,
  domId = 'draggable-modal',
  getContainer,
  ...restProps
}) => {
  // ─── 常量 & 缓存 ──────────────────────────────────────────
  const modalWidth = typeof restProps.width === 'number' ? restProps.width : 520;
  const modalMinHeight = restProps.minHeight ?? 200;
  const modalHeight = Math.max(typeof restProps.height === 'number' ? restProps.height : 300, modalMinHeight);

  /** 计算首次打开的初始位置 */
  const calcInitialPosition = useCallback((): PositionData => {
    if (positionCache.has(domId)) return positionCache.get(domId)!;
    const cx = initialX ?? (window.innerWidth - modalWidth) / 2;
    const cy = initialY ?? (window.innerHeight - modalHeight) / 2;
    return { x: Math.max(SAFE_MARGIN, cx), y: Math.max(SAFE_MARGIN, cy) };
  }, [domId, initialX, initialY, modalHeight, modalWidth]);

  // ─── 核心状态 ──────────────────────────────────────────────
  const [position, setPosition] = useState<PositionData>(calcInitialPosition);
  const sizeRef = useRef<SizeData>(sizeCache.get(domId) ?? { width: modalWidth, height: modalHeight });

  // 拖拽锚点：拖拽开始时记录，结束时清空
  const dragAnchorRef = useRef<PositionData | null>(null);

  // 用 ref 保存最新 position，让 handleResizeEnd 不依赖 state
  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // 动画 & 可见性
  const [animationState, setAnimationState] = useState<'enter' | 'exit' | 'none'>('none');
  const [actualVisible, setActualVisible] = useState(visible);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 固定状态
  const [isPinned, setIsPinned] = useState(defaultPinned);

  // ─── container 只算一次（getContainer 是稳定引用） ────────
  const container = useMemo(() => resolveContainer(getContainer), [getContainer]);

  // ─── 可见性 & 动画 effect ─────────────────────────────────
  // 职责单一：只处理 visible 变化引起的 enter / exit 过渡
  useEffect(() => {
    // 先清理上一轮可能残留的定时器（严格模式安全）
    clearTimeout(animTimerRef.current);

    if (visible) {
      // 恢复缓存（位置 & 尺寸）
      const cachedPos = positionCache.get(domId);
      const cachedSize = sizeCache.get(domId);
      if (cachedSize) sizeRef.current = cachedSize;
      const nextPos = clampToViewport(cachedPos ?? calcInitialPosition(), sizeRef.current);
      setPosition(nextPos);
      positionCache.set(domId, nextPos);

      setActualVisible(true);
      setAnimationState('enter');
    } else if (actualVisible) {
      // 关闭 → 用 ref 读最新位置，避免把 position 放进依赖数组
      positionCache.set(domId, positionRef.current);
      sizeCache.set(domId, sizeRef.current);

      setAnimationState('exit');
      animTimerRef.current = setTimeout(() => {
        setActualVisible(false);
        setAnimationState('none');
      }, animationDuration);
    }

    return () => clearTimeout(animTimerRef.current);
  }, [visible, actualVisible, animationDuration, calcInitialPosition, domId]);

  // 卸载时清理缓存
  useEffect(() => {
    return () => clearDragModalCache(domId);
  }, [domId]);

  // ─── 窗口 resize 时保持可视区域内 ────────────────────────
  useEffect(() => {
    if (!actualVisible) return;

    const onWindowResize = () => {
      const clamped = clampToViewport(position, sizeRef.current);
      if (clamped.x !== position.x || clamped.y !== position.y) {
        setPosition(clamped);
        positionCache.set(domId, clamped);
      }
    };

    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
    // 需要最新 position
  }, [actualVisible, domId, position]);

  // ─── 组件 resize 回调 ─────────────────────────────────────
  const handleResize = useCallback(
    (size: SizeData) => {
      sizeRef.current = size;
      sizeCache.set(domId, size);
      onResize?.(size);
    },
    [domId, onResize]
  );

  const handleResizeEnd = useCallback(() => {
    // resize 结束后 clamp 一次位置（通过 ref 读最新 position，保持函数引用稳定）
    const clamped = clampToViewport(positionRef.current, sizeRef.current);
    setPosition(clamped);
    positionCache.set(domId, clamped);
    sizeCache.set(domId, sizeRef.current);
  }, [domId]);

  // ─── 固定状态 ──────────────────────────────────────────────
  const handlePinnedChange = useCallback(
    (pinned: boolean) => {
      setIsPinned(pinned);
      onPinnedChange?.(pinned);
    },
    [onPinnedChange]
  );

  // ─── @dnd-kit 拖拽事件 ────────────────────────────────────
  const handleDragStart = useCallback(() => {
    dragAnchorRef.current = { ...position };
  }, [position]);

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const anchor = dragAnchorRef.current;
      if (!anchor) return;

      const { delta } = event;
      const next = clampToViewport(
        { x: anchor.x + delta.x, y: anchor.y + delta.y },
        sizeRef.current
      );
      setPosition(next);
      positionCache.set(domId, next);
    },
    [domId]
  );

  const handleDragEnd = useCallback(() => {
    // 拖拽结束后以最新 state 为准保存缓存
    positionCache.set(domId, positionRef.current);
    dragAnchorRef.current = null;
  }, [domId]);

  // ─── 渲染 ─────────────────────────────────────────────────
  if (!actualVisible && destroyOnClose) return null;

  const animClass =
    animationState === 'enter'
      ? 'ah-drag-modal-enter ah-drag-modal-enter-active'
      : animationState === 'exit'
        ? 'ah-drag-modal-exit ah-drag-modal-exit-active'
        : '';

  return ReactDOM.createPortal(
    <DndContext onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <DragModal
        {...restProps}
        position={position}
        visible={actualVisible}
        onClose={onClose}
        domId={domId}
        mask={restProps.mask ?? true}
        maskClosable={isPinned ? false : (restProps.maskClosable ?? true)}
        isPinned={isPinned}
        onPinnedChange={handlePinnedChange}
        resizable={resizable}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
        destroyOnClose={false}
        titleRender={restProps.titleRender}
        wrapClassName={`${restProps.wrapClassName || ''} ${animClass}`.trim()}
        wrapStyle={{
          ...restProps.wrapStyle,
          transition: `opacity ${animationDuration}ms, transform ${animationDuration}ms`
        }}
      >
        {children}
      </DragModal>
    </DndContext>,
    container
  );
};

export default DragModalProvider;
