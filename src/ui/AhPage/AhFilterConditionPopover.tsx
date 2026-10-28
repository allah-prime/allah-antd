import {
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Button, DatePicker, Input, Popover, Select } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { dateUtils } from '@allahjs/utils';
import type { IAhFilterField } from '../ahAntdTypes';
import { isEmptyFilterValue } from './filterUtils';
import './filterBar.less';

type IValues = Record<string, unknown>;
type IOption = { label: React.ReactNode; value: string | number; color?: string };

const getOptions = (field: IAhFilterField): IOption[] =>
  field.options ??
  Object.entries(field.valueEnum ?? {}).map(([value, label]) => ({
    value,
    label: label as React.ReactNode
  }));

const toArray = (value: unknown): Array<string | number> =>
  isEmptyFilterValue(value) ? [] : Array.isArray(value) ? value : [value as string | number];

type IControlProps = {
  field: IAhFilterField;
  value: unknown;
  onChange: (value: unknown) => void;
  /** chip 形态：整体作为触发器，展示「字段名 值 ▾」 */
  chip?: boolean;
  width?: number | string;
};

/**
 * 菜单类值控件（Coding 同款）：点开浮层，多选带「已选 N 项」，选项可带色点；
 * 选项较多时顶部出现搜索框。选中立即生效。
 */
const MenuControl = ({ field, value, onChange, chip }: IControlProps) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const multiple = field.type === 'multiSelect';
  const options = getOptions(field);
  const selected = toArray(value);
  const searchable = options.length > (field.searchThreshold ?? 8);
  const shown = keyword
    ? options.filter((item) => String(item.label).toLowerCase().includes(keyword.toLowerCase()))
    : options;
  const text = selected.length
    ? options
        .filter((item) => selected.includes(item.value))
        .map((item) => item.label)
        .join('，') || selected.join('，')
    : '全部';

  const toggle = (optionValue: string | number) => {
    if (multiple) {
      const next = selected.includes(optionValue)
        ? selected.filter((item) => item !== optionValue)
        : [...selected, optionValue];
      onChange(next.length ? next : undefined);
      return;
    }
    onChange(selected.includes(optionValue) ? undefined : optionValue);
    setOpen(false);
  };

  const content = (
    <div className="ah-menu">
      {multiple && <div className="ah-menu-count">已选 {selected.length} 项</div>}
      {searchable && (
        <Input
          size="small"
          allowClear
          placeholder="搜索"
          prefix={<SearchOutlined />}
          variant="borderless"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      )}
      <div className="ah-menu-list">
        {shown.map((item) => (
          <div
            key={item.value}
            className={`ah-menu-item${selected.includes(item.value) ? ' ah-menu-item-active' : ''}`}
            onClick={() => toggle(item.value)}
          >
            {item.color && <i className="ah-menu-dot" style={{ background: item.color }} />}
            <span className="ah-menu-item-name">{item.label}</span>
            {selected.includes(item.value) && <CheckOutlined />}
          </div>
        ))}
        {!shown.length && <div className="ah-menu-empty">无匹配项</div>}
      </div>
    </div>
  );

  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      arrow={false}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setKeyword('');
        }
      }}
      content={content}
    >
      {chip ? (
        <button type="button" className={`ah-chip-btn${selected.length ? ' ah-chip-btn-has' : ''}`}>
          <span className="ah-filter-chip-label">{field.label}</span>
          <span className="ah-chip-btn-value">{text}</span>
          <span className="ah-bar-btn-caret" />
        </button>
      ) : (
        <button type="button" className="ah-menu-block">
          <span className={selected.length ? '' : 'ah-menu-block-empty'}>{text}</span>
          <span className="ah-bar-btn-caret" />
        </button>
      )}
    </Popover>
  );
};

/** 输入框：本地暂存，回车/失焦才提交，避免逐键请求 */
const InputControl = ({ field, value, onChange, width }: IControlProps) => {
  const [text, setText] = useState<string>((value as string) ?? '');
  const [lastValue, setLastValue] = useState(value);
  if (lastValue !== value) {
    setLastValue(value);
    setText((value as string) ?? '');
  }
  const commit = () => {
    if (text !== ((value as string) ?? '')) {
      onChange(text === '' ? undefined : text);
    }
  };
  return (
    <Input
      allowClear
      placeholder="全部"
      variant="borderless"
      style={{ width }}
      {...(field.fieldProps as object)}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        if (e.target.value === '') {
          onChange(undefined);
        }
      }}
      onPressEnter={commit}
      onBlur={commit}
    />
  );
};

