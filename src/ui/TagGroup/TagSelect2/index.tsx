import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './index.less';

const { CheckableTag } = Tag;

export interface TagOptionType {
  value: string;
  label: string | React.ReactNode;
  disabled?: boolean;
}

export interface TagSelectProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  options: TagOptionType[];
  expandable?: boolean;
  hideCheckAll?: boolean;
  actionsText?: {
    expandText?: string;
    collapseText?: string;
    selectAllText?: string;
  };
  /** 单选/多选标记，true 为单选，false 为多选 */
  setting?: boolean;
  className?: string;
  tagItemStyle?: React.CSSProperties;
}

const TagSelect2: React.FC<TagSelectProps> = ({
  value,
  defaultValue = [],
  onChange,
  options = [],
  expandable = false,
  hideCheckAll = true,
  actionsText = {
    expandText: '展开',
    collapseText: '收起',
    selectAllText: '选择全部'
  },
  setting = false,
  className,
  tagItemStyle
}) => {
  const isControlled = value !== undefined;
  const [selectedValues, setSelectedValues] = useState<string[]>(value ?? defaultValue);
  const [expand, setExpand] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(expandable);
  const [lineHeight, setLineHeight] = useState(22);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isControlled) {
      setSelectedValues(value);
    }
  }, [isControlled, value]);

  const measureOverflow = () => {
    const el = tagsRef.current;
    if (!el) {
      return;
    }
    const tag = el.querySelector('.ant-tag') as HTMLElement | null;
    const nextLineHeight = tag ? Math.ceil(tag.getBoundingClientRect().height) : 22;
    const nextShowExpand = el.scrollHeight > nextLineHeight + 1;
    setLineHeight(prev => (prev === nextLineHeight ? prev : nextLineHeight));
    setShowExpandButton(prev => (prev === nextShowExpand ? prev : nextShowExpand));
  };

  useLayoutEffect(() => {
    if (!expandable) {
      setShowExpandButton(false);
      return;
    }
    measureOverflow();
    const el = tagsRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }
    let raf = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measureOverflow);
    });
    observer.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [options, hideCheckAll, setting, expandable]);

  useEffect(() => {
    if (!showExpandButton && expand) {
      setExpand(false);
    }
  }, [showExpandButton, expand]);

  const handleChange = (newValues: string[]) => {
    if (!isControlled) {
      setSelectedValues(newValues);
    }
    onChange?.(newValues);
  };

  const handleTagChange = (tagValue: string, checked: boolean) => {
    if (setting) {
      handleChange(checked ? [tagValue] : []);
      return;
    }
    const updatedValues = [...selectedValues];
    const index = updatedValues.indexOf(tagValue);
    if (checked && index === -1) {
      updatedValues.push(tagValue);
    } else if (!checked && index > -1) {
      updatedValues.splice(index, 1);
    }
    handleChange(updatedValues);
  };

  const enabledValues = options.filter(option => !option.disabled).map(option => option.value);

  const handleSelectAll = (selectAll: boolean) => {
    handleChange(selectAll ? enabledValues : []);
  };

  const checkedAll =
    enabledValues.length > 0 && enabledValues.every(item => selectedValues.includes(item));
  const { expandText, collapseText, selectAllText } = actionsText;
  const needExpand = expandable && showExpandButton;
  const collapsed = needExpand && !expand;

  return (
    <div
      className={classNames('theling_tagSelect', className, {
        'theling_tagSelect-expandable': needExpand,
        'theling_tagSelect-expanded': expand
      })}
    >
      <div
        className="theling_tagOptions"
        ref={tagsRef}
        style={collapsed ? { maxHeight: lineHeight } : undefined}
      >
        {!hideCheckAll && !setting && (
          <CheckableTag checked={checkedAll} onChange={handleSelectAll}>
            {selectAllText}
          </CheckableTag>
        )}
        {options.map(option => {
          const { value: tagValue, label, disabled } = option;
          const checked = selectedValues.includes(tagValue);
          return (
            <CheckableTag
              key={tagValue}
              checked={checked}
              disabled={disabled}
              style={tagItemStyle}
              onChange={state => handleTagChange(tagValue, state)}
            >
              {label}
            </CheckableTag>
          );
        })}
      </div>
      {needExpand && (
        <button
          type="button"
          className="theling_trigger"
          aria-expanded={expand}
          style={{ height: lineHeight }}
          onClick={() => setExpand(v => !v)}
        >
          {expand ? collapseText : expandText}
          {expand ? <UpOutlined /> : <DownOutlined />}
        </button>
      )}
    </div>
  );
};

export default TagSelect2;
