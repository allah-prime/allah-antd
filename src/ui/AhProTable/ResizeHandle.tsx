import React from 'react';
import { Resizable } from 'react-resizable';

type HeaderProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  onColumnResize?: (width: number, widths: Record<string, number>) => void;
};

function getClientX(event: React.SyntheticEvent): number {
  const native = (event.nativeEvent ?? event) as unknown as MouseEvent | TouchEvent;
  return 'touches' in native ? native.touches[0].clientX : native.clientX;
}

/** 遵循 antd 可伸缩列示例：在 th 上接入 Resizable，保留原始标题结构。 */
export const ResizableHeaderCell = React.forwardRef<HTMLTableCellElement, HeaderProps>(
  ({ onColumnResize, children, ...rest }, ref) => {
    const cellRef = React.useRef<HTMLTableCellElement | null>(null);
    const snapshot = React.useRef<Record<string, number>>({});
    const start = React.useRef({ x: 0, width: 0 });
    const [width, setWidth] = React.useState(0);
    React.useLayoutEffect(() => {
      if (!onColumnResize || !cellRef.current) return;
      const cell = cellRef.current;
      const observer = new ResizeObserver(() => setWidth(cell.getBoundingClientRect().width));
      setWidth(cell.getBoundingClientRect().width);
      observer.observe(cell);
      return () => observer.disconnect();
    }, [onColumnResize]);
    const cell = (
      <th {...rest} ref={(node) => {
        cellRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}>{children}</th>
    );
    if (!onColumnResize) return cell;
    return (
      <Resizable
        width={width || 100}
        height={0}
        minConstraints={[64, 0]}
        axis="x"
        resizeHandles={['e']}
        onResizeStart={(event) => {
          const cells = cellRef.current?.closest('thead')?.querySelectorAll<HTMLTableCellElement>('th[data-column-key]');
          snapshot.current = {};
          cells?.forEach((cell) => { snapshot.current[cell.dataset.columnKey!] = Math.max(64, cell.getBoundingClientRect().width); });
          start.current = { x: getClientX(event), width: cellRef.current?.getBoundingClientRect().width ?? width };
        }}
        onResize={(event) => {
          const x = getClientX(event);
          onColumnResize(Math.max(64, start.current.width + x - start.current.x), snapshot.current);
        }}
        draggableOpts={{ enableUserSelectHack: false }}
        handle={<span className="ah-table-resize-handle" onClick={(event) => event.stopPropagation()} />}
      >{cell}</Resizable>
    );
  }
);
ResizableHeaderCell.displayName = 'ResizableHeaderCell';
