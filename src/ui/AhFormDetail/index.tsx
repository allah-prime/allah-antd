
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Alert, Button, Descriptions, Form, Space, theme } from 'antd';
import type { IUploadRef } from '@allahjs/utils';
import isEqualWith from 'lodash/isEqualWith';
import type { IAhFormDetailColumn, IAhFormDetailEditor, IAhFormDetailProps } from './types';
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
import { assignFormRef, readFormRef } from './formRef';
import './index.less';
export { validateForm } from './formRef';
export type {
  IAhFormRef,
  IAhFormDetailColumn,
  IAhFormDetailEditor,
  IAhFormDetailPickerContext,
  IAhFormDetailProps,
  IAhFormDetailRenderer
} from './types';

/** 不支持行内编辑的 valueType */
const NOT_EDITABLE_VALUE_TYPES = ['image', 'title'];

function compareColumnValues(previous: unknown, next: unknown): boolean | undefined {
  // 内联回调会随父组件重渲染更新，但不代表字段配置发生了变化。
  if (typeof previous === 'function' && typeof next === 'function') return true;
  if (React.isValidElement(previous) && React.isValidElement(next)) {
    return previous.type === next.type && previous.key === next.key &&
      isEqualWith(previous.props, next.props, compareColumnValues);
  }
  return undefined;
}

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
    renderFunObj,
    request,
    plain = false,
    minHeight,
    placeholder,
    showPlaceholderBorder = false,
    primaryKey = 'id',
    editable,
    mode,
    onFieldSave,
    pencilRender,
    fieldControlRender,
    onDataChange,
    formRef
  } = props;
  const isFullEdit = mode === 'edit';
  // plain 是一组默认值，显式传入的属性优先
  const emptyText = props.emptyText ?? (plain ? '—' : '暂无数据');
  const descriptionsProps = useMemo(
    () => (plain ? { layout: 'vertical' as const, colon: false, ...props.descriptionsProps } : props.descriptionsProps),
    [plain, props.descriptionsProps]
  );

  const [currentData, setData] = useState<T | undefined>(dataSource);
  const [loading, setLoading] = React.useState(false);

  // 当前的columns
  const [loadedColumns, setLoadedColumns] = useState<IAhFormDetailColumn<T>[]>([]);
  const currentColumns = columns ?? loadedColumns;

  // 多字段编辑状态：数据由表单实例统一管理（Form 即数据源），dirtyKeys 只追踪「动过哪些字段」
  const [form] = Form.useForm();
  const [editingKeys, setEditingKeys] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const dirtyKeysRef = useRef<Set<string>>(new Set());
  const savingRef = useRef(false);
  const uploadRefs = useRef(new Map<string, IUploadRef>());
  const sessionRef = useRef(0);
  const sourceRef = useRef<Pick<IAhFormDetailProps<T>, 'dataSource' | 'columns' | 'formId'> | undefined>(undefined);
  const loadingDataRef = useRef(false);

  // 同步内部表单实例到外部 formRef
  useEffect(() => {
    assignFormRef(formRef, form);
    return () => {
      if (readFormRef(formRef) === form || typeof formRef === 'function') assignFormRef(formRef, undefined);
    };
  }, [form, formRef]);

  useLayoutEffect(() => () => {
    sessionRef.current += 1;
    sourceRef.current = undefined;
  }, []);

  useLayoutEffect(() => {
    const previous = sourceRef.current;
    const recordChanged = !previous || previous.dataSource !== dataSource || previous.formId !== props.formId;
    sourceRef.current = { columns, dataSource, formId: props.formId };
    if (!recordChanged && isEqualWith(previous.columns, columns, compareColumnValues)) return;

    const loadData = dataSource == null && (recordChanged || loadingDataRef.current) ? request : undefined;
    const record = recordChanged ? dataSource : currentData;
    const session = ++sessionRef.current;
    loadingDataRef.current = !!loadData;
    dirtyKeysRef.current.clear();
    uploadRefs.current.clear();
    savingRef.current = false;
    setSaving(false);
    setEditingKeys(new Set());
    form.resetFields();

    const applySource = (nextRecord?: T, sourceColumns?: IAhFormDetailColumn<T>[]) => {
      if (sessionRef.current !== session) return;
      loadingDataRef.current = false;
      setData(nextRecord);
      setLoadedColumns(sourceColumns ?? []);
      form.setFieldsValue(nextRecord ?? {});
      setLoading(false);
    };

    const loadColumns = columns == null
      ? props.formGroupReq ?? AhAntdConfig.getCommReq()?.formGroupReq
      : undefined;
    if (loadData || loadColumns) {
      setLoading(true);
      Promise.resolve()
        .then(() => Promise.all([
          loadData ? loadData() : record,
          loadColumns ? loadColumns(props.formId) : undefined
        ]))
        .then(([nextRecord, sourceColumns]) => applySource(nextRecord, sourceColumns))
        .catch(() => applySource(record));
    } else {
      applySource(record);
    }

    // 请求函数按来源切换时读取，允许调用方传入内联函数。
  }, [columns, dataSource, form, props.formId]);

  /** 判断字段是否参与行内编辑 */
  const isFormColumn = (column: IAhFormDetailColumn<T>, hasRegisteredControl: boolean): boolean => {
    if (
      column.dataIndex === undefined ||
      column.dataIndex === null ||
      (Array.isArray(column.dataIndex) && column.dataIndex.length === 0)
    ) {
      return false;
    }
    if (column.renderFunKey) return hasRegisteredControl;
    return !!column.editor || !NOT_EDITABLE_VALUE_TYPES.includes(column.valueType as string);
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
    const session = sessionRef.current;
    const isCurrentSession = () => sessionRef.current === session;
    savingRef.current = true;
    setSaving(true);
    try {
      // 字段全部常驻注册，原生校验即可覆盖任意脏字段（含当前未处于编辑态的）
      if (dirtyColumns.length) {
        await form.validateFields(dirtyColumns.map(getFieldPath));
        if (!isCurrentSession()) return;
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
            if (!isCurrentSession()) return;
            value = files.map(({ originFileObj, ...file }) => file);
            form.setFieldValue(path, value);
          } catch (error) {
            if (!isCurrentSession()) return;
            form.setFields([{
              name: path,
              errors: [error instanceof Error ? error.message : '附件上传失败，请重试']
            }]);
            return;
          }
        }
        // 未传 onFieldSave 时视为保存成功（纯前端模式）
        const ok = (await onFieldSave?.(value, col, newData)) ?? true;
        if (!isCurrentSession() || ok === false) {
          return;
        }
        newData = setFieldValueByColumn(newData, col, value);
      }
      setData(newData);
      dirtyKeysRef.current.clear();
      uploadRefs.current.clear();
      setEditingKeys(new Set());
      onDataChange?.(newData);
    } catch {
      // 校验失败：停留编辑态。脏字段全部处于 edit 模式（字段常驻注册），
      // 各字段错误由 antd 直接内联显示在对应单元格下方
    } finally {
      if (isCurrentSession()) {
        savingRef.current = false;
        setSaving(false);
      }
    }
  };

  /** 渲染查看态单元格：read 模式 ProField + 悬停显示的铅笔 */
  const renderViewCell = (column: IAhFormDetailColumn<T>, content: React.ReactNode) => (
    <div className="ah-form-detail-cell">
      {content}
      {!saving && !column.disabled && !column.fieldProps?.disabled &&
        (pencilRender ? (
          pencilRender(column, currentData!)
        ) : (
          <EditOutlined className="ah-form-detail-edit-icon" onClick={() => handleEdit(column)} />
        ))}
    </div>
  );

  /** 渲染编辑态单元格：只包含编辑控件，确认/取消在详情顶部的操作栏 */
  const renderEditCell = (column: IAhFormDetailColumn<T>, editor?: IAhFormDetailEditor<T>) => {
    const key = getColumnKey(column);
    let uploadRef = uploadRefs.current.get(key);
    if (editor?.type === 'upload' && !uploadRef) {
      uploadRef = { current: undefined };
      uploadRefs.current.set(key, uploadRef);
    }
    return (
      <div className="ah-form-detail-edit">
        <div className="ah-form-detail-edit-control">
          {editor ? (
            <Form.Item name={getFieldPath(column)} rules={buildFieldRules(column)}>
              <DetailEditor
                editor={editor}
                record={currentData!}
                disabled={saving}
                uploadRef={uploadRef}
              />
            </Form.Item>
          ) : (
            renderProFormField(column, currentData!, 'edit', fieldControlRender, !isFullEdit)
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
        bordered={props.bordered ?? !plain}
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
    const { renderFunKey } = column;
    const renderer = !column.editor && renderFunKey && renderFunObj &&
      Object.prototype.hasOwnProperty.call(renderFunObj, renderFunKey)
      ? renderFunObj[renderFunKey]
      : undefined;
    const renderControl = renderer?.renderControl;
    const canEdit = (editable || isFullEdit) && isFormColumn(column, !!renderControl) &&
      (!isFullEdit || (!column.disabled && !column.fieldProps?.disabled && column.editor?.type !== 'upload'));
    if (canEdit && (isFullEdit || editingKeys.has(getColumnKey(column)))) {
      return renderEditCell(column, column.editor ?? (renderControl && { type: 'custom', renderControl }));
    }

    const editor = column.editor;
    const renderValue = renderer?.renderValue;
    if (editor || renderValue) {
      const value = getFieldValueByColumn(currentData, column);
      const content = editor
        ? renderEditorValue(editor, value, currentData, emptyText)
        : renderValue?.(value, currentData);
      return canEdit
        ? renderViewCell(column, <div className="ah-form-detail-editor-value">{content}</div>)
        : content;
    }
    if (renderControl) {
      const content = renderItemContent({ ...column, renderFunKey: undefined }, currentData, emptyText, primaryKey);
      return canEdit
        ? renderViewCell(column, <div className="ah-form-detail-editor-value">{content}</div>)
        : content;
    }
    if (!canEdit) {
      return renderItemContent(column, currentData, emptyText, primaryKey);
    }
    return renderViewCell(column, renderProFormField(column, currentData, 'read', fieldControlRender));
  };

  return (
    <Form
      form={form}
      component={false}
      disabled={saving}
      onValuesChange={editable && !isFullEdit ? collectDirtyKeys : undefined}
    >
      {loading ? (
        <div style={getContainerStyle(minHeight, showPlaceholderBorder)}>
          {renderDefaultPlaceholder(placeholder, minHeight)}
        </div>
      ) : (
        <div>
          {!isFullEdit && renderEditBar()}
          {renderGroupedDescriptions()}
        </div>
      )}
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
