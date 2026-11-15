import React from 'react';
import { DescriptionsProps, FormInstance } from 'antd';
import { IFormColumns, ISizeType } from '@allahjs/utils';

/**
 * AhFormDetail 组件属性接口
 */
export interface IAhFormDetailProps<T = any> {
  /** 详情项配置数组，兼容 IFormColumns */
  columns?: IFormColumns<T>[];
  /** 数据源 */
  dataSource?: T;
  /**
   * 数据的唯一id的字段 默认是id
   */
  primaryKey?: string;
  /** 请求函数，用于异步获取数据 */
  request?: () => Promise<T>;
  /**
   * 表单组id
   */
  formId?: string;
  /** 空数据时的显示文本 */
  emptyText?: string;
  /** 组件大小 */
  size?: ISizeType;
  /**
   * 是否显示边框
   */
  bordered?: boolean;
  /**
   * label的宽度
   */
  labelWidth?: number;
  /**
   *一行的 DescriptionItems 数量，可以写成像素值或支持响应式的对象写法 { xs: 8, sm: 16, md: 24}
   */
  column?: DescriptionsProps['column'];
  /**
   * 自定义表述组件配置
   */
  descriptionsProps?: DescriptionsProps;
  /**
   * 表单的请求
   */
  formGroupReq?: (formId?: string) => Promise<IFormColumns<T>[]>;
  /** 组件最小高度，用于在无数据时撑开容器，避免数据加载后突然撑高 */
  minHeight?: number | string;
  /** 无数据时的占位内容，可以是文本或自定义组件。默认使用 Skeleton 组件 */
  placeholder?: React.ReactNode;
  /** 是否显示占位内容的边框 */
  showPlaceholderBorder?: boolean;
  /**
   * 是否开启单字段编辑能力，开启后查看态字段值右侧悬停显示铅笔，点击可编辑该字段。
   * valueType 为 image / title 的字段不支持编辑
   * @default false
   */
  editable?: boolean;
  /**
   * 单字段保存回调，字段校验通过后触发。
   * 返回 true 视为保存成功，退出编辑态并更新组件内部数据；
   * 返回 false 或抛出异常则停留在编辑态。
   * 不传时视为保存成功，仅更新组件内部数据（纯前端模式）
   */
  onFieldSave?: (value: any, column: IFormColumns<T>, record: T) => Promise<boolean> | boolean;
  /** 自定义铅笔按钮渲染，默认渲染 EditOutlined 图标 */
  pencilRender?: (column: IFormColumns<T>, record: T) => React.ReactNode;
  /** 自定义编辑控件渲染，优先级高于内置的 valueType 映射 */
  fieldControlRender?: (column: IFormColumns<T>, record: T) => React.ReactNode;
  /** 单字段保存成功后的数据回调，便于外部同步最新的数据 */
  onDataChange?: (newData: T) => void;
  /** 用于获取组件内部的表单实例，可在外部做校验、取值等操作 */
  formRef?: React.MutableRefObject<FormInstance | undefined>;
}

/**
 * 详情项渲染上下文
 */
export interface IDetailRenderContext<T = any> {
  /** 当前值 */
  value: any;
  /** 完整记录 */
  record: T;
  /** 列配置 */
  column: IFormColumns<T>;
  /** 渲染类型 */
  type: 'read';
}

/**
 * 支持的值类型枚举
 */
export type DetailValueType =
  | 'text'
  | 'select'
  | 'date'
  | 'switch'
  | 'money'
  | 'percent'
  | 'option'
  | string;

/**
 * 字段属性配置
 */
export interface IDetailFieldProps {
  /** 日期格式 */
  format?: string;
  /** 货币符号 */
  moneySymbol?: string | false;
  /** 其他自定义属性 */
  [key: string]: any;
}
