
import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Alert, Button, Descriptions, Form, Space, theme } from 'antd';
import type { IUploadRef } from '@allahjs/utils';
import type { IAhFormDetailColumn, IAhFormDetailProps } from './types';
import AhAntdConfig from '../utils/AhAntdConfig';
import {
  groupColumnsByTitle,
  generateDescriptionItems,
  renderItemContent,
  getContainerStyle,
  renderDefaultPlaceholder
} from './utils';
import {
  getColumnKey,
  getFieldValueByColumn,
  getFieldPath,
  hasFieldPath,
  buildFieldRules,
  formatFieldValue,
  setFieldValueByColumn,
  renderProFormField
} from './editUtils';
import { DetailEditor, renderEditorValue } from './editorFields';
import './index.less';
export type {
  IAhFormDetailColumn,
  IAhFormDetailEditor,
  IAhFormDetailPickerContext,
  IAhFormDetailProps
} from './types';

/** 不支持行内编辑的 valueType */
const NOT_EDITABLE_VALUE_TYPES = ['image', 'title'];

/**
 * AhFormDetail 详情展示组件
 * 基于 Ant Design Descriptions 组件封装，支持类似 ProDescriptions 的功能。
 * 开启 editable 后支持简道云式的多字段行内编辑：所有可编辑字段常驻注册在表单里，
 * 通过 ProFormField 的 read/edit 双模式切换——查看态渲染格式化文本（改值即时显示），
 * 点击铅笔切到控件编辑；已进入编辑的字段在编辑其他字段时**保持编辑态**，可同时编辑多个字段。
 * 详情顶部出现「数据编辑中」操作栏，确认时校验并逐字段保存全部草稿，取消则还原。
 * 数据由表单实例统一管理（setFieldsValue 初始化 / getFieldsValue 保存）
 *
 * @param props 组件属性
 * @returns React.ReactElement
 */
