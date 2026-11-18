import type { IFileObjVoBase, IUploadRef } from '@allahjs/utils';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import AhModal from '../AhModal';
import AsyncCascader from '../AsyncCascader';
import AsyncTreeModal from '../AsyncTree/AsyncTreeModal';
import FileUpload from '../FileUpload/FileUpload';
import SelectSearch from '../SelectSearch';
import type { IAhFormDetailEditor } from './types';

function displayValue(value: any): string {
  if (Array.isArray(value)) {
    return value.map(displayValue).filter(Boolean).join(' / ');
  }
  if (value == null) return '';
  if (typeof value === 'object') return displayValue(value.label ?? value.name ?? value.value);
  return String(value);
}

export function renderEditorValue<T>(
  editor: IAhFormDetailEditor<T>,
  value: any,
  record: T,
  emptyText: string
): React.ReactNode {
  if (editor.renderValue) return editor.renderValue(value, record);
  if (editor.type === 'upload') {
    const files = value as IFileObjVoBase[] | undefined;
    return files?.length
      ? files.map(file => file.fileName || file.name || file.fileId).join('、')
      : emptyText;
  }
  return displayValue(value) || emptyText;
}

interface DetailEditorProps<T> {
  editor: IAhFormDetailEditor<T>;
  record: T;
  disabled: boolean;
  uploadRef?: IUploadRef;
  value?: any;
  onChange?: (value: any) => void;
}

export function DetailEditor<T>({
  editor,
  record,
  disabled,
  uploadRef,
  value,
  onChange
}: DetailEditorProps<T>) {
  const [open, setOpen] = useState(false);

  switch (editor.type) {
    case 'upload':
      return (
        <FileUpload
          {...editor.props}
          disabled={disabled || editor.props?.disabled}
          value={value}
          onChange={onChange}
          uploadRef={uploadRef}
          uploadPendingOnly
        />
      );
    case 'asyncTree':
      return (
        <AsyncTreeModal
          {...editor.props}
          disabled={disabled || editor.props.disabled}
          value={value}
          onChange={onChange}
        />
      );
    case 'asyncCascader':
      return (
        <AsyncCascader
          type="form"
          {...editor.props}
          cascaderProps={{
            ...editor.props.cascaderProps,
            style: { width: '100%', marginLeft: 0, ...editor.props.cascaderProps?.style }
          }}
          disabled={disabled || editor.props.disabled}
          value={value}
          onChange={onChange}
        />
      );
    case 'selectSearch':
      return (
        <SelectSearch
          {...editor.props}
          selectProps={{
            ...editor.props.selectProps,
            disabled: disabled || editor.props.selectProps?.disabled,
            style: { width: '100%', ...editor.props.selectProps?.style }
          }}
          value={value}
          onChange={onChange}
        />
      );
    case 'modalSelect': {
      const close = () => setOpen(false);
      return (
        <Space wrap>
          <Button disabled={disabled} onClick={() => setOpen(true)}>
            {renderEditorValue(editor, value, record, '请选择')}
          </Button>
          {editor.allowClear && value != null && (
            <Button disabled={disabled} onClick={() => onChange?.(undefined)}>清空</Button>
          )}
          <AhModal title={editor.title} open={open} onCancel={close} footer={null} destroyOnHidden>
            {open && editor.renderPicker({
              value,
              close,
              select: next => {
                if (disabled) return;
                onChange?.(next);
                close();
              }
            })}
          </AhModal>
        </Space>
      );
    }
    case 'custom':
      return <>{editor.renderControl({ value, record, disabled, onChange: next => onChange?.(next) })}</>;
  }
}
