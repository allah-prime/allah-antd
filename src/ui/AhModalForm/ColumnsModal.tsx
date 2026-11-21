import { Button, theme, type FormInstance } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AhModal, { type IAhModalProps } from '../AhModal';
import AhFormDetail, { validateForm } from '../AhFormDetail';
import type { IAhFormDetailColumn, IAhFormDetailProps, IAhFormRef } from '../AhFormDetail/types';
import AhAntdConfig from '../utils/AhAntdConfig';
import {
  archiveModalWidth,
  compactModalFooterStyle,
  formColumnsFor,
  type IFormColumnCount
} from '../utils/formModalSize';

/** 一体弹窗的三种状态：详情、编辑、新增 */
export type IAhModalFormMode = 'view' | 'edit' | 'create';

type Resolvable<R, A> = R | ((ctx: A) => R);

export type IAhModalFormColumnsContext<T> = { mode: IAhModalFormMode; record: T | undefined };

/**
 * 列配置模式：传入 `columns` 后，AhModalForm 内部渲染 AhFormDetail，
 * 详情、编辑、新增共用同一个弹窗。
 */
export type IAhModalFormColumnsProps<T> = {
  /** 字段配置；传入即启用列配置模式 */
  columns: IAhFormDetailColumn<T>[];
  /** 当前记录；新增时不传 */
  dataSource?: T;
  /** 是否显示 */
  visible?: boolean;
  /** 关闭弹窗（取消、关闭、遮罩、保存新增成功后触发），由调用方把 visible 置为 false */
  onCancel?: () => void;
  /** 受控状态；不传则内部维护 */
  mode?: IAhModalFormMode;
  /** 每次打开的初始状态，默认有 dataSource 为 view，没有为 create */
  defaultMode?: IAhModalFormMode;
  /** 状态切换时触发（详情 → 编辑、编辑取消或保存 → 详情） */
  onModeChange?: (mode: IAhModalFormMode) => void;
  /** 是否允许从详情进入编辑，默认 true */
  canEdit?: boolean;
  /**
   * 保存。返回 `false` 表示失败，弹窗保持当前状态；返回对象则用它刷新详情态；
   * 返回 `true` 或空则把已提交的值合并进当前记录。抛出异常会提示 message 并保持当前状态。
   */
  onSave?: (values: T, mode: Exclude<IAhModalFormMode, 'view'>) => Promise<boolean | T | void>;
  /** 标题，可按状态和记录返回 */
  title?: Resolvable<React.ReactNode, IAhModalFormColumnsContext<T>>;
  /** 标题后的灰色辅助文字，如对象编码 */
  subTitle?: Resolvable<React.ReactNode, IAhModalFormColumnsContext<T>>;
  /** 详情态底栏「关闭」和「编辑」之间的额外按钮，如「调汇率」 */
  viewFooter?: Resolvable<React.ReactNode, IAhModalFormColumnsContext<T>>;
  /** 详情态字段下方的额外内容，如历史记录表 */
  viewExtra?: Resolvable<React.ReactNode, IAhModalFormColumnsContext<T>>;
  /** 栏数，默认按字段数 `formColumnsFor` 计算 */
  column?: IFormColumnCount;
  /** 弹窗宽度，默认按栏数 `archiveModalWidth` 计算 */
  width?: IAhModalProps['width'];
  /** 保存按钮文字 @default '保存' */
  okText?: React.ReactNode;
  /** 取消按钮文字 @default '取消' */
  cancelText?: React.ReactNode;
  /** 详情态关闭按钮文字 @default '关闭' */
  closeText?: React.ReactNode;
  /** 详情态编辑按钮文字 @default '编辑' */
  editText?: React.ReactNode;
  /** 弹窗加载中 */
  loading?: boolean;
  /** test id 前缀：弹窗根节点 `<testId>-modal`（带 data-mode），编辑按钮 `<testId>-edit` @default 'ah' */
  testId?: string;
  /** 获取内部表单实例 */
  formRef?: IAhFormRef;
  /** 透传给 AhFormDetail 的其他属性 */
  formDetailProps?: Partial<Omit<IAhFormDetailProps<T>, 'columns' | 'dataSource' | 'mode' | 'column' | 'formRef' | 'plain'>>;
  /** 覆盖 AhModal 属性 */
  modalProps?: Omit<IAhModalProps, 'open' | 'title' | 'footer' | 'onCancel' | 'width' | 'styles'>;
};

function resolve<R, A>(value: Resolvable<R, A> | undefined, ctx: A): R | undefined {
  return typeof value === 'function' ? (value as (ctx: A) => R)(ctx) : value;
}

/** 字段数：不含分组标题和没有字段路径的列 */
function countFields<T>(columns: IAhFormDetailColumn<T>[]): number {
  return columns.filter((column) => column.valueType !== 'title' && column.dataIndex !== undefined).length;
}

