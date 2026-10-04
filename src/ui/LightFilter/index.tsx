import { FilterOutlined } from '@ant-design/icons';
import type { LightFilterFooterRender, ProFormInstance } from '@ant-design/pro-components';
import { FieldLabel, FilterDropdown, ProForm, useIntl } from '@ant-design/pro-components';
import type { BaseFormProps } from '@ant-design/pro-components/es/form/BaseForm';
import type { FormProps, PopoverProps } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import type { TooltipPlacement } from 'antd/lib/tooltip';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.less';

type ILightFilterValues = object;
type ILightFilterRecord = Record<string, unknown>;
type ILightFilterVariant = 'outlined' | 'filled' | 'borderless';
type IFieldPropsLike = {
  placement?: TooltipPlacement;
  variant?: ILightFilterVariant;
  onChange?: (...args: unknown[]) => unknown;
} & Record<string, unknown>;
type ILightFilterItemProps = {
  fieldProps?: IFieldPropsLike;
  proFieldProps?: Record<string, unknown>;
  label?: React.ReactNode;
  name?: string;
  secondary?: boolean;
  valuePropName?: string;
  children?: React.ReactNode;
  variant?: ILightFilterVariant;
};
type ILightFilterItem = React.ReactElement<ILightFilterItemProps>;

const isLightFilterItem = (item: React.ReactNode): item is ILightFilterItem =>
  React.isValidElement<ILightFilterItemProps>(item);

export type LightFilterProps<T extends ILightFilterValues = ILightFilterValues> = {
  children?: React.ReactNode | React.ReactNode[];
  collapse?: boolean;
  collapseLabel?: React.ReactNode;
  variant?: ILightFilterVariant;
  ignoreRules?: boolean;
  footerRender?: LightFilterFooterRender;
  placement?: TooltipPlacement;
  popoverProps?: Omit<
    PopoverProps,
    'children' | 'content' | 'trigger' | 'open' | 'onOpenChange' | 'placement'
  >;
} & Omit<FormProps<T>, 'onFinish'> &
  Omit<BaseFormProps<T, ILightFilterValues>, 'children'>;

type ILightFilterContainerProps = {
  items: React.ReactNode[];
  size?: SizeType;
  values: ILightFilterRecord;
  onValuesChange: (values: ILightFilterRecord) => void;
  collapse?: boolean;
  collapseLabel?: React.ReactNode;
  variant?: ILightFilterVariant;
  footerRender?: LightFilterFooterRender;
  placement?: TooltipPlacement;
  popoverProps?: Omit<
    PopoverProps,
    'children' | 'content' | 'trigger' | 'open' | 'onOpenChange' | 'placement'
  >;
};

