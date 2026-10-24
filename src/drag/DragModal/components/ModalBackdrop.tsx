import React, { CSSProperties, memo, useEffect, useState } from 'react';
import type { ModalBackdropProps } from '../interface';

/**
 * 模态框背景遮罩组件
 */
const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  visible,
  mask,
  isBlurred,
  wrapClassName,
  wrapStyle,
  maskStyle,
  zIndex,
  onBackdropClick
}) => {
  // 添加过渡动画状态
  const [animationState, setAnimationState] = useState<'enter' | 'exit' | 'none'>('none');

  // 监听可见性变化，控制动画状态
  useEffect(() => {
    if (visible) {
      // 当变为可见时，开始进入动画
      setAnimationState('enter');
    } else if (animationState !== 'none') {
      // 当变为不可见且之前有动画状态时，开始退出动画
      setAnimationState('exit');
    }
  }, [visible]);

  // 只根据visible和mask判断是否显示遮罩，不再考虑isPinned
  if (!visible || !mask) {
    return null;
  }

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: zIndex - 1,
    background: 'transparent',
    ...maskStyle
  };

  // 根据动画状态设置类名
  const getAnimationClass = () => {
    switch (animationState) {
      case 'enter':
        return 'backdrop-enter backdrop-enter-active';
      case 'exit':
        return 'backdrop-exit backdrop-exit-active';
      default:
        return '';
    }
  };

  // 只有在毛玻璃效果激活时才添加点击处理函数和阻止点击穿透
  const clickHandler = isBlurred ? onBackdropClick : undefined;
  // 仅当激活毛玻璃效果时才阻止事件穿透，否则允许与下层内容交互
  const pointerEvents = isBlurred ? 'auto' : 'none';

  return (
    <div
      className={`ah-drag-modal-backdrop ${isBlurred ? 'blurred' : ''} ${wrapClassName || ''} ${getAnimationClass()}`}
      style={{ ...backdropStyle, ...wrapStyle, pointerEvents }}
      onClick={clickHandler}
    />
  );
};

export default memo(ModalBackdrop);
