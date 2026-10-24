import React from 'react';
import AhDatePicker from './AhDatePicker';
import AhCascader from './AhCascader';
import AhSelect from './AhSelect';
import { Input, Stepper, Switch, TextArea } from 'antd-mobile';
import AhFileUpload from './AhFileUpload';
import { IFormColumns, IAhFormItemProps } from '@allahjs/utils';

/**
 * 根据规则生成必选dom
 * @param rest
 */
export const buildRequiredDom = (rest: IFormColumns['formItemProps']) => {
  if (!rest) {
    return null;
  }
  // 判断是否必填
  const isRequired =
    rest.required ||
    rest.rules?.some((item: any) => {
      if (Array.isArray(item)) {
        return item.some(i => i.required);
      }
      return 'required' in item ? item.required : false;
    });
  return isRequired ? (
    <span
      style={{
        color: '#ff4d4f',
        marginRight: 4,
        fontSize: 14
      }}
    >
      *
    </span>
  ) : null;
};

/**
 * 生成表单的label
 */
export const buildLabel = (item: any) => {
  const title = item.label || item.title;

  if (!title) {
    return null;
  }

  let style: React.CSSProperties = {};

  // 如果是垂直布局，那么就不限制长度
  if (item.layout !== 'vertical') {
    style = {
      width: 100,
      marginRight: 12,
      display: 'flex',
      alignItems: 'center'
    };
  }

  return (
    <div style={style}>
      {item.title && (
        <span
          style={{
            color: '#666',
            fontSize: item.layout !== 'vertical' ? 16 : 14
          }}
        >
          {title}
          {buildRequiredDom(item as any)}
        </span>
      )}
    </div>
  );
};

/**
 * 获取外部的样式
 */
export const getViewStyle = (layout: IAhFormItemProps['layout'] = 'horizontal', defStyle: any) => {
  return layout === 'vertical'
    ? {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginTop: 8,
        minHeight: 40,
        ...defStyle
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 40,
        ...defStyle
      };
};

/**
 * 判断是否为整数类型
 * @param item 表单项配置
 * @returns 是否为整数
 */
const isIntegerType = (item: any): boolean => {
  // 检查 formItemProps.rules 中是否有 type: 'integer'
  const rules = item.formItemProps?.rules || item.rules || [];
  const hasIntegerRule = rules.some((rule: any) => rule.type === 'integer');

  // 检查 fieldProps 中是否明确指定了 step 为整数
  const step = item.fieldProps?.step || item.step;
  const hasIntegerStep = step === 1 || step === '1';

  // 检查是否明确指定了 precision 为 0（表示不允许小数）
  const precision = item.fieldProps?.precision || item.precision;
  const hasZeroPrecision = precision === 0;

  return hasIntegerRule || hasIntegerStep || hasZeroPrecision;
};

export type IRenderFunObj = Record<
  string,
  (params: { formItemProps: any; fieldProps: any; columns: IFormColumns }) => React.ReactNode
>;

export const buildFormItem = (item: any, renderFunObj?: IRenderFunObj) => {
  const { formItemProps = {}, defaultValue: _1, fieldProps, ...other } = item;

  const newFieldProps = { ...(formItemProps.fieldProps || {}), ...fieldProps };

  newFieldProps.placeholder = item?.placeholder || item.fieldProps?.placeholder || '请输入';

  if (item.renderFunKey && renderFunObj) {
    const renderFun = renderFunObj[item.renderFunKey];
    if (renderFun) {
      return renderFun({
        formItemProps,
        fieldProps: newFieldProps,
        columns: other
      });
    }
  }

  // 如果是详情模式
  const placeholderFun = () => {
    if (item.details) {
      return '未填写';
    }
    return newFieldProps.placeholder;
  };

  // 数字输入框的提示
  const numberPlaceholderFun = () => {
    // 需要根据最大最小啥的来进行提示
    if (newFieldProps.min !== undefined && newFieldProps.max !== undefined) {
      return `请输入 ${newFieldProps.min} 到 ${newFieldProps.max} 之间的数字`;
    }
    if (newFieldProps.min !== undefined) {
      return `请输入不小于 ${newFieldProps.min} 的数字`;
    }
    if (newFieldProps.max !== undefined) {
      return `请输入不大于 ${newFieldProps.max} 的数字`;
    }
    return '请输入数字';
  };

  switch (item.valueType) {
    case 'select':
      return <AhSelect {...formItemProps} {...other} {...newFieldProps} mode="single" />;
    case 'checkbox':
      return <AhSelect {...formItemProps} {...other} {...newFieldProps} mode="multiple" />;
    case 'radio':
      return (
        <AhSelect
          {...formItemProps}
          {...other}
          {...newFieldProps}
          mode="single"
          optionMode="radio"
        />
      );
    case 'date':
      return <AhDatePicker {...formItemProps} {...other} {...newFieldProps} />;
    case 'datetime':
      return <AhDatePicker {...formItemProps} {...other} {...newFieldProps} mode="datetime" />;
    case 'time':
      return <AhDatePicker {...formItemProps} {...other} {...newFieldProps} mode="time" />;
    case 'second':
      return <AhDatePicker {...formItemProps} {...other} {...newFieldProps} mode="second" />;
    case 'cascader':
      return <AhCascader {...formItemProps} {...other} {...newFieldProps} />;
    case 'textarea':
      if (other.details) {
        other.readOnly = true;
      }
      return <TextArea {...formItemProps} {...other} {...newFieldProps} />;
    case 'image':
      return <AhFileUpload {...formItemProps} {...other} {...newFieldProps} imageOnly />;
    case 'file':
      return <AhFileUpload {...formItemProps} {...other} {...newFieldProps} />;
    case 'digit':
      if (other.details) {
        return (
          <Input
            {...formItemProps}
            {...other}
            {...newFieldProps}
            readOnly
            type="number"
            step={newFieldProps.step || 'any'}
            placeholder={numberPlaceholderFun()}
          />
        );
      }
      // 根据是否为整数类型选择不同的组件
      if (isIntegerType(item)) {
        // 整数使用 Stepper 组件
        return (
          <Stepper
            {...formItemProps}
            {...fieldProps}
            {...other}
            step={newFieldProps.step || 1}
            min={newFieldProps.min}
            max={newFieldProps.max}
            disabled={item.disabled || newFieldProps.disabled}
          />
        );
      }
      // 非整数使用 Input 组件
      return (
        <Input
          {...formItemProps}
          {...other}
          {...newFieldProps}
          type="number"
          step={newFieldProps.step || 'any'}
          placeholder={numberPlaceholderFun()}
        />
      );
    case 'switch':
      return <Switch {...formItemProps} {...other} {...newFieldProps} />;

    case 'stepper':
      if (other.details) {
        return (
          <Input
            {...formItemProps}
            {...other}
            {...newFieldProps}
            readOnly
            type="number"
            step={newFieldProps.step || 'any'}
            placeholder={newFieldProps.placeholder || '请输入'}
          />
        );
      }
      return (
        <Stepper
          {...formItemProps}
          {...newFieldProps}
          {...other}
          style={{
            marginTop: 4
          }}
        />
      );
    default:
      return (
        <Input
          readOnly={other.details}
          {...formItemProps}
          {...other}
          {...newFieldProps}
          placeholder={placeholderFun()}
        />
      );
  }
};
