/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import { ProFormInstance, FormItemProps, IAhFormColumns } from '@allahjs/utils';

/**
 * @name 获取 ProFormInstance
 *
 * ProFormInstance 可以用来获取当前表单的一些信息
 *
 * @example 获取 name 的值 formRef.current.getFieldValue("name");
 * @example 获取所有的表单值 formRef.current.getFieldsValue(true);
 */
export type IAntdFormRef =
  | React.MutableRefObject<ProFormInstance<any> | undefined>
  | React.RefObject<ProFormInstance<any> | undefined>;

export interface IReactFormItemProps extends Omit<FormItemProps, 'style' | 'children'> {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IAhReactFormColumns<T> extends Omit<IAhFormColumns<T>, 'title'> {
  /**
   * 标题的内容，在 form 中是 label
   */
  title: React.ReactNode | string;
}
