import type { IAntTreeNode } from '@allahjs/utils';
import { IAhFormItemProps } from '@allahjs/utils';

export type IAhCascaderProps = IAhFormItemProps & {
  /**
   * 设置 Select 的模式为多选或标签
   */
  mode?: 'multiple' | 'tags';
  /**
   * （单选时生效）当此项为 true 时，点选每级菜单选项值都会发生变化
   */
  changeOnSelect?: boolean;
  /**
   * 值
   */
  value?: string[];
  /**
   * 请求远程数据
   */
  request?: (v?: any) => Promise<IAntTreeNode[]>;
  /**
   * 数据级别
   */
  minLevel?: number;
  /**
   * 选项
   */
  options?: IAntTreeNode[];
  /**
   * 值是否显示分隔线
   */
  valueShowDivider?: boolean;
};
