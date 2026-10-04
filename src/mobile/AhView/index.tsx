import React, { useRef } from 'react';

interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void; // 点击回调
  children?: React.ReactNode;
}

const AhView: React.FC<ViewProps> = ({ onClick, children, ...rest }) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    if (dx > 5 || dy > 5) {
      isDraggingRef.current = true; // 判断为滑动
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current && onClick) {
      onClick();
    }
  };

  return (
    <div
      {...rest}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};

export default AhView;
