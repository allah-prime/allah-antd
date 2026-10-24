import type { IAntTreeNode, IOptions7 } from '@allahjs/utils';
import type { CascaderProps, GetProp } from 'antd';

export type IAsyncCascaderProps = {
  /**
   * 当数据变化的时候触发
   * @param value
   * @param all
   */
  onChange?: (value: string[], all: IAntTreeNode[]) => void;
  /**
   * 受控组件的值，在父组件可以通过受控的模式，来控制子组件的值
   */
  value?: string[];
  /**
   * 默认要显示的中文
   */
  valueText?: string;
  /**
   * 自定义的级联组件类型
   */
  cascaderProps?: GetProp<CascaderProps>;
  /**
   * 获取数据的方法
   */
  asyncReq: (v?: string) => Promise<IAntTreeNode[]>;
  /**
   * 默认显示的文字
   */
  label?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是在表单里面，还是在筛选里面
   */
  type?: 'form' | 'filter';
  /**
   * 是多选吗
   */
  multiple?: boolean;
  children?: any;
  /**
   * 获取默认值的方法
   */
  valuesReq?: (v: string) => Promise<IOptions7<string, string>[]>;
  /**
   * 占位
   */
  placeholder?: string;
  /**
   * 是否使用antd默认样式 - 默认不用
   */
  defStyle?: boolean;
  /**
   * 是否显示清除按钮，默认显示
   */
  allowClear?: boolean;
};
