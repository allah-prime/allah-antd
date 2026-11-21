import type { CSSProperties } from 'react';

/** 表单栏数 */
export type IFormColumnCount = 1 | 2 | 3;

/** 窄弹窗底栏：四边 8px，分隔线通铺，底栏贴住弹窗底边（放在 antd Modal 的 styles.footer） */
export const compactModalFooterStyle: CSSProperties = {
  margin: 0,
  padding: 8,
  borderTop: '1px solid var(--ant-color-split, #e8e8e8)'
};

/**
 * 按可编辑字段数定栏数：6 个及以下一栏，7 到 10 个两栏，超过 10 个三栏。
 * 字段数含备注等跨栏字段，不含分组标题。
 */
export function formColumnsFor(fieldCount: number): IFormColumnCount {
  if (fieldCount <= 6) return 1;
  if (fieldCount <= 10) return 2;
  return 3;
}

/** 弹窗宽度随栏数：一栏 400px，两栏 640px，三栏 min(75vw, 1280px)。字段越少，弹窗和输入框越窄 */
export function archiveModalWidth(columns: IFormColumnCount): number | string {
  if (columns === 1) return 400;
  if (columns === 2) return 640;
  return 'min(75vw, 1280px)';
}
