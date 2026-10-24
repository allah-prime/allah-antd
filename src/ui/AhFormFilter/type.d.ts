import type { ProFormColumnsType, ProFormProps } from '@ant-design/pro-components';
import type { FormProps } from 'antd/lib/form/Form';

export type IAhFormFilterProps<T = any> = {
  /**
   * 表单配置
   */
  columns: ProFormColumnsType[];
  /**
   * 表单前面的配置
   */
  beforeColumns?: ProFormColumnsType[];
  /**
   * 默认显示前几个
   */
  defNum?: number;
  /**
   * 禁用的属性
   */
  disabledAttr?: string[];
  /**
   * 前面的自定义表单
   */
  beforeForms?: React.ReactNode[];
  /**
   * 加载中
   */
  loading?: boolean;
  /**
   * 表单完成的时候触发
   */
  onFinish?: (formData: T) => Promise<boolean | void>;
  /**
   * 筛选的时候触发-筛选的时候，用这个！
   */
  onFilter?: (formData: T) => void;
  /**
   * 值变化的时候触发
   */
  onValuesChange?: (changedValues: T, values?: T) => void;
  /**
   * form的ref
   */
  formRef?: ProFormProps<any, any>['formRef'];
  befFormRef?: ProFormProps<any, any>['formRef'];
  form?: FormProps['form'];
  befForm?: FormProps['form'];
  /**
   * 是否展示边框
   */
  bordered?: boolean;
};