/** 按字段类型渲染值控件（chip 与弹层行共用，二者同源） */
export const FilterValueControl = (props: IControlProps) => {
  const { field, value, onChange, width } = props;
  if (field.type === 'input') {
    return <InputControl {...props} />;
  }
  if (field.type === 'dateRange') {
    const range = value as { startDay?: string; endDay?: string } | undefined;
    const pair =
      range?.startDay && range?.endDay
        ? ([dayjs(range.startDay), dayjs(range.endDay)] as [dayjs.Dayjs, dayjs.Dayjs])
        : null;
    return (
      <DatePicker.RangePicker
        variant="borderless"
        style={{ width }}
        {...(field.fieldProps as object)}
        value={pair}
        onChange={(dates) => {
          onChange(
            dates && dates[0] && dates[1]
              ? dateUtils.getStartEndTimeStr([dates[0], dates[1]], 'auto')
              : undefined
          );
        }}
      />
    );
  }
  return <MenuControl {...props} />;
};

type IChipsProps = {
  fields: IAhFilterField[];
  /** 条件行顺序（与弹层一一对应） */
  conditions: string[];
  values: IValues;
  onChange: (patch: IValues) => void;
};

/** 外露条件 chip：与弹层条件行一一对应（含值为「全部」的行） */
export const AhFilterChips = ({ fields, conditions, values, onChange }: IChipsProps) => (
  <>
    {conditions
      .map((name) => fields.find((field) => field.name === name))
      .filter((field): field is IAhFilterField => !!field)
      .map((field) => {
        const isMenu = field.type !== 'input' && field.type !== 'dateRange';
        return isMenu ? (
          <FilterValueControl
            chip
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(next) => onChange({ [field.name]: next })}
          />
        ) : (
          <span className="ah-filter-chip" key={field.name}>
            <span className="ah-filter-chip-label">{field.label}</span>
            <FilterValueControl
              field={field}
              width={field.type === 'dateRange' ? 240 : 150}
              value={values[field.name]}
              onChange={(next) => onChange({ [field.name]: next })}
            />
          </span>
        );
      })}
  </>
);

type IPopoverProps = {
  fields: IAhFilterField[];
  conditions: string[];
  values: IValues;
  onChange: (patch: IValues) => void;
  onConditionsChange: (next: string[]) => void;
};

/**
 * 「筛选 N个条件」按钮 + 条件弹层。
 * 行 = 字段 + 值；已占用字段不再出现在其他行的字段下拉；切换字段重置值；删除行同时清空其值。
 */
const AhFilterConditionPopover = ({
  fields,
  conditions,
  values,
  onChange,
  onConditionsChange
}: IPopoverProps) => {
  const [open, setOpen] = useState(false);
  const count = conditions.filter(Boolean).length;
  const hasBlankRow = conditions.includes('');

  const changeField = (index: number, next: string) => {
    const prev = conditions[index];
    if (prev) {
      onChange({ [prev]: undefined });
    }
    onConditionsChange(conditions.map((name, i) => (i === index ? next : name)));
  };

  const removeRow = (index: number) => {
    const prev = conditions[index];
    if (prev) {
      onChange({ [prev]: undefined });
    }
    onConditionsChange(conditions.filter((_, i) => i !== index));
  };

  const content = (
    <div className="ah-cond-pop" style={{ width: 520 }}>
      <div className="ah-cond-pop-head">
        <span className="ah-cond-pop-title">筛选</span>
        <CloseOutlined className="ah-cond-pop-close" aria-label="关闭" onClick={() => setOpen(false)} />
      </div>
      {conditions.map((name, index) => {
        const field = fields.find((item) => item.name === name);
        return (
          <div className="ah-cond-row" key={name || `blank-${index}`}>
            <Select
              style={{ width: 170 }}
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="选择字段"
              value={name || undefined}
              options={fields
                .filter((item) => item.name === name || !conditions.includes(item.name))
                .map((item) => ({ label: item.label, value: item.name }))}
              onChange={(next) => changeField(index, next)}
            />
            <div className="ah-cond-row-value">
              {field ? (
                <FilterValueControl
                  field={field}
                  width="100%"
                  value={values[field.name]}
                  onChange={(next) => onChange({ [field.name]: next })}
                />
              ) : (
                <Input disabled />
              )}
            </div>
            <CloseCircleFilled
              className="ah-cond-row-remove"
              aria-label="删除筛选条件"
              title="删除当前筛选条件"
              onClick={() => removeRow(index)}
            />
          </div>
        );
      })}
      <Button
        type="primary"
        className="ah-cond-add"
        icon={<PlusOutlined />}
        disabled={hasBlankRow || conditions.length >= fields.length}
        onClick={() => onConditionsChange([...conditions, ''])}
      >
        添加筛选条件
      </Button>
    </div>
  );

  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      arrow
      open={open}
      onOpenChange={setOpen}
      content={content}
    >
      <button type="button" className={`ah-bar-btn${open ? ' ah-bar-btn-open' : ''}`}>
        <FilterOutlined />
        <span>筛选</span>
        {count > 0 && <span className="ah-bar-btn-count">{count}个条件</span>}
        <span className="ah-bar-btn-caret" />
      </button>
    </Popover>
  );
};

export default AhFilterConditionPopover;