const LightFilterContainer: React.FC<ILightFilterContainerProps> = (props) => {
  const {
    items,
    size = 'medium',
    collapse,
    collapseLabel,
    onValuesChange,
    variant = 'borderless',
    values,
    footerRender,
    placement,
    popoverProps
  } = props;
  const intl = useIntl();

  const [open, setOpen] = useState(false);
  const [moreValues, setMoreValues] = useState<ILightFilterRecord>(() => ({
    ...values
  }));

  useEffect(() => {
    setMoreValues((prev) => ({
      ...prev,
      ...values
    }));
  }, [values]);

  const collapseLabelNode = useMemo(() => {
    if (collapseLabel) {
      return collapseLabel;
    }
    if (collapse) {
      return <FilterOutlined className="ah-light-filter-collapse-icon" />;
    }
    return (
      <FieldLabel
        variant={variant}
        size={size}
        label={intl.getMessage('form.lightFilter.more', '更多筛选')}
      />
    );
  }, [collapse, collapseLabel, intl, size, variant]);

  const { collapseItems, outsideItems } = useMemo(() => {
    const collapseItemsArr: React.ReactNode[] = [];
    const outsideItemsArr: React.ReactNode[] = [];
    items.forEach((item) => {
      if (!isLightFilterItem(item)) {
        outsideItemsArr.push(item);
        return;
      }
      const { secondary } = item.props || {};
      if (secondary || collapse) {
        collapseItemsArr.push(item);
      } else {
        outsideItemsArr.push(item);
      }
    });
    return {
      collapseItems: collapseItemsArr,
      outsideItems: outsideItemsArr
    };
  }, [collapse, items]);

  const isEffective = Object.keys(values).some((key) => {
    const v = values[key];
    // 排除 undefined 和 null，只判断有效筛选值
    if (v === undefined || v === null) {
      return false;
    }
    // 数组需要检查长度
    if (Array.isArray(v)) {
      return v.length > 0;
    }
    // 其他值（0, false, '' 等）都是有效筛选值
    return true;
  });

  return (
    <div
      className={[
        'ah-light-filter',
        `ah-light-filter-${size}`,
        isEffective ? 'ah-light-filter-effective' : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="ah-light-filter-container">
        {outsideItems.map((child, index) => {
          if (!isLightFilterItem(child)) {
            return child;
          }
          const { key } = child;
          const { fieldProps } = child.props || {};
          const newPlacement = fieldProps?.placement || placement;

          return (
            <div className="ah-light-filter-item" key={key || index}>
              {React.cloneElement(child, {
                fieldProps: {
                  ...child.props.fieldProps,
                  placement: newPlacement,
                  variant: 'borderless'
                },
                proFieldProps: {
                  ...child.props.proFieldProps,
                  light: true,
                  label: child.props.label,
                  variant
                },
                variant
              })}
            </div>
          );
        })}
        {collapseItems.length ? (
          <div className="ah-light-filter-item" key="more">
            <FilterDropdown
              padding={24}
              open={open}
              onOpenChange={setOpen}
              placement={placement}
              popoverProps={popoverProps}
              label={collapseLabelNode}
              footerRender={footerRender}
              footer={{
                onConfirm: () => {
                  onValuesChange({
                    ...moreValues
                  });
                  setOpen(false);
                },
                onClear: () => {
                  const clearValues: ILightFilterRecord = {};
                  collapseItems.forEach((child) => {
                    if (!isLightFilterItem(child)) {
                      return;
                    }
                    const { name } = child.props;
                    if (name) {
                      clearValues[name] = undefined;
                    }
                  });
                  onValuesChange(clearValues);
                }
              }}
            >
              {collapseItems.map((child) => {
                if (!isLightFilterItem(child)) {
                  return child;
                }
                const { key } = child;
                const { name, fieldProps } = child.props;
                const currentValue = name ? moreValues[name] : undefined;
                const newFieldProps: IFieldPropsLike = {
                  ...fieldProps,
                  onChange: (eventValue: unknown, ...args: unknown[]) => {
                    const value =
                      typeof eventValue === 'object' &&
                      eventValue !== null &&
                      'target' in eventValue
                        ? (eventValue as { target?: { value?: unknown } }).target?.value
                        : eventValue;
                    if (name) {
                      setMoreValues((prev) => ({
                        ...prev,
                        [name]: value
                      }));
                    }
                    fieldProps?.onChange?.(eventValue, ...args);
                    return false;
                  }
                };
                if (name && Object.hasOwn(moreValues, name)) {
                  (newFieldProps as Record<string, unknown>)[child.props.valuePropName || 'value'] =
                    currentValue;
                }
                const newPlacement = fieldProps?.placement || placement;

                return (
                  <div className="ah-light-filter-line" key={key}>
                    {React.cloneElement(child, {
                      fieldProps: {
                        ...newFieldProps,
                        placement: newPlacement,
                        variant
                      }
                    })}
                  </div>
                );
              })}
            </FilterDropdown>
          </div>
        ) : null}
      </div>
    </div>
  );
};

function LightFilter<T extends ILightFilterValues = ILightFilterValues>(
  props: LightFilterProps<T>
) {
  const {
    size,
    collapse,
    collapseLabel,
    initialValues,
    onValuesChange,
    form: userForm,
    placement,
    formRef: userFormRef,
    variant,
    ignoreRules,
    footerRender,
    popoverProps,
    children,
    ...rest
  } = props;
  void ignoreRules;

  const [values, setValues] = useState<ILightFilterRecord>(() => ({
    ...(initialValues as ILightFilterRecord)
  }));
  const innerFormRef = useRef<ProFormInstance | undefined>(undefined);
  const formRef = userFormRef ?? innerFormRef;

  return (
    <ProForm
      size={size}
      initialValues={initialValues}
      form={userForm}
      contentRender={(items: React.ReactNode[] | undefined) => (
        <LightFilterContainer
          items={(items ?? []).flatMap((item) => {
            if (!isLightFilterItem(item)) {
              return item;
            }
            const displayName =
              typeof item.type === 'string'
                ? undefined
                : (item.type as { displayName?: string }).displayName;
            if (displayName === 'ProForm-Group') {
              return item.props.children;
            }
            return item;
          })}
          size={size}
          variant={variant || 'borderless'}
          collapse={collapse}
          collapseLabel={collapseLabel}
          placement={placement}
          popoverProps={popoverProps}
          values={values || {}}
          footerRender={footerRender}
          onValuesChange={(newValues: ILightFilterRecord) => {
            const newAllValues = {
              ...values,
              ...newValues
            };
            setValues(newAllValues);
            formRef.current?.setFieldsValue(
              newAllValues as unknown as Parameters<ProFormInstance<T>['setFieldsValue']>[0]
            );
            formRef.current?.submit();
            onValuesChange?.(newValues as Partial<T>, newAllValues as T);
          }}
        />
      )}
      formRef={formRef}
      formItemProps={{
        colon: false,
        labelAlign: 'left'
      }}
      fieldProps={{
        style: {
          width: undefined
        }
      }}
      {...rest}
      onValuesChange={(changedValues: Partial<T>, allValues: T) => {
        setValues(allValues as ILightFilterRecord);
        onValuesChange?.(changedValues, allValues);
        formRef.current?.submit();
      }}
    >
      {children}
    </ProForm>
  );
}

export default LightFilter;
