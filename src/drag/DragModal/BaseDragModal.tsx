import { useDraggable } from '@dnd-kit/core';
import { ahLog } from '../../ui';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import './style.css';

// 导入组件
import ModalBackdrop from './components/ModalBackdrop';
import ModalControls from './components/ModalControls';
import ResizeHandles from './components/ResizeHandles';
import type { BaseDragModalProps, Position, ResizeDirection } from './interface';

const SAFE_MARGIN = 20;

/**
 * BaseDragModal — 受控的可拖拽弹窗
 *
 * 位置由外部 `position` prop 驱动（唯一真相源）。
 * resize 期间为保证流畅度对 DOM 做即时写入，结束后通过 onResize / onResizeEnd 回调上报。
 */
const BaseDragModal: React.FC<BaseDragModalProps> = ({
  visible = false,
  title,
  width = 520,
  children,
  footer,
  afterClose,
  closable = true,
  onClose,
  maskClosable = true,
  mask = true,
  maskStyle,
  wrapClassName,
  wrapStyle,
  bodyStyle,
  footerStyle,
  headerStyle,
  zIndex = 1000,
  minWidth = 300,
  height,
  minHeight = 200,
  domId = 'draggable-modal',
  position: externalPosition,
  isPinned: externalIsPinned,
  isPinnedIcon = true,
  onPinnedChange,
  resizable = true,
  onResize,
  onResizeEnd,
  destroyOnClose = false,
  titleRender
}) => {
  // ─── 位置：完全受控，来自外部 ──────────────────────────────
  const position: Position = externalPosition ?? { x: 0, y: 0 };
  const initialHeight = Math.max(typeof height === 'number' ? height : minHeight, minHeight);

  // ─── 内部 UI 状态 ──────────────────────────────────────────
  const [isPinned, setIsPinned] = useState(externalIsPinned ?? false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [modalSize, setModalSize] = useState<{ width: number; height: number }>({
    width: typeof width === 'number' ? width : 520,
    height: initialHeight
  });

  // ─── Refs ──────────────────────────────────────────────────
  const resizeStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialSize = useRef<{ width: number; height: number } | null>(null);
  const resizeStartPosition = useRef<Position | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const currentWidth = useRef<number>(typeof width === 'number' ? width : 520);
  const currentHeight = useRef<number>(initialHeight);
  const resizeDirection = useRef<ResizeDirection>(null);
  const resizePointerId = useRef<number | null>(null);
  const resizeHandleEl = useRef<HTMLElement | null>(null);
  const lastNonFullscreenSize = useRef<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: draggableState
  } = useDraggable({ id: domId });

  // ─── 同步 external props → internal state ─────────────────
  useEffect(() => {
    if (externalIsPinned !== undefined) setIsPinned(externalIsPinned);
  }, [externalIsPinned]);

  useEffect(() => {
    setIsDragging(draggableState);
    if (draggableState) setIsBlurred(true);
  }, [draggableState]);

  useEffect(() => {
    currentWidth.current = typeof width === 'number' ? width : 520;
    currentHeight.current = Math.max(typeof height === 'number' ? height : minHeight, minHeight);
    setModalSize({ width: currentWidth.current, height: currentHeight.current });
  }, [width, height, minHeight]);

  // ─── 全局点击关闭（可见 + 非固定 + maskClosable + mask）───
  useEffect(() => {
    if (!visible || isPinned || !maskClosable || !mask) return;

    const handleGlobalClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose?.();
        afterClose?.();
      }
    };

    document.addEventListener('mousedown', handleGlobalClick, true);
    return () => document.removeEventListener('mousedown', handleGlobalClick, true);
  }, [visible, isPinned, maskClosable, mask, onClose, afterClose]);

  // ─── 边界样式类 ────────────────────────────────────────────
  const updateBoundaryClasses = useCallback(
    (el: HTMLElement | null, atMaxW: boolean, atMaxH: boolean, atLeftBound: boolean) => {
      if (!el) return;
      el.classList.toggle('at-max-width', atMaxW);
      el.classList.toggle('at-max-height', atMaxH);
      el.classList.toggle('at-left-bound', atLeftBound);
    },
    []
  );

  // ─── 左侧 resize 计算 ─────────────────────────────────────
  const handleLeftResize = useCallback(
    (deltaX: number, startPos: Position) => {
      if (!initialSize.current) return { newWidth: currentWidth.current, newX: startPos.x };

      const actualMoveX = Math.min(deltaX, startPos.x - SAFE_MARGIN);
      const newX = Math.max(SAFE_MARGIN, startPos.x + actualMoveX);
      const actualDeltaX = startPos.x - newX;
      let newWidth = initialSize.current.width + actualDeltaX;

      if (newWidth < minWidth) {
        newWidth = minWidth;
        return { newWidth, newX: startPos.x + (initialSize.current.width - minWidth) };
      }

      return { newWidth, newX };
    },
    [minWidth]
  );

  // ─── resize: mousemove ─────────────────────────────────────
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (
        !resizeStartPos.current ||
        !initialSize.current ||
        !modalRef.current ||
        !resizeDirection.current ||
        !resizeStartPosition.current
      )
        return;

      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;

      const modalRect = modalRef.current.getBoundingClientRect();
      const modalLeft = modalRect.left;
      const modalTop = modalRect.top;
      const maxAvailableWidth = window.innerWidth - modalLeft - SAFE_MARGIN;
      const maxAvailableHeight = window.innerHeight - modalTop - SAFE_MARGIN;

      let newWidth = currentWidth.current;
      let newHeight = currentHeight.current;
      let newX = resizeStartPosition.current.x;

      if (['right', 'bottom-right'].includes(resizeDirection.current)) {
        newWidth = Math.max(
          minWidth,
          Math.min(initialSize.current.width + deltaX, maxAvailableWidth)
        );
      }

      if (['left', 'bottom-left'].includes(resizeDirection.current)) {
        const result = handleLeftResize(deltaX, resizeStartPosition.current);
        newWidth = result.newWidth;
        newX = result.newX;
      }

      if (['bottom', 'bottom-right', 'bottom-left'].includes(resizeDirection.current)) {
        newHeight = Math.max(
          minHeight,
          Math.min(initialSize.current.height + deltaY, maxAvailableHeight)
        );
      }

      updateBoundaryClasses(
        modalRef.current,
        newWidth >= maxAvailableWidth - 5,
        newHeight >= maxAvailableHeight - 5,
        newX <= SAFE_MARGIN
      );

      // 直接操作 DOM 保证流畅度
      modalRef.current.style.width = `${newWidth}px`;
      if (['bottom', 'bottom-right', 'bottom-left'].includes(resizeDirection.current)) {
        modalRef.current.style.height = `${newHeight}px`;
      }
      if (newX !== resizeStartPosition.current.x) {
        modalRef.current.style.left = `${newX}px`;
      }

      currentWidth.current = newWidth;
      currentHeight.current = newHeight;
      onResize?.({ width: newWidth, height: newHeight });
    },
    [handleLeftResize, minHeight, minWidth, onResize, updateBoundaryClasses]
  );

  /**
   * 释放指针捕获并摘掉全局监听，避免跨域 iframe 把后续事件吃掉。
   */
  const releaseResizePointer = useCallback((event?: PointerEvent) => {
    const handle = resizeHandleEl.current;
    const pointerId = event?.pointerId ?? resizePointerId.current;
    if (handle && pointerId != null && handle.hasPointerCapture(pointerId)) {
      handle.releasePointerCapture(pointerId);
    }
    resizeHandleEl.current = null;
    resizePointerId.current = null;
  }, []);

  // ─── resize: pointerup ─────────────────────────────────────
  const handleResizeEndInternal = useCallback(
    (event?: PointerEvent) => {
      releaseResizePointer(event);
      setIsResizing(false);

      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        setModalSize({ width: rect.width, height: rect.height });
        updateBoundaryClasses(modalRef.current, false, false, false);
      }

      resizeStartPos.current = null;
      initialSize.current = null;
      resizeStartPosition.current = null;
      resizeDirection.current = null;

      document.removeEventListener('pointermove', stableResizeMove);
      document.removeEventListener('pointerup', stableResizeEnd);
      document.removeEventListener('pointercancel', stableResizeEnd);

      onResizeEnd?.();
    },
    [onResizeEnd, releaseResizePointer, updateBoundaryClasses]
  );

  // ─── 稳定的事件监听器包装器（ref 转发，identity 永不变）──
  const resizeMoveRef = useRef(handleResizeMove);
  const resizeEndRef = useRef(handleResizeEndInternal);
  useEffect(() => {
    resizeMoveRef.current = handleResizeMove;
    resizeEndRef.current = handleResizeEndInternal;
  }, [handleResizeMove, handleResizeEndInternal]);

  const stableResizeMove = useCallback((e: PointerEvent) => resizeMoveRef.current(e), []);
  const stableResizeEnd = useCallback((e: PointerEvent) => resizeEndRef.current(e), []);

  // ─── resize: pointerdown ───────────────────────────────────
  const handleResizeStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();

      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);
      resizeHandleEl.current = handle;
      resizePointerId.current = e.pointerId;

      setIsResizing(true);
      resizeDirection.current = direction;

      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        resizeStartPos.current = { x: e.clientX, y: e.clientY };
        initialSize.current = { width: rect.width, height: rect.height };
        resizeStartPosition.current = { x: rect.left, y: rect.top };

        document.addEventListener('pointermove', stableResizeMove);
        document.addEventListener('pointerup', stableResizeEnd);
        document.addEventListener('pointercancel', stableResizeEnd);
      }
    },
    [stableResizeEnd, stableResizeMove]
  );

  // 卸载时兜底清理
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', stableResizeMove);
      document.removeEventListener('pointerup', stableResizeEnd);
      document.removeEventListener('pointercancel', stableResizeEnd);
    };
  }, [stableResizeEnd, stableResizeMove]);

  // ─── 关闭 / 遮罩点击 ──────────────────────────────────────
  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClose?.();
      afterClose?.();
    },
    [onClose, afterClose]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (maskClosable && mask && !isPinned) handleClose(e);
    },
    [maskClosable, mask, isPinned, handleClose]
  );

  // ─── 固定 ─────────────────────────────────────────────────
  const togglePin = useCallback(() => {
    const next = !isPinned;
    ahLog('togglePin:固定状态', next);
    onPinnedChange?.(next);
    setIsPinned(next);
  }, [isPinned, onPinnedChange]);

  // ─── 全屏 ─────────────────────────────────────────────────
  const toggleFullscreen = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const next = !isFullscreen;

      if (modalRef.current) {
        if (next) {
          const rect = modalRef.current.getBoundingClientRect();
          lastNonFullscreenSize.current = {
            width: rect.width,
            height: rect.height,
            x: rect.left,
            y: rect.top
          };
        } else if (lastNonFullscreenSize.current) {
          currentWidth.current = lastNonFullscreenSize.current.width;
          currentHeight.current = lastNonFullscreenSize.current.height;
          setModalSize({
            width: lastNonFullscreenSize.current.width,
            height: lastNonFullscreenSize.current.height
          });
          // 通过 onResize 让 Provider 感知恢复的尺寸
          onResize?.({
            width: lastNonFullscreenSize.current.width,
            height: lastNonFullscreenSize.current.height
          });
        }
      }

      setIsFullscreen(next);
    },
    [isFullscreen, onResize]
  );

  // ─── 样式计算 ──────────────────────────────────────────────
  const getModalStyle = (): CSSProperties => {
    const base: CSSProperties = { zIndex };

    if (isFullscreen) return base;

    return {
      ...base,
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: typeof width === 'string' ? width : `${modalSize.width}px`,
      height: `${modalSize.height}px`,
      minWidth: `${minWidth}px`,
      minHeight: `${minHeight}px`
    };
  };

  // ─── 渲染 ─────────────────────────────────────────────────
  if (!visible && destroyOnClose) return null;

  return (
    <div style={{ display: visible ? 'flex' : 'none' }}>
      <ModalBackdrop
        visible={visible}
        mask={mask}
        isBlurred={isBlurred || isDragging}
        wrapClassName={wrapClassName}
        wrapStyle={wrapStyle}
        maskStyle={maskStyle}
        zIndex={zIndex}
        onBackdropClick={handleBackdropClick}
      />
      <div
        ref={modalRef}
        id={domId}
        className={`ah-drag-modal ${isPinned ? 'pinned' : ''} ${isResizing ? 'resizing' : ''} ${isFullscreen ? 'fullscreen' : ''} ${wrapClassName || ''}`}
        style={{ ...getModalStyle(), ...wrapStyle }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsBlurred(true)}
        onMouseLeave={() => {
          if (!isDragging && !isResizing) setIsBlurred(false);
        }}
      >
        <div className="ah-drag-modal-header" style={headerStyle}>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`ah-drag-modal-title-area ${isDragging ? 'dragging' : ''} ${isFullscreen ? 'no-drag' : ''}`}
          >
            {titleRender ? titleRender() : <div className="ah-drag-modal-title">{title}</div>}
          </div>
          <ModalControls
            isPinned={isPinned}
            isPinnedIcon={isPinnedIcon}
            isFullscreen={isFullscreen}
            closable={closable}
            onPinClick={togglePin}
            onFullscreenClick={toggleFullscreen}
            onCloseClick={handleClose}
          />
        </div>
        <div className="ah-drag-modal-body" style={bodyStyle}>
          {children}
        </div>
        {footer !== null && (
          <div className="ah-drag-modal-footer" style={footerStyle}>
            {footer}
          </div>
        )}

        {isResizing ? <div className="ah-drag-modal-resize-shield" /> : null}

        <ResizeHandles
          resizable={resizable}
          isFullscreen={isFullscreen}
          onResizeStart={handleResizeStart}
        />
      </div>
    </div>
  );
};

export default BaseDragModal;

// 重新导出所需的类型
export type { BaseDragModalProps as DragModalProps } from './interface';