const AhModalFormColumns = <T extends Record<string, any>>(props: IAhModalFormColumnsProps<T>): React.ReactElement => {
  const {
    columns,
    dataSource,
    visible = false,
    onCancel,
    mode: modeProp,
    defaultMode,
    onModeChange,
    canEdit = true,
    onSave,
    okText = '保存',
    cancelText = '取消',
    closeText = '关闭',
    editText = '编辑',
    loading,
    testId = 'ah',
    formDetailProps,
    modalProps
  } = props;
  const { token } = theme.useToken();

  const ownFormRef = useRef<FormInstance | undefined>(undefined);
  const formRef = props.formRef ?? ownFormRef;
  const [record, setRecord] = useState<T | undefined>(dataSource);
  const [innerMode, setInnerMode] = useState<IAhModalFormMode>(modeProp ?? defaultMode ?? (dataSource ? 'view' : 'create'));
  const [session, setSession] = useState(0);
  const [saving, setSaving] = useState(false);
  const empty = useMemo(() => ({}) as T, []);

  const mode = modeProp ?? innerMode;

  // 每次打开或初始状态变化时，回到调用方给定的起点并重建表单
  useEffect(() => {
    setRecord(dataSource);
    setInnerMode(modeProp ?? defaultMode ?? (dataSource ? 'view' : 'create'));
    setSession((n) => n + 1);
    setSaving(false);
  }, [visible, defaultMode]);

  // 调用方换了记录（如保存后刷新）：只同步数据，不改当前状态
  useEffect(() => {
    setRecord(dataSource);
    setSession((n) => n + 1);
  }, [dataSource]);

  const changeMode = (next: IAhModalFormMode) => {
    setInnerMode(next);
    setSession((n) => n + 1);
    onModeChange?.(next);
  };

  /** 取消：编辑回到详情并丢弃草稿，新增和详情直接关闭 */
  const cancel = () => {
    if (saving) return;
    if (mode === 'edit' && record) {
      changeMode('view');
      return;
    }
    onCancel?.();
  };

  const submit = async () => {
    if (saving || mode === 'view') return;
    const values = await validateForm<T>(formRef);
    if (!values) return;
    setSaving(true);
    try {
      const result = await onSave?.(values, mode);
      if (result === false) return;
      if (mode === 'create') {
        onCancel?.();
        return;
      }
      const next = typeof result === 'object' && result !== null ? result : ({ ...record, ...values } as T);
      setRecord(next);
      changeMode('view');
    } catch (error) {
      const text = error instanceof Error ? error.message : '保存失败';
      const messageApi = AhAntdConfig.getMessage();
      if (messageApi) messageApi.error(text);
      else console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const ctx: IAhModalFormColumnsContext<T> = { mode, record };
  const subTitle = resolve(props.subTitle, ctx);
  const titleText = resolve(props.title, ctx);
  const title = titleText ? (
    <>
      {titleText}
      {subTitle ? (
        <span style={{ marginInlineStart: 8, fontSize: token.fontSize, fontWeight: 400, color: token.colorTextSecondary }}>
          {subTitle}
        </span>
      ) : null}
    </>
  ) : undefined;

  const columnCount = props.column ?? formColumnsFor(countFields(columns));
  const width = props.width ?? archiveModalWidth(columnCount);

  let footer: React.ReactNode;
  if (mode === 'view') {
    footer = (
      <>
        <Button data-testid="modal-cancel" onClick={() => onCancel?.()}>{closeText}</Button>
        {resolve(props.viewFooter, ctx)}
        {canEdit ? (
          <Button type="primary" data-testid={`${testId}-edit`} onClick={() => changeMode('edit')}>{editText}</Button>
        ) : null}
      </>
    );
  } else {
    footer = (
      <>
        <Button data-testid="modal-cancel" disabled={saving} onClick={cancel}>{cancelText}</Button>
        <Button type="primary" data-testid="modal-ok" loading={saving} onClick={submit}>{okText}</Button>
      </>
    );
  }

  return (
    <AhModal
      destroyOnHidden
      {...modalProps}
      open={visible}
      title={title}
      width={width}
      loading={loading}
      footer={footer}
      mask={{ closable: mode === 'view' }}
      styles={{ footer: compactModalFooterStyle }}
      onCancel={() => (mode === 'view' ? onCancel?.() : cancel())}
    >
      {visible ? (
        <div data-testid={`${testId}-modal`} data-mode={mode} data-ready="true">
          <AhFormDetail<T>
            {...formDetailProps}
            key={`${mode}-${session}`}
            plain
            formRef={formRef}
            mode={mode === 'view' ? undefined : 'edit'}
            column={columnCount}
            dataSource={record ?? empty}
            columns={columns}
          />
          {mode === 'view' ? resolve(props.viewExtra, ctx) : null}
        </div>
      ) : null}
    </AhModal>
  );
};

export default AhModalFormColumns;
