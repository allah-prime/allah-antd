import { useCallback, useEffect, useState } from 'react';

/** 横向滚动条「条本身厚度」兜底（无法测到时使用） */
export const FALLBACK_HORIZONTAL_SCROLLBAR_HEIGHT = 12;

const measureHorizontalScrollbarHeight = (
  container: HTMLElement,
  tableBody: HTMLElement
): number => {
  // antd sticky 横向条在 body 外，优先量它（这才是挤压 footer 的元凶）
  const stickyScroll = container.querySelector('.ant-table-sticky-scroll') as HTMLElement | null;
  if (stickyScroll && stickyScroll.offsetHeight > 0) {
    return stickyScroll.offsetHeight;
  }
  // 否则量 body 内滚动条厚度
  const measured = tableBody.offsetHeight - tableBody.clientHeight;
  if (measured > 0) {
    return measured;
  }
  return FALLBACK_HORIZONTAL_SCROLLBAR_HEIGHT;
};

/**
 * 横向和垂直滚动条检测的自定义 Hook
 * @param containerRef 容器的 ref
 * @param deps 依赖项数组，当依赖项变化时重新检测
 */
export const useScrollbarDetection = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  deps: any[] = []
) => {
  const [hasHorizontalScrollbar, setHasHorizontalScrollbar] = useState(false);
  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);
  const [horizontalScrollbarHeight, setHorizontalScrollbarHeight] = useState(0);

  const checkScrollbar = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const tableBody = container.querySelector('.ant-table-body') as HTMLElement | null;
    if (!tableBody) return;

    const hasHorizontalScroll = tableBody.scrollWidth > tableBody.clientWidth;
    // 只看 body 是否真正占了纵轴滚动条宽度。
    // antd 有 scroll.y 时表头总会预留 ~15px；内容未溢出时 body 占位为 0，固定列会错位。
    const hasVerticalScroll = tableBody.offsetWidth - tableBody.clientWidth > 0;

    tableBody.classList.toggle('has-horizontal-scrollbar', hasHorizontalScroll);
    tableBody.classList.toggle('has-vertical-scrollbar', hasVerticalScroll);

    setHasHorizontalScrollbar(hasHorizontalScroll);
    setHasVerticalScrollbar(hasVerticalScroll);
    setHorizontalScrollbarHeight(
      hasHorizontalScroll ? measureHorizontalScrollbarHeight(container, tableBody) : 0
    );
  }, [containerRef]);

  useEffect(() => {
    // 等表格 DOM / scroll 样式落稳后再测
    const timer = window.setTimeout(checkScrollbar, 50);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const handleResize = () => {
      window.setTimeout(checkScrollbar, 100);
    };

    window.addEventListener('resize', handleResize);

    const container = containerRef.current;
    let observer: MutationObserver | null = null;

    if (container) {
      observer = new MutationObserver(() => {
        window.setTimeout(checkScrollbar, 100);
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer?.disconnect();
    };
  }, [checkScrollbar, containerRef]);

  return {
    hasHorizontalScrollbar,
    hasVerticalScrollbar,
    horizontalScrollbarHeight,
    checkScrollbar
  };
};
