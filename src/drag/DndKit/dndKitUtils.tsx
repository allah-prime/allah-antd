import type { DropAnimation, UniqueIdentifier } from '@dnd-kit/core';
import { defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { AnimateLayoutChanges } from '@dnd-kit/sortable';
import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useState } from 'react';

const animateLayoutChanges: AnimateLayoutChanges = args =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

/**
 * 可容纳元素的容器
 */
export function DroppableContainer({
  children,
  id,
  items,
  style = {}
}: {
  id: UniqueIdentifier;
  items: React.Key[];
  children: React.ReactNode;
  /**
   * 覆盖默认的样式
   */
  style?: React.CSSProperties;
}) {
  const { isDragging, setNodeRef, transition, transform } = useSortable({
    id,
    data: {
      type: 'container',
      children: items
    },
    animateLayoutChanges
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
        ...style
      }}
    >
      {children}
    </div>
  );
}

// DropAnimation是React Dnd Kit库中的一个概念，用于定义拖放操作的动画效果。在React Dnd Kit库中，可以通过定义DropAnimation对象来自定义拖放操作的动画效果。
export const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
};

export function getColor(id: UniqueIdentifier) {
  switch (String(id)[0]) {
    case 'A':
      return '#7193f1';
    case 'B':
      return '#ffda6c';
  }
  return undefined;
}

export function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
