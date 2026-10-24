import React, { useState, useEffect, useMemo } from 'react';
import './ListCarousel.less';

export type AnimationType = 'linear' | 'bounce';

export interface ListCarouselProps<T = any> {
  /** 数据数组 */
  data: T[];
  /** 渲染每一项的函数 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 滚动速度，单位毫秒，默认1000ms */
  speed?: number;
  /** 是否自动滚动，默认true */
  autoPlay?: boolean;
  /** 组件样式类名 */
  className?: string;
  /** 组件样式 */
  style?: React.CSSProperties;
  /** 组件高度，默认200px */
  height?: number | string;
  /** 每个项目的高度，默认50px */
  itemHeight?: number;
  /** 容器可见区域能显示的项目数量，不传则自动计算 */
  visibleCount?: number;
  /** 动画类型，默认linear */
  animationType?: AnimationType;
}

/**
 * 垂直连续滚动轮播组件
 * 支持连续循环滚动效果
 */
const ListCarousel = <T,>({
  data = [],
  renderItem,
  speed = 1000,
  autoPlay = true,
  className,
  style,
  height = 200,
  itemHeight = 50,
  visibleCount,
  animationType = 'linear'
}: ListCarouselProps<T>) => {
  const [isHovered, setIsHovered] = useState(false);

  // 计算容器可见区域能显示的项目数量
  const calculatedVisibleCount = useMemo(() => {
    if (visibleCount) return visibleCount;
    const containerHeight = typeof height === 'number' ? height : parseInt(height.toString());
    return Math.ceil(containerHeight / itemHeight);
  }, [visibleCount, height, itemHeight]);

  // 判断是否需要滚动：数据量必须大于可见区域的项目数量
  const shouldScroll = useMemo(() => {
    return data.length > calculatedVisibleCount;
  }, [data.length, calculatedVisibleCount]);

  // 为了实现无限循环，我们需要复制数据
  const extendedData = useMemo(() => {
    if (data.length === 0) return [];
    if (!shouldScroll) {
      // 数据不足时，不需要复制，直接返回原数据
      return data;
    }
    // 数据充足时，复制数据两次以实现无限循环效果
    return [...data, ...data];
  }, [data, shouldScroll]);

  // 生成稳定的 key 列表
  const itemKeys = useMemo(() => {
    return extendedData.map((_, index) => `carousel-item-${Date.now()}-${index}`);
  }, [extendedData.length]);

  // 计算动画持续时间：每个项目的滚动时间 * 数据长度
  const animationDuration = data.length * speed;

  // 动态生成弹跳动画关键帧
  const bounceKeyframes = useMemo(() => {
    if (animationType !== 'bounce' || data.length === 0) return '';

    const steps = data.length;
    const stepPercentage = 100 / steps;

    let keyframes = '@keyframes ah-scroll-up-bounce-dynamic {\n';
    keyframes += '  0% { transform: translateY(0); }\n';

    for (let i = 1; i <= steps; i++) {
      const percentage = (i * stepPercentage).toFixed(1);
      keyframes += `  ${percentage}% { transform: translateY(calc(-${i} * var(--item-height))); }\n`;
    }

    keyframes += '}';
    return keyframes;
  }, [animationType, data.length]);

  // 动态注入CSS关键帧
  useEffect(() => {
    if (bounceKeyframes) {
      const styleId = 'ah-list-carousel-bounce-keyframes';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;

      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      styleElement.textContent = bounceKeyframes;
    }
  }, [bounceKeyframes]);

  // 当播放状态改变时，重新触发动画
  useEffect(() => {
    // 这个 effect 主要用于依赖更新，触发重新渲染
  }, [autoPlay, animationDuration]);

  // 鼠标事件处理函数
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 数据为空时的处理
  if (data.length === 0) {
    return (
      <div className={`ah-list-carousel-empty ${className || ''}`} style={{ ...style, height }}>
        <div className="ah-list-carousel-empty-content">暂无数据</div>
      </div>
    );
  }

  const containerStyle = {
    ...style,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div
      className={`ah-list-carousel vertical ${shouldScroll ? 'continuous' : 'static'} ah-list-carousel-${animationType} ${className || ''}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 滚动容器 */}
      <div className="ah-list-carousel-container">
        <div
          className="ah-list-carousel-track"
          style={
            {
              animationDuration: shouldScroll ? `${animationDuration}ms` : 'none',
              animationPlayState: shouldScroll && autoPlay && !isHovered ? 'running' : 'paused',
              animationName:
                shouldScroll && animationType === 'bounce'
                  ? 'ah-scroll-up-bounce-dynamic'
                  : undefined,
              '--item-height': `${itemHeight}px`,
              '--data-length': data.length
            } as React.CSSProperties
          }
        >
          {extendedData.map((item, index) => (
            <div
              key={itemKeys[index]}
              className="ah-list-carousel-item"
              style={{ height: `${itemHeight}px` }}
            >
              {renderItem(item, index % data.length)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListCarousel;
