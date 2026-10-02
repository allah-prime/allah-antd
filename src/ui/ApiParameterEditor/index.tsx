import {
  ProForm,
  ProFormDependency,
  ProFormList,
  ProFormListProps,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { IOptions7 } from '../../theling-utils';
import { Button, ConfigProvider, Form, Tooltip } from 'antd';
import type { FormListFieldData } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import './index.less';

type NamePathArr = (string | number)[];

interface RecursiveParameterListProps extends Partial<ProFormListProps<any>> {
  name: string | (string | number)[];
  listName: string;
  basePath: NamePathArr;
  depth?: number;
  paramTypeOptions?: IOptions7<string>[];
  inOptions?: IOptions7<string>[];
  title?: React.ReactNode | false;
  showHeader?: boolean;
}

const DEFAULT_PARAM_TYPE_OPTIONS: IOptions7<string>[] = [
  { label: 'string', value: 'string', key: 'string' },
  { label: 'number', value: 'number', key: 'number' },
  { label: 'boolean', value: 'boolean', key: 'boolean' },
  { label: 'object', value: 'object', key: 'object' },
  { label: 'array', value: 'array', key: 'array' },
  { label: 'array[]', value: 'array_object', key: 'array_object' }
];

const DEFAULT_IN_OPTIONS: IOptions7<string>[] = [
  { label: 'query', value: 'query', key: 'query' },
  { label: 'body', value: 'body', key: 'body' },
  { label: 'header', value: 'header', key: 'header' },
  { label: 'path', value: 'path', key: 'path' }
];

const NESTABLE_TYPES = ['object', 'array_object'];

const EditorNotifyContext = React.createContext<() => void>(() => {});

const ghostItemProps = { noStyle: true as const };

const createEmptyParam = (isTopLevel: boolean) =>
  isTopLevel
    ? { type: 'string', in: 'query', required: false, nullable: false }
    : { type: 'string', required: false, nullable: false };

const colorizeTypeOptions = (options: IOptions7<string>[]) =>
  options.map(option => {
    const value = String(option.value ?? '');
    if (typeof option.label !== 'string') {
      return option;
    }
    return {
      ...option,
      label: (
        <span className={`theling_apiParamEditor_typeOption is-${value}`}>{option.label}</span>
      )
    };
  });

const insertAfter = (list: any[], index: number, item: any) => {
  const next = Array.isArray(list) ? [...list] : [];
  next.splice(index + 1, 0, item);
  return next;
};

const RequiredStar: React.FC<{ value?: boolean; onChange?: (value: boolean) => void }> = ({
  value,
  onChange
}) => (
  <Tooltip title="必传">
    <button
      type="button"
      className={`theling_apiParamEditor_star${value ? ' is-on' : ''}`}
      aria-label={value ? '取消必传' : '设为必传'}
      onClick={() => onChange?.(!value)}
    >
      *
    </button>
  </Tooltip>
);

const NullableMark: React.FC<{ value?: boolean; onChange?: (value: boolean) => void }> = ({
  value,
  onChange
}) => (
  <Tooltip title="允许 NULL">
    <button
      type="button"
      className={`theling_apiParamEditor_nullMark${value ? ' is-on' : ''}`}
      aria-label={value ? '取消允许 NULL' : '允许 NULL'}
      onClick={() => onChange?.(!value)}
    >
      N
    </button>
  </Tooltip>
);

interface ParameterRowProps {
  field: FormListFieldData;
  listName: string;
  basePath: NamePathArr;
  depth: number;
  paramTypeOptions: IOptions7<string>[];
  inOptions: IOptions7<string>[];
  paramNameLabel: string;
  descriptionLabel: string;
  paramTypeLabel: string;
  inLabel: string;
}

const ParameterRow: React.FC<ParameterRowProps> = ({
  field,
  listName,
  basePath,
  depth,
  paramTypeOptions,
  inOptions,
  paramNameLabel,
  descriptionLabel,
  paramTypeLabel,
  inLabel
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const form = Form.useFormInstance();
  const notify = React.useContext(EditorNotifyContext);
  const isTopLevel = listName === 'params';
  const itemPath = [...basePath, field.name];
  const typeOptions = colorizeTypeOptions(paramTypeOptions);

  const writeList = (path: NamePathArr, next: any[]) => {
    form.setFieldValue(path, next);
    notify();
  };

  const addSibling = () => {
    const list = form.getFieldValue(basePath) || [];
    writeList(basePath, insertAfter(list, Number(field.name), createEmptyParam(isTopLevel)));
  };

  const addChild = (type?: string) => {
    const currentType = type || form.getFieldValue([...itemPath, 'type']);
    const childPath =
      currentType === 'array_object' ? [...itemPath, 'items', 'properties'] : [...itemPath, 'properties'];
    const children = form.getFieldValue(childPath) || [];
    writeList(childPath, [...children, createEmptyParam(false)]);
    setIsExpanded(true);
  };

  const removeSelf = () => {
    const list = form.getFieldValue(basePath) || [];
    writeList(
      basePath,
      list.filter((_: any, index: number) => index !== Number(field.name))
    );
  };

  return (
    <div className="theling_apiParamEditor_node">
      <div className="theling_apiParamEditor_row">
        <div className="theling_apiParamEditor_name" style={{ paddingLeft: depth * 16 }}>
          <ProFormDependency name={['type']}>
            {({ type }) => {
              const nestable = NESTABLE_TYPES.includes(type);
              if (!nestable) {
                return <span className="theling_apiParamEditor_caret is-placeholder" />;
              }
              return (
                <button
                  type="button"
                  className="theling_apiParamEditor_caret"
                  aria-label={isExpanded ? '收起' : '展开'}
                  onClick={() => setIsExpanded(expanded => !expanded)}
                >
                  {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
                </button>
              );
            }}
          </ProFormDependency>
          <ProFormText
            name="name"
            placeholder={paramNameLabel}
            rules={[{ required: true, message: '' }]}
            formItemProps={ghostItemProps}
            fieldProps={{
              allowClear: false,
              className: 'theling_apiParamEditor_ghostInput'
            }}
          />
        </div>
        <div className="theling_apiParamEditor_type">
          <ProFormDependency name={['type']}>
            {({ type }) => (
              <ProFormSelect
                name="type"
                placeholder={paramTypeLabel}
                options={typeOptions}
                rules={[{ required: true, message: '' }]}
                formItemProps={ghostItemProps}
                fieldProps={{
                  variant: 'borderless',
                  allowClear: false,
                  suffixIcon: null,
                  popupMatchSelectWidth: false,
                  className: `theling_apiParamEditor_ghostSelect theling_apiParamEditor_typeSelect is-${type || ''}`,
                  style: { width: 'auto' }
                }}
              />
            )}
          </ProFormDependency>
          <ProFormDependency name={['required']}>
            {({ required: requiredValue }) => (
              <RequiredStar
                value={!!requiredValue}
                onChange={next => {
                  form.setFieldValue([...itemPath, 'required'], next);
                  notify();
                }}
              />
            )}
          </ProFormDependency>
          <ProFormDependency name={['nullable']}>
            {({ nullable }) => (
              <NullableMark
                value={!!nullable}
                onChange={next => {
                  form.setFieldValue([...itemPath, 'nullable'], next);
                  notify();
                }}
              />
            )}
          </ProFormDependency>
        </div>
        <div className="theling_apiParamEditor_in">
          {isTopLevel && (
            <ProFormSelect
              name="in"
              placeholder={inLabel}
              options={inOptions}
              rules={[{ required: true, message: '' }]}
              formItemProps={ghostItemProps}
              fieldProps={{
                variant: 'borderless',
                allowClear: false,
                suffixIcon: null,
                popupMatchSelectWidth: false,
                className: 'theling_apiParamEditor_ghostSelect theling_apiParamEditor_inSelect'
              }}
            />
          )}
        </div>
        <div className="theling_apiParamEditor_desc">
          <ProFormText
            name="description"
            placeholder={descriptionLabel}
            formItemProps={ghostItemProps}
            fieldProps={{
              allowClear: false,
              className: 'theling_apiParamEditor_ghostInput'
            }}
          />
        </div>
        <div className="theling_apiParamEditor_ops">
          <ProFormDependency name={['type']}>
            {({ type }) => (
              <button
                type="button"
                className="theling_apiParamEditor_iconBtn"
                aria-label={NESTABLE_TYPES.includes(type) ? '添加子字段' : '添加字段'}
                onClick={() => (NESTABLE_TYPES.includes(type) ? addChild(type) : addSibling())}
              >
                <PlusCircleOutlined />
              </button>
            )}
          </ProFormDependency>
          <button
            type="button"
            className="theling_apiParamEditor_iconBtn is-danger"
            aria-label="删除字段"
            onClick={removeSelf}
          >
            <MinusCircleOutlined />
          </button>
        </div>
      </div>

      {isExpanded && (
        <ProFormDependency name={['type']}>
          {({ type }) => {
            if (type === 'object') {
              return (
                <RecursiveParameterList
                  name="properties"
                  listName="properties"
                  basePath={[...itemPath, 'properties']}
                  depth={depth + 1}
                  paramTypeOptions={paramTypeOptions}
                  inOptions={inOptions}
                />
              );
            }
            if (type === 'array_object') {
              return (
                <>
                  <div className="theling_apiParamEditor_row is-meta">
                    <div className="theling_apiParamEditor_name" style={{ paddingLeft: (depth + 1) * 16 }}>
                      <span className="theling_apiParamEditor_caret is-placeholder">
                        <CaretDownOutlined />
                      </span>
                      <span className="theling_apiParamEditor_itemsLabel">ITEMS</span>
                    </div>
                    <div className="theling_apiParamEditor_type">
                      <span className="theling_apiParamEditor_typeText is-object">object</span>
                    </div>
                    <div className="theling_apiParamEditor_in" />
                    <div className="theling_apiParamEditor_desc" />
                    <div className="theling_apiParamEditor_ops">
                      <button
                        type="button"
                        className="theling_apiParamEditor_iconBtn"
                        aria-label="添加成员字段"
                        onClick={() => addChild('array_object')}
                      >
                        <PlusCircleOutlined />
                      </button>
                    </div>
                  </div>
                  <RecursiveParameterList
                    name={['items', 'properties']}
                    listName="items"
                    basePath={[...itemPath, 'items', 'properties']}
                    depth={depth + 2}
                    paramTypeOptions={paramTypeOptions}
                    inOptions={inOptions}
                  />
                </>
              );
            }
            return null;
          }}
        </ProFormDependency>
      )}
    </div>
  );
};

const RecursiveParameterList: React.FC<RecursiveParameterListProps> = ({
  name,
  listName,
  basePath,
  depth = 0,
  paramTypeOptions = DEFAULT_PARAM_TYPE_OPTIONS,
  inOptions = DEFAULT_IN_OPTIONS,
  title = '参数列表',
  showHeader: _showHeader,
  ...restProps
}) => {
  const form = Form.useFormInstance();
  const notify = React.useContext(EditorNotifyContext);
  const isTopLevel = listName === 'params';

  const paramNameLabel = '字段名';
  const descriptionLabel = '说明';
  const paramTypeLabel = '类型';
  const inLabel = '传入';

  const addRoot = () => {
    const list = form.getFieldValue(basePath) || [];
    form.setFieldValue(basePath, [...list, createEmptyParam(isTopLevel)]);
    notify();
  };

  return (
    <>
      {isTopLevel && title !== false && (
        <div className="theling_apiParamEditor_toolbar">
          <span className="theling_apiParamEditor_title">{title}</span>
          <Button
            type="text"
            size="small"
            className="theling_apiParamEditor_toolbarAdd"
            icon={<PlusOutlined />}
            onClick={addRoot}
          >
            添加参数
          </Button>
        </div>
      )}

      <ProFormList
        name={name}
        creatorButtonProps={false}
        copyIconProps={false}
        deleteIconProps={false}
        actionRender={() => []}
        itemRender={({ listDom }) => listDom}
        {...restProps}
      >
        {field => (
          <ParameterRow
            field={field}
            listName={listName}
            basePath={basePath}
            depth={depth}
            paramTypeOptions={paramTypeOptions}
            inOptions={inOptions}
            paramNameLabel={paramNameLabel}
            descriptionLabel={descriptionLabel}
            paramTypeLabel={paramTypeLabel}
            inLabel={inLabel}
          />
        )}
      </ProFormList>
    </>
  );
};

export const transformParamsForApi = (params: any[]): any[] => {
  if (!Array.isArray(params)) {
    return [];
  }

  return params.map(param => {
    if (!param || typeof param !== 'object') {
      return param;
    }

    const newParam = { ...param }; // 复制一份

    // 处理 Object 类型
    if (newParam.type === 'object' && Array.isArray(newParam.properties)) {
      const requiredProperties: string[] = [];
      // 递归处理 properties 并提取 required
      newParam.properties = newParam.properties.map((prop: any) => {
        if (!prop || typeof prop !== 'object') return prop;

        // 注意：这里递归调用的是 transformParamsForApi
        transformParamsForApi([prop])[0];
        // 或者依赖于原始 prop 的 required 值？
        // 假设 transformParamsForApi 不改变 prop 内部的 required 布尔值
        // 我们需要检查原始的 prop.required

        // 修正：应该基于原始 prop 判断是否 required
        params // 需要找到原始 prop，这有点麻烦
          .find(p => p.name === newParam.name)
          ?.properties?.find((pr: any) => pr.name === prop.name);
        // 简化逻辑：假设 map 保持顺序，或者直接在 newParam.properties 转换前操作
        // 再次修正：transformParamsForApi 应该只转换当前层级
        const currentPropIsRequired = prop.required === true;
        const transformedPropResult = transformParamsForApi([prop])[0]; // 递归转换属性

        if (currentPropIsRequired) {
          if (prop.name) {
            // 检查原始 prop 的 name
            requiredProperties.push(prop.name);
          }
          // 从转换后的结果中删除布尔 required (如果它存在)
          // delete transformedPropResult.required;
        }
        // 从原始prop复制时已经包含了required，转换后的子属性不需要布尔required
        delete transformedPropResult.required;

        return transformedPropResult;
      });

      // 先删除顶层的布尔 required (如果存在)
      delete newParam.required;
      // 如果有必填属性，添加到父对象
      if (requiredProperties.length > 0) {
        newParam.required = requiredProperties;
      }
    }

    // 处理 Array<Object> 类型 (递归转换 items 内部)
    if (newParam.type === 'array_object' && Array.isArray(newParam.items?.properties)) {
      // 假设 items 是一个包含 properties 的对象
      const requiredItemProperties: string[] = [];
      newParam.items.properties = newParam.items.properties.map((itemProp: any) => {
        if (!itemProp || typeof itemProp !== 'object') return itemProp;

        const currentItemPropIsRequired = itemProp.required === true;
        const transformedItemPropResult = transformParamsForApi([itemProp])[0]; // 递归转换

        if (currentItemPropIsRequired) {
          if (itemProp.name) {
            requiredItemProperties.push(itemProp.name);
          }
        }
        delete transformedItemPropResult.required; // 删除子属性的布尔 required
        return transformedItemPropResult;
      });
      // 在 items 对象上添加 required 数组 (如果 OpenAPI 规范如此定义)
      delete newParam.items.required; // 先删除可能存在的布尔值
      if (requiredItemProperties.length > 0) {
        newParam.items.required = requiredItemProperties;
      }
      // 注意: OpenAPI 通常描述 array items 的 schema，不直接在 items 上加 required 数组
      // 这里可能需要根据实际规范调整。也许 items 内部的转换就够了？
      // 暂时保持这种转换，但需留意。
    } else if (
      newParam.type === 'array_object' &&
      typeof newParam.items === 'object' &&
      newParam.items !== null
    ) {
      // 如果 items 不是带 properties 的数组，可能需要其他处理或直接透传？
      // 例如，如果 items 是一个简单的 schema 对象 { type: 'string' }
      // 目前的逻辑主要处理 items.properties 的情况
      // 确保非预期结构不会导致错误
      // delete newParam.items.required; // 如果 items 结构未知，谨慎删除
    }

    // 移除顶层 params 上多余的 required 布尔值
    // 这个应该在对象转换内部处理掉了
    if (typeof newParam.required === 'boolean') {
      // 只有非 object 类型才需要在这里删除
      if (newParam.type !== 'object') {
        delete newParam.required;
      }
    }

    return newParam;
  });
};

export interface ApiParameterEditorProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  paramTypeOptions?: IOptions7<string>[];
  inOptions?: IOptions7<string>[];
  title?: React.ReactNode | false;
  /** 树形布局下不再展示列头，保留该属性以免调用方类型报错 */
  showHeader?: boolean;
}

const ApiParameterEditor: React.FC<ApiParameterEditorProps> = ({
  value,
  onChange,
  paramTypeOptions,
  inOptions,
  title,
  showHeader
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ params: value || [] });
  }, [value, form]);

  const handleValuesChange = (_changedValues: any, allValues: any) => {
    onChange?.(allValues?.params || []);
  };

  const notify = useCallback(() => {
    onChange?.(form.getFieldValue('params') || []);
  }, [form, onChange]);

  return (
    <ConfigProvider componentSize="small">
      <EditorNotifyContext.Provider value={notify}>
        <div className="theling_apiParamEditor">
          <ProForm form={form} size="small" onValuesChange={handleValuesChange} submitter={false}>
            <RecursiveParameterList
              name="params"
              listName="params"
              basePath={['params']}
              paramTypeOptions={paramTypeOptions}
              inOptions={inOptions}
              title={title}
              showHeader={showHeader}
            />
          </ProForm>
        </div>
      </EditorNotifyContext.Provider>
    </ConfigProvider>
  );
};

export default ApiParameterEditor;
