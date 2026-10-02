import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, ColorPicker, Empty, Input, Space, Spin, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import lodash from 'lodash';
import useCustomFormItem from '../hooks/useCustomFormItem';
import { ITagItem, ITagManageCommProps } from '../interface/tag';

export interface ITagSelectProps extends ITagManageCommProps {
  disabled?: boolean;
  autoRequest?: boolean;
  style?: React.CSSProperties;
  showAdd?: boolean;
  isTagColor?: boolean;
  mode?: 'single' | 'multiple';
}

const TagSelect3: React.FC<ITagSelectProps> = ({
  value = [],
  onChange,
  request,
  newTagRequest,
  defValReq,
  disabled,
  autoRequest = true,
  style,
  showAdd = true,
  isTagColor = true,
  mode = 'multiple'
}) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [list, setList] = useState<ITagItem[]>([]);
  const [originList, setOriginList] = useState<ITagItem[]>([]); // 原始列表，用于搜索空时显示
  const [loading, setLoading] = useState(false);
  const [tagColor, setTagColor] = useState('#1677ff');

  const [itemList, setItemList] = useState<ITagItem[]>([]);

  const { items, setItems, itemKeys, setItemKeys } = useCustomFormItem<ITagItem>({
    value,
    defValReq,
    onSetValues: newItems => {
      setItemList(newItems);
      // 当 defValReq 设置值时，触发 onChange
      if (defValReq && onChange && newItems.length > 0) {
        onChange(
          newItems.map(i => i.value),
          newItems
        );
      }
    },
    setLoading
  });

  /** 初始化列表 */
  const initList = useCallback(async () => {
    if (!request) return;
    setLoading(true);
    try {
      const res = await request('');
      const data = res || [];
      setOriginList(data as ITagItem[]);
      setList(data as ITagItem[]);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    if (autoRequest) initList();
  }, [autoRequest]);

  /** 搜索函数，防抖处理 */
  const searchList = useCallback(
    lodash.debounce(async (kw: string) => {
      if (!request) return;
      setLoading(true);
      try {
        const res = await request(kw);
        const data = res || [];
        setList(data);
      } finally {
        setLoading(false);
      }
    }, 300),
    [request]
  );

  /** 输入变化触发搜索 */
  const onInputChange = (v: string) => {
    setKeyword(v);
    if (v.trim()) {
      searchList(v.trim());
    } else {
      // 搜索框为空时显示原始列表
      setList([...originList]);
    }
  };

  /** 选中/取消标签 */
  const handleSelect = useCallback(
    (item: ITagItem, isRemove = false) => {
      if (!item?.value) return;

      let newItems: ITagItem[];
      if (isRemove) {
        newItems = items.filter(i => i.value !== item.value);
      } else if (mode === 'single') {
        newItems = [item];
        setOpen(false);
      } else {
        const exists = items.find(i => i.value === item.value);
        newItems = exists ? items.filter(i => i.value !== item.value) : [...items, item];
      }

      setItems(newItems);
      setItemKeys(newItems.map(i => i.value));
      setItemList(newItems);

      onChange?.(
        newItems.map(i => i.value),
        newItems
      );
    },
    [items, mode, onChange, setItems, setItemKeys]
  );

  /** 回车新增标签，不自动选中，只更新列表和 originList */
  // handleAdd
  const handleAdd = useCallback(
    async (label: string, color?: string) => {
      const name = label.trim();
      if (!name) return null;

      // 如果已经存在 originList 或 list，直接返回
      const exists = originList.find(i => i.value === name) || list.find(i => i.value === name);
      if (exists) return exists;

      const newItem: ITagItem = { label: name, value: name, color } as ITagItem;
      try {
        if (newTagRequest) newItem.key = await newTagRequest(newItem);

        // 更新 originList 和 list
        setOriginList(prev => [...prev, newItem]);
        setList([...originList, newItem]); // ⚠️ 注意这里用 originList，而不是 list
        return newItem;
      } catch (err) {
        console.error('新增标签失败', err);
        return null;
      }
    },
    [newTagRequest, originList, list]
  );

  /** 已选标签渲染 */
  const renderSelectedValue = useMemo(() => {
    if (!itemList.length) return [];
    return itemList.map(item => (
      <Tag
        key={item.value}
        closable
        color={item.color || '#1677ff'}
        onClose={e => {
          e.preventDefault();
          handleSelect(item, true);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1px 10px',
          maxWidth: 120,
          marginRight: 0
        }}
      >
        <Tooltip title={item.label} placement="topLeft">
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.label}
          </span>
        </Tooltip>
      </Tag>
    ));
  }, [itemList, handleSelect]);

  /** 列表渲染 */
  const renderListContent = useMemo(() => {
    if (loading)
      return (
        <div style={{ padding: 64, textAlign: 'center' }}>
          <Spin />
        </div>
      );
    if (!list.length) return <Empty description={keyword ? '未搜索到相关标签' : '暂无标签数据'} />;

    return (
      <Space wrap size={[8, 8]}>
        {list.map(item => {
          const checked = itemKeys.includes(item.value);
          return (
            <Tag.CheckableTag
              key={item.value}
              checked={checked}
              onChange={() => !item.disabled && handleSelect(item)}
              style={{
                fontSize: 14,
                padding: '4px 12px',
                marginRight: 0,
                border: checked ? `1px solid ${item.color || '#1677ff'}` : '1px solid #e5e7eb',
                background: checked ? item.color || '#1677ff' : '#fff',
                color: checked ? '#fff' : '#1E293B',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <Tooltip title={item.label} placement="topLeft">
                <PlusOutlined
                  style={{
                    fontSize: 12,
                    color: checked ? '#fff' : '#1E293B',
                    marginRight: 3
                  }}
                />
                {item.label}
              </Tooltip>
            </Tag.CheckableTag>
          );
        })}
      </Space>
    );
  }, [loading, list, itemKeys, keyword, handleSelect]);

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <Space wrap size={[6, 6]} align="start">
        {renderSelectedValue}

        <Button type="dashed" disabled={disabled} onClick={() => setOpen(v => !v)} size="small">
          {open ? (
            '完成'
          ) : (
            <>
              <PlusOutlined style={{ fontSize: 12 }} /> 添加/选择
            </>
          )}
        </Button>

        {open && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '100%',
              marginTop: 8,
              width: 420,
              zIndex: 999,
              background: '#fff',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 6px 20px rgba(15,23,42,0.12)'
            }}
          >
            <div style={{ fontSize: 14, color: '#48536F', marginBottom: 12 }}>添加/选择</div>

            {showAdd && (
              <Input
                placeholder="输入标签名称回车新增"
                allowClear
                value={keyword}
                onChange={e => onInputChange(e.target.value)}
                onPressEnter={async () => {
                  const v = keyword.trim();
                  if (!v) return;

                  await handleAdd(v, isTagColor ? tagColor : undefined);
                  setKeyword(''); // 可以选择清空输入框
                }}
                suffix={
                  isTagColor && (
                    <ColorPicker
                      size="small"
                      value={tagColor}
                      onChangeComplete={c => setTagColor(c.toHexString())}
                    />
                  )
                }
              />
            )}

            <div style={{ marginTop: 16, maxHeight: 300, overflow: 'auto' }}>
              {renderListContent}
            </div>
          </div>
        )}
      </Space>
    </div>
  );
};

export default React.memo(TagSelect3);
