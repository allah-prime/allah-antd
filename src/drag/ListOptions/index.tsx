import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext } from '@dnd-kit/sortable';
import { ItemBar } from '../../ui';
import { ArrayUtil } from '../../theling-utils';
import type { IOptions7 } from '../../theling-utils/@types/IZlData';
import { Alert, Button, Input, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import SortableItem from '../DndKit/SortableItem';
import type { IListOptionsProps } from './types';
import './index.less';

const ListOptions: React.FC<IListOptionsProps> = props => {
  const {
    titleRender,
    title = '配置菜单选项',
    tips,
    value = [],
    onChange,
    onAdd,
    onDelete,
    customValue = true,
    placeholder = '选项名称，最多 10 个汉字',
    inputRender = true
  } = props;

  const [options, setOptions] = React.useState<IOptions7<string>[]>(value || []);

  const [newLabel, setNewLabel] = React.useState<string>();
  const [newValue, setNewValue] = React.useState<string>();

  const [isExist, setIsExist] = React.useState<boolean>(false);

  // 当前选择的那个
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (value) {
      setOptions(JSON.parse(JSON.stringify(value)));
    } else {
      setOptions([]);
    }
  }, [value]);

  /**
   * 文本编辑的时候
   */
  const itemTextChange = (v: string, index: number) => {
    options[index].label = v;
    const newOptions = [...options];
    setOptions(newOptions);
  };

  const onRemove = (index: number) => {
    const newOptions = [...options];
    const item = options[index];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    onChange?.(newOptions, item, index, 'del');
    onDelete?.(options[index], index);
  };

  const addItem = () => {
    if (newLabel) {
      // 判断是否已经存在
      const newIsExist = options.find(item => item.label === newLabel || item.value === newValue);
      if (newIsExist) {
        inputRef.current.focus();
        setIsExist(true);
        return;
      }
      const newOptions = [...options];
      const maxId = newOptions.reduce((max, item) => {
        return Number(item.value) > max ? Number(item.value) : max;
      }, 0);
      const newItem = { label: newLabel, value: newValue || `${Number(maxId) + 1}` };
      // @ts-ignore
      newOptions.push(newItem);
      // @ts-ignore
      onAdd?.(newItem);
      setOptions(newOptions);
      setNewLabel('');
      // @ts-ignore
      onChange?.(newOptions, newItem, newOptions.length - 1, 'add');
      inputRef.current!.focus({
        cursor: 'start'
      });
    }
  };

  return (
    <DndContext
      onDragStart={({ active }) => {
        if (!active) {
          return;
        }
        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        setActiveId(null);
        if (over) {
          const activeIndex = options.findIndex(item => item.value === activeId);
          const overIndex = options.findIndex(item => item.value === over.id);
          if (activeIndex !== overIndex) {
            const newOpts = ArrayUtil.arrayMove(options, activeIndex, overIndex);
            setOptions(newOpts);
            onChange?.(newOpts, newOpts[overIndex], overIndex, 'move');
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <>
        {titleRender || <h3>{title}</h3>}
        {tips && <div className="theling_tip">{tips}</div>}
        <div className="theling_options" style={{ display: options.length > 0 ? 'block' : 'none' }}>
          <SortableContext items={options.map(item => item.value)}>
            {options.map((item, index) => (
              <SortableItem
                key={item.value}
                id={item.value}
                index={index}
                data={item}
                sorting={activeId === item.value}
                containerId="A"
                renderItem={(handleProps, listeners) => (
                  <ItemBar
                    boxShadow={index !== options.length - 1}
                    key={item.value}
                    item={item}
                    barTitleKey="label"
                    editable={!item.disabled}
                    onChange={(v: string) => itemTextChange(v, index)}
                    onBlur={() => {
                      if (value[index] && value[index].label !== item.label) {
                        onChange?.(options, item, index, 'update');
                      }
                    }}
                    bodyStyle={{
                      width: '100%'
                    }}
                    iconRender={() => (
                      <div {...handleProps} {...listeners} style={{ cursor: 'move' }}>
                        <HolderOutlined />
                      </div>
                    )}
                    extra={
                      item.disabled ? <></> : <DeleteOutlined onClick={() => onRemove(index)} />
                    }
                  />
                )}
              />
            ))}
          </SortableContext>
        </div>
        {
          inputRender && (
            <div>
              <Space.Compact
                style={{
                  width: '100%'
                }}
              >
                <Input
                  style={{ width: customValue ? '60%' : '100%' }}
                  value={newLabel}
                  onChange={e => {
                    setNewLabel(e.target.value);
                    setIsExist(false);
                  }}
                  onPressEnter={addItem}
                  placeholder={placeholder}
                  ref={inputRef}
                />
                {customValue && (
                  <Input
                    style={{ width: '40%' }}
                    value={newValue}
                    onChange={e => {
                      setNewValue(e.target.value);
                      setIsExist(false);
                    }}
                    onPressEnter={addItem}
                    placeholder="选项值"
                  />
                )}
                <Button type="primary" onClick={addItem}>
                  添加
                </Button>
              </Space.Compact>
            </div>
          )
        }

        {isExist && (
          <Alert
            style={{ marginTop: 8, fontSize: 12 }}
            title={`存在重名选项：${newLabel}`}
            type="error"
          />
        )}
      </>
    </DndContext>
  );
};

export default ListOptions;
