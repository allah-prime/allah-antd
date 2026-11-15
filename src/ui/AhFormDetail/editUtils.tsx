
import React from 'react';
import dayjs from 'dayjs';
import {
  ProFormCascader,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
  ProFormText,
  ProFormTimePicker,
  ProFormTreeSelect
} from '@ant-design/pro-components';
import { IFormColumns, ProSchemaValueEnumObj } from '@allahjs/utils';

/** date 类型默认格式 */
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
/** datetime 类型默认格式 */
const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 获取列的唯一标识（dataIndex 支持数组嵌套）
 */
export const getColumnKey = <T extends Record<string, any>>(column: IFormColumns<T>): string => {
  const { dataIndex, key } = column;
  if (key !== undefined) return String(key);
  if (Array.isArray(dataIndex)) return dataIndex.join('.');
  return String(dataIndex ?? '');
};

/**
 * 按 dataIndex 读取字段的值（支持数组嵌套路径）
 */
export const getFieldValueByColumn = <T extends Record<string, any>>(
  record: T | undefined,
  column: IFormColumns<T>
): any => {
  if (!record) return undefined;
  if (Array.isArray(column.dataIndex)) {
    return column.dataIndex.reduce(
      (acc: any, cur) => (acc === undefined || acc === null ? acc : acc[cur as any]),
      record
    );
  }
  return record[column.dataIndex as keyof T];
};

/**
 * 按 dataIndex 设置字段的值（支持数组嵌套路径，返回浅拷贝的新对象）
 */
export const setFieldValueByColumn = <T extends Record<string, any>>(
  record: T | undefined,
  column: IFormColumns<T>,
  value: any
): T => {
  const path = Array.isArray(column.dataIndex)
    ? (column.dataIndex as string[]).map(String)
    : [String(column.dataIndex ?? '')];

  const setByPath = (obj: Record<string, any>, keys: string[], val: any): Record<string, any> => {
    const [head, ...rest] = keys;
    if (head === undefined) return obj;
    return { ...obj, [head]: rest.length ? setByPath(obj?.[head] || {}, rest, val) : val };
  };

  return setByPath({ ...(record || {}) }, path, value) as T;
};

/**
 * 归一化 valueEnum：支持函数（传入当前 record 求值）和 Map（转为对象）
 */
const normalizeValueEnum = <T extends Record<string, any>>(
  valueEnum: IFormColumns<T>['valueEnum'],
  record: T
): ProSchemaValueEnumObj | undefined => {
  if (!valueEnum) return undefined;
  let resolved: any = valueEnum;
  if (typeof valueEnum === 'function') {
    resolved = (valueEnum as any)(record);
  }
  if (resolved instanceof Map) {
    const obj: Record<string, any> = {};
    resolved.forEach((item, mapKey) => {
      obj[String(mapKey)] = item;
    });
    return obj as ProSchemaValueEnumObj;
  }
  return resolved as ProSchemaValueEnumObj;
};

/**
 * 把列的校验配置（verRules + rules）转成 antd Form 的 rules
 */
const buildFieldRules = <T extends Record<string, any>>(column: IFormColumns<T>): any[] | undefined => {
  const rules: any[] = [];
  const verRules = column.verRules;
  if (verRules) {
    const { required, pattern, max, min, type } = verRules;
    if (required) {
      rules.push({ required: true, message: `请输入${column.title}` });
    }
    if (pattern) {
      rules.push({ pattern: new RegExp(pattern), message: `${column.title}格式不正确` });
    }
    if (max !== undefined) {
      rules.push({ max, message: `${column.title}不能超过${max}个字符` });
    }
    if (min !== undefined) {
      rules.push({ min, message: `${column.title}不能少于${min}个字符` });
    }
    if (type) {
      rules.push({ type, message: `${column.title}类型不正确` });
    }
  }
  if (column.rules?.length) {
    rules.push(...column.rules);
  }
  return rules.length ? rules : undefined;
};

/**
 * 日期值转字符串：dayjs 按 fieldProps.format（或 valueType 默认格式）格式化
 */
export const formatFieldValue = <T extends Record<string, any>>(
  value: any,
  column: IFormColumns<T>
): any => {
  const formatDate = (val: any): any => {
    if (val && dayjs.isDayjs(val)) {
      // fieldProps.format 兼容字符串（DatePicker 格式串）与函数（展示格式化）两种形态
      const fieldFormat = column.fieldProps?.format;
      const format =
        (typeof fieldFormat === 'string' ? fieldFormat : undefined) ||
        (column.valueType === 'datetime' ? DEFAULT_DATETIME_FORMAT : DEFAULT_DATE_FORMAT);
      return val.format(format);
    }
    return val;
  };

  if (value === null || value === undefined) return value;
  if (dayjs.isDayjs(value)) return formatDate(value);
  if (Array.isArray(value)) return value.map(formatDate);
  return value;
};

