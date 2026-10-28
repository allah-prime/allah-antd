import {
  CloseCircleFilled,
  CloseOutlined,
  PlusOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';
import { Button, Popover, Segmented, Select } from 'antd';
import { useState } from 'react';
import type { IAhSortField } from '../ahAntdTypes';
import './filterBar.less';

type ISort = Record<string, boolean>;

type IProps = {
  fields: IAhSortField[];
  /** 当前排序：false 降序、true 升序；key 顺序即优先级 */
  value?: ISort;
  onChange: (next: ISort | undefined) => void;
};

const DIRECTION_LABELS: Record<NonNullable<IAhSortField['type']>, [string, string]> = {
  date: ['最晚 → 最早', '最早 → 最晚'],
  number: ['大 → 小', '小 → 大'],
  text: ['Z → A', 'A → Z']
};

const getLabels = (field?: IAhSortField): [string, string] => {
  const base = DIRECTION_LABELS[field?.type ?? 'text'];
  const fallback: [string, string] = field?.type ? base : ['降序', '升序'];
  return [field?.descLabel ?? fallback[0], field?.ascLabel ?? fallback[1]];
};

/**
 * 「排序 · N个条件」按钮 + 多条排序弹层：字段下拉（按分组、带类型提示）+ 方向分段 + 删除
 */
const AhSortConditionPopover = ({ fields, value, onChange }: IProps) => {
  const [open, setOpen] = useState(false);
  /** 未选字段的新增行数 */
  const [draftCount, setDraftCount] = useState(0);

  const entries = Object.entries(value ?? {});
  const used = entries.map(([key]) => key);

  const emit = (next: Array<[string, boolean]>) => {
    onChange(next.length ? Object.fromEntries(next) : undefined);
  };

  /** 字段下拉：按 group 分组，已被其他行占用的字段不再出现 */
  const fieldOptions = (current?: string) => {
    const available = fields.filter((item) => item.field === current || !used.includes(item.field));
    const toOption = (item: IAhSortField) => ({
      value: item.field,
      label: item.label,
      typeLabel: item.typeLabel
    });
    const groups = Array.from(new Set(available.map((item) => item.group)));
    if (groups.every((group) => !group)) {
      return available.map(toOption);
    }
    return groups.map((group) => ({
      label: group ?? '其他',
      options: available.filter((item) => item.group === group).map(toOption)
    }));
  };

  const renderOption = (option: { label?: React.ReactNode; data: Record<string, unknown> }) => (
    <div className="ah-sort-opt">
      <span>{option.label}</span>
      {!!option.data.typeLabel && (
        <span className="ah-sort-opt-type">{option.data.typeLabel as string}</span>
      )}
    </div>
  );

  const content = (
    <div className="ah-cond-pop" style={{ width: 460 }}>
      <div className="ah-cond-pop-head">
        <span className="ah-cond-pop-title">排序</span>
        <CloseOutlined className="ah-cond-pop-close" aria-label="关闭" onClick={() => setOpen(false)} />
      </div>
      {entries.map(([key, asc], index) => {
        const meta = fields.find((item) => item.field === key);
        const [descText, ascText] = getLabels(meta);
        return (
          <div className="ah-cond-row" key={key}>
            <Select
              style={{ width: 150 }}
              value={key}
              options={fieldOptions(key) as never}
              optionRender={renderOption as never}
              popupMatchSelectWidth={260}
              onChange={(next) =>
                emit(entries.map((entry, i) => (i === index ? [next, entry[1]] : entry)))
              }
            />
            <Segmented
              className="ah-sort-seg"
              block
              value={asc ? 'asc' : 'desc'}
              options={[
                { label: descText, value: 'desc' },
                { label: ascText, value: 'asc' }
              ]}
              onChange={(dir) =>
                emit(entries.map((entry, i) => (i === index ? [entry[0], dir === 'asc'] : entry)))
              }
            />
            <CloseCircleFilled
              className="ah-cond-row-remove"
              aria-label="删除排序条件"
              onClick={() => emit(entries.filter((_, i) => i !== index))}
            />
          </div>
        );
      })}
      {Array.from({ length: draftCount }).map((_, index) => (
        <div className="ah-cond-row" key={`draft-${index}`}>
          <Select
            style={{ width: 150 }}
            placeholder="选择字段"
            options={fieldOptions() as never}
            optionRender={renderOption as never}
            popupMatchSelectWidth={260}
            onChange={(next) => {
              setDraftCount((count) => count - 1);
              emit([...entries, [next, false]]);
            }}
          />
          <div style={{ flex: 1 }} />
          <CloseCircleFilled
            className="ah-cond-row-remove"
            aria-label="删除排序条件"
            onClick={() => setDraftCount((count) => count - 1)}
          />
        </div>
      ))}
      <Button
        type="link"
        className="ah-sort-add"
        icon={<PlusOutlined />}
        disabled={entries.length + draftCount >= fields.length || draftCount > 0}
        onClick={() => setDraftCount((count) => count + 1)}
      >
        添加排序条件
      </Button>
    </div>
  );

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      arrow
      open={open}
      onOpenChange={setOpen}
      content={content}
    >
      <button type="button" className={`ah-bar-btn${open ? ' ah-bar-btn-open' : ''}`}>
        <SortAscendingOutlined className="ah-bar-btn-sort-icon" />
        <span>排序{entries.length > 0 ? ' · ' : ''}</span>
        {entries.length > 0 && <span className="ah-bar-btn-count">{entries.length}个条件</span>}
      </button>
    </Popover>
  );
};

export default AhSortConditionPopover;