const AhFormDetail = <T extends Record<string, any> = any>(props: IAhFormDetailProps<T>) => {
  const { token } = theme.useToken();
  const {
    columns,
    dataSource,
    request,
    emptyText = '暂无数据',
    descriptionsProps,
    minHeight,
    placeholder,
    showPlaceholderBorder = false,
    primaryKey = 'id',
    editable,
    onFieldSave,
    pencilRender,
    fieldControlRender,
    onDataChange,
    formRef
  } = props;

  const [data, setData] = React.useState<T | undefined>(dataSource);
  const [loading, setLoading] = React.useState(false);

  // 当前的columns
  const [currentColumns, setCurrentColumns] = useState<IAhFormDetailColumn<T>[]>([]);

  // 多字段编辑状态：数据由表单实例统一管理（Form 即数据源），dirtyKeys 只追踪「动过哪些字段」
  const [form] = Form.useForm();
  const [editingKeys, setEditingKeys] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const dirtyKeysRef = useRef<Set<string>>(new Set());
  const savingRef = useRef(false);
  const uploadRefs = useRef(new Map<string, IUploadRef>());

  // 同步内部表单实例到外部 formRef
  useEffect(() => {
    if (formRef) {
      formRef.current = form;
    }
  }, [form, formRef]);

  const initData = async () => {
    let newData = dataSource;
    let newColumns = columns;
    if (!dataSource && request) {
      newData = await request();
    }
    // 先获取表单配置，再获取数据（commReq 未配置时 getCommReq 可能返回 undefined，兜底空对象）
    const commReqConfig = AhAntdConfig.getCommReq() || {};
    const formGroupReq = props.formGroupReq || commReqConfig.formGroupReq;
    // 获取表单配置
    if (!columns && formGroupReq) {
      newColumns = await formGroupReq(props.formId);
    }
    setData(newData);
    setCurrentColumns(newColumns || []);
    // 表单实例是唯一数据源：整条记录写入 store
    form.setFieldsValue(newData || {});
  };

  useEffect(() => {
    setLoading(true);
    initData()
      .then(() => {
        // 数据初始化完成后的操作
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [props.formId]);

  const currentData = data || dataSource;

  /** 判断字段是否参与行内编辑 */
  const isFormColumn = (column: IAhFormDetailColumn<T>): boolean => {
    if (
      column.dataIndex === undefined ||
      column.dataIndex === null ||
      (Array.isArray(column.dataIndex) && column.dataIndex.length === 0)
    ) {
      return false;
    }
    if (
      (!column.editor && NOT_EDITABLE_VALUE_TYPES.includes(column.valueType as string)) ||
      column.renderFunKey ||
      column.render
    ) {
      return false;
    }
    return true;
  };

  /** 字段是否显示编辑铅笔（image / title 及无 dataIndex 的字段除外） */
  const canEditColumn = (column: IAhFormDetailColumn<T>): boolean => {
    if (!editable || saving) {
      return false;
    }
    return !column.disabled && !column.fieldProps?.disabled && isFormColumn(column);
  };

  /** 进入编辑态：切到该字段的 edit 模式（值已在表单 store 里，无需种子） */
  const handleEdit = (column: IAhFormDetailColumn<T>) => {
    if (saving || !currentData) {
      return;
    }
    const key = getColumnKey(column);
    setEditingKeys((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  /** 取消编辑：表单还原为已保存的记录，丢弃全部草稿并退出编辑态 */
  const handleCancel = () => {
    if (savingRef.current) {
      return;
    }
    for (const column of currentColumns) {
      if (editingKeys.has(getColumnKey(column))) {
        form.setFieldValue(getFieldPath(column), getFieldValueByColumn(currentData, column));
      }
    }
    dirtyKeysRef.current.clear();
    uploadRefs.current.clear();
    setEditingKeys(new Set());
  };

  /** 校验脏字段并逐字段保存，全部成功后更新本地记录 */
  const handleSave = async () => {
    if (savingRef.current || !currentData) {
      return;
    }
    const dirtyColumns = currentColumns.filter((col) => dirtyKeysRef.current.has(getColumnKey(col)));
    savingRef.current = true;
    setSaving(true);
    try {
      // 字段全部常驻注册，原生校验即可覆盖任意脏字段（含当前未处于编辑态的）
      if (dirtyColumns.length) {
        await form.validateFields(dirtyColumns.map(getFieldPath));
      }
      let newData = currentData;
      for (const col of dirtyColumns) {
        const path = getFieldPath(col);
        let value = formatFieldValue(form.getFieldValue(path), col);
        if (col.editor?.type === 'upload') {
          const upload = uploadRefs.current.get(getColumnKey(col))?.current;
          if (!upload) return;
          try {
            const relId = col.editor.getRelId
              ? col.editor.getRelId(newData)
              : newData[primaryKey] == null ? undefined : String(newData[primaryKey]);
            const files = await upload.startUpload(relId);
            value = files.map(({ originFileObj, ...file }) => file);
            form.setFieldValue(path, value);
          } catch (error) {
            form.setFields([{
              name: path,
              errors: [error instanceof Error ? error.message : '附件上传失败，请重试']
            }]);
            return;
          }
        }
        // 未传 onFieldSave 时视为保存成功（纯前端模式）
        const ok = (await onFieldSave?.(value, col, newData)) ?? true;
        if (ok === false) {
          return;
        }
        newData = setFieldValueByColumn(newData, col, value);
      }
      onDataChange?.(newData);
      setData(newData);
      dirtyKeysRef.current.clear();
      uploadRefs.current.clear();
      setEditingKeys(new Set());
    } catch {
      // 校验失败：停留编辑态。脏字段全部处于 edit 模式（字段常驻注册），
      // 各字段错误由 antd 直接内联显示在对应单元格下方
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  /** 渲染查看态单元格：read 模式 ProField + 悬停显示的铅笔 */
  const renderViewCell = (column: IAhFormDetailColumn<T>) => (
    <div className="ah-form-detail-cell">
      {column.editor ? (
        <div className="ah-form-detail-editor-value">
          {renderEditorValue(column.editor, getFieldValueByColumn(currentData, column), currentData!, emptyText)}
        </div>
      ) : (
        renderProFormField(column, currentData!, 'read', fieldControlRender)
      )}
      {canEditColumn(column) &&
        (pencilRender ? (
          pencilRender(column, currentData!)
        ) : (
          <EditOutlined className="ah-form-detail-edit-icon" onClick={() => handleEdit(column)} />
        ))}
    </div>
  );

  /** 渲染编辑态单元格：只包含编辑控件，确认/取消在详情顶部的操作栏 */
  const renderEditCell = (column: IAhFormDetailColumn<T>) => {
    const key = getColumnKey(column);
    let uploadRef = uploadRefs.current.get(key);
    if (column.editor?.type === 'upload' && !uploadRef) {
      uploadRef = { current: undefined };
      uploadRefs.current.set(key, uploadRef);
    }
    return (
      <div className="ah-form-detail-edit">
        <div className="ah-form-detail-edit-control">
          {column.editor ? (
            <Form.Item name={getFieldPath(column)} rules={buildFieldRules(column)}>
              <DetailEditor
                editor={column.editor}
                record={currentData!}
                disabled={saving}
                uploadRef={uploadRef}
              />
            </Form.Item>
          ) : (
            renderProFormField(column, currentData!, 'edit', fieldControlRender)
          )}
        </div>
      </div>
    );
  };

  /** 渲染详情顶部的编辑操作栏：左侧提示，右侧取消/确认 */
  const renderEditBar = () => {
    if (editingKeys.size === 0) {
      return null;
    }
    return (
      <Alert
        className="ah-form-detail-edit-bar"
        type="info"
        showIcon
        message="数据编辑中"
        style={{ marginBottom: 16 }}
        action={
          <Space>
            <Button size="small" disabled={saving} onClick={handleCancel}>
              取消
            </Button>
            <Button size="small" type="primary" loading={saving} onClick={handleSave}>
              确认
            </Button>
          </Space>
        }
      />
    );
  };

  // 如果正在加载数据，显示占位内容
  if (loading) {
    const containerStyle = getContainerStyle(minHeight, showPlaceholderBorder);
    return <div style={containerStyle}>{renderDefaultPlaceholder(placeholder, minHeight)}</div>;
  }

  /**
   * 渲染分组后的 Descriptions 组件
   * @returns 分组后的 JSX 元素数组
   */
  const renderGroupedDescriptions = () => {
    const groups = groupColumnsByTitle(currentColumns);

    // 上下布局（vertical）下 label 占满整列宽，labelWidth 不适用——不输出宽度，
    // 否则行内宽度会干扰 table-layout: fixed 的等分列宽计算
    const isVerticalLayout = descriptionsProps?.layout === 'vertical';
    const labelStyle = isVerticalLayout
      ? {}
      : props.labelWidth
        ? {
            width: props.labelWidth
          }
        : {
            width: 180
          };

    return groups.map((group, index) => (
      <Descriptions
        key={group.title}
        title={group.title ? (
          <Space className="ah-form-detail-group-title" size={8}>
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                width: 4,
                height: 16,
                borderRadius: 4,
                background: token.colorPrimary
              }}
            />
            <span>{group.title}</span>
          </Space>
        ) : undefined}
        column={props.column || { xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 3 }}
        bordered={props.bordered ?? true}
        items={generateDescriptionItems(group.columns, currentData, renderCell)}
        {...descriptionsProps}
        // 统一列宽：覆盖 antd v6 bordered 模式的 table-layout: auto，保证 value 列均分宽度
        className={
          descriptionsProps?.className
            ? `${descriptionsProps.className} ah-form-detail-uniform`
            : 'ah-form-detail-uniform'
        }
        styles={{
          ...descriptionsProps?.styles,
          label: { ...labelStyle, ...(typeof descriptionsProps?.styles === 'object' ? descriptionsProps.styles.label : undefined) }
        }}
        style={{ marginBottom: index < groups.length - 1 ? 24 : 0 }}
      />
    ));
  };

  /** 单个单元格渲染：表单字段走 read/edit 双模式，纯展示类型走 renderItemContent */
  const renderCell = (column: IAhFormDetailColumn<T>, index: number): React.ReactNode => {
    if (!currentData) {
      return emptyText;
    }
    if (column.render) {
      return column.render(getFieldValueByColumn(currentData, column), currentData, index, form, {
        type: 'read'
      });
    }
    if (!editable || !isFormColumn(column)) {
      if (column.editor) {
        return renderEditorValue(column.editor, getFieldValueByColumn(currentData, column), currentData, emptyText);
      }
      return renderItemContent(column, currentData, emptyText, primaryKey);
    }
    return editingKeys.has(getColumnKey(column)) ? renderEditCell(column) : renderViewCell(column);
  };

  return (
    <Form
      form={form}
      component={false}
      disabled={saving}
      onValuesChange={editable ? collectDirtyKeys : undefined}
    >
      <div>
        {renderEditBar()}
        {renderGroupedDescriptions()}
      </div>
    </Form>
  );

  function collectDirtyKeys(changedValues: Record<string, unknown>) {
    for (const column of currentColumns) {
      const key = getColumnKey(column);
      if (editingKeys.has(key) && hasFieldPath(changedValues, getFieldPath(column))) {
        dirtyKeysRef.current.add(key);
      }
    }
  }
};

export default AhFormDetail;