/**
 * 按 valueType 渲染 ProFormField（read/edit 双模式）。
 * - read：渲染 ProField 格式化文本（valueEnum 反查、日期/money/percent 格式化），绑定表单 store，改值即时响应
 * - edit：渲染控件（autoFocus / defaultOpen / textarea autoSize 等仅 edit 模式注入）
 * 统一透传 valueEnum / options / request / rules / verRules / fieldProps / disabled；
 * label 由 Descriptions 渲染，这里不设置 label；值由表单 store 统一管理（setFieldsValue 初始化）
 */
export const renderProFormField = <T extends Record<string, any>>(
  column: IFormColumns<T>,
  record: T,
  mode: 'read' | 'edit',
  fieldControlRender?: (column: IFormColumns<T>, record: T) => React.ReactNode
): React.ReactNode => {
  const { valueType, dataIndex, disabled, fieldProps, options, request } = column;
  const isEdit = mode === 'edit';

  // 编辑态接管：fieldControlRender 仅在 edit 模式生效，read 模式统一走 ProField 展示
  if (isEdit && fieldControlRender) {
    return fieldControlRender(column, record);
  }

  const name = (dataIndex ?? '') as any;
  const rules = buildFieldRules(column);
  const mergedFieldProps = {
    ...fieldProps,
    disabled: isEdit ? disabled || fieldProps?.disabled : undefined,
    // edit 模式下控件挂载即聚焦；read 模式所有字段常驻挂载，绝不能抢焦点
    autoFocus: isEdit ? ((fieldProps as any)?.autoFocus ?? true) : undefined,
    style: isEdit ? { width: '100%', ...(fieldProps?.style as object) } : fieldProps?.style
  };

  const commonProps = {
    name,
    rules,
    fieldProps: mergedFieldProps,
    proFieldProps: { mode }
  } as any;

  switch (valueType) {
    case 'textarea':
      return (
        <ProFormTextArea
          {...commonProps}
          // 默认自适应内容行数：编辑态文本域高度与查看态文字行数一致，切换时行高不跳动
          fieldProps={{
            ...mergedFieldProps,
            autoSize: isEdit ? ((fieldProps as any)?.autoSize ?? { minRows: 1, maxRows: 8 }) : undefined
          }}
        />
      );
    case 'select':
      return (
        <ProFormSelect
          {...commonProps}
          valueEnum={normalizeValueEnum(column.valueEnum, record)}
          options={options as any}
          request={request as any}
        />
      );
    case 'radio':
      return (
        <ProFormRadio.Group
          {...commonProps}
          valueEnum={normalizeValueEnum(column.valueEnum, record)}
          options={options as any}
          request={request as any}
        />
      );
    case 'date':
    case 'datetime':
    case 'dateRange':
    case 'time': {
      // edit 模式挂载即弹出选择面板（autoFocus 只聚焦输入框不会展开面板）；
      // read 模式为纯文本展示，不弹面板
      const pickerFieldProps = {
        ...mergedFieldProps,
        ...(isEdit ? { defaultOpen: (fieldProps as any)?.defaultOpen ?? true } : {})
      };
      const PickerField =
        valueType === 'date'
          ? ProFormDatePicker
          : valueType === 'datetime'
            ? ProFormDateTimePicker
            : valueType === 'dateRange'
              ? ProFormDateRangePicker
              : ProFormTimePicker;
      return <PickerField {...commonProps} fieldProps={pickerFieldProps} />;
    }
    case 'digit':
    case 'digitRange':
    case 'second':
      return <ProFormDigit {...commonProps} />;
    case 'money': {
      const moneySymbol = fieldProps?.moneySymbol;
      return (
        <ProFormDigit
          {...commonProps}
          fieldProps={{
            ...mergedFieldProps,
            prefix: isEdit && typeof moneySymbol === 'string' ? moneySymbol : undefined
          }}
        />
      );
    }
    case 'percent':
      return (
        <ProFormDigit
          {...commonProps}
          fieldProps={{ ...mergedFieldProps, suffix: isEdit ? '%' : undefined }}
        />
      );
    case 'switch':
      // read 模式经 checkedChildren/unCheckedChildren 显示「是/否」，与 renderItemContent 的旧展示对齐
      return (
        <ProFormSwitch
          {...commonProps}
          fieldProps={{
            ...mergedFieldProps,
            checkedChildren: '是',
            unCheckedChildren: '否'
          }}
        />
      );
    case 'cascader':
      return <ProFormCascader {...commonProps} request={request as any} />;
    case 'treeSelect':
      return (
        <ProFormTreeSelect
          {...commonProps}
          options={options as any}
          request={request as any}
        />
      );
    default:
      return <ProFormText {...commonProps} />;
  }
};
