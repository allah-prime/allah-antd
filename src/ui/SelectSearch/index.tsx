import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { IOptions7 } from '@allahjs/utils';
import { Divider, Input, Select, Space, Spin, Typography } from 'antd';
import debounce from 'lodash/debounce';
import React, { useEffect } from 'react';
import { ISelectSearchProps } from '../interface/component';

const SelectSearch: React.FC<ISelectSearchProps> = ({
  options,
  fetchOptions,
  fetchByValue,
  debounceTimeout = 800,
  refreshDepend = [],
  addItem,
  itemRender,
  onChange,
  selectProps,
  placeholder,
  value,
  mode
}) => {
  const [localOptions, setLocalOptions] = React.useState<IOptions7<string>[]>(options);
  const [fetchedOptions, setFetchedOptions] = React.useState<IOptions7<string>[]>([]);
  // 缓存已选/反查到的选项，避免异步模式下重新拉取列表后丢失已选值的 label
  const [selectedCache, setSelectedCache] = React.useState<IOptions7<string>[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const fetchRef = React.useRef(0);
  // 空关键字请求成功的默认列表缓存：展开下拉时直接回显，避免「旧数据 → 加载 → 新数据」的闪烁
  const defaultCacheRef = React.useRef<IOptions7<string>[] | null>(null);
  // 在途请求的搜索关键字，用于展开时判断默认列表是否已在路上
  const inFlightSearchRef = React.useRef<string | null>(null);
  const fetchOptionsRef = React.useRef(fetchOptions);
  fetchOptionsRef.current = fetchOptions;
  const fetchByValueRef = React.useRef(fetchByValue);
  fetchByValueRef.current = fetchByValue;
  // 已触发过反查的 value，避免重复请求
  const fetchingValuesRef = React.useRef<Set<string>>(new Set());

  const isAsync = !!fetchOptions;

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  /**
   * 发起一次请求。mode 决定加载态的表现：
   * - load：关键字搜索，保留旧列表原地替换，仅显示 Spin
   * - reset：默认列表加载（挂载/refreshDepend/展开但无缓存），清空列表进入加载态
   * - silent：展开时的静默刷新，不清空不显示 Spin，返回后原地更新
   */
  const runFetch = React.useCallback((search: string, mode: 'load' | 'reset' | 'silent' = 'load') => {
    const fetcher = fetchOptionsRef.current;
    if (!fetcher) {
      return;
    }
    fetchRef.current += 1;
    const fetchId = fetchRef.current;
    inFlightSearchRef.current = search;
    if (mode !== 'silent') {
      setFetching(true);
      if (mode === 'reset') {
        setFetchedOptions([]);
      }
    }
    fetcher(search)
      .then(newOptions => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        inFlightSearchRef.current = null;
        setFetchedOptions(newOptions || []);
        if (mode !== 'silent') {
          setFetching(false);
        }
        if (search === '') {
          defaultCacheRef.current = newOptions || [];
        }
      })
      .catch(() => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        inFlightSearchRef.current = null;
        if (mode !== 'silent') {
          setFetching(false);
        }
      });
  }, []);

  const debounceFetcher = React.useMemo(
    () => debounce((search: string) => runFetch(search, 'load'), debounceTimeout),
    [debounceTimeout, runFetch]
  );

  // 异步模式下挂载及依赖变化时预载默认列表
  useEffect(() => {
    if (fetchOptionsRef.current) {
      runFetch('', 'reset');
    }
  }, refreshDepend);

  const renderOptions = React.useMemo(() => {
    if (!isAsync) {
      return localOptions;
    }
    const map = new Map(fetchedOptions.map(item => [item.value, item]));
    // 静态 options 与已选/反查缓存作为兜底合并，保证默认值与已选值的 label 可解析
    localOptions.forEach(item => {
      if (!map.has(item.value)) {
        map.set(item.value, item);
      }
    });
    selectedCache.forEach(item => {
      if (!map.has(item.value)) {
        map.set(item.value, item);
      }
    });
    return [...map.values()];
  }, [isAsync, localOptions, fetchedOptions, selectedCache]);

  // 默认值回显：异步模式下 value 在当前列表里解析不了时，通过 fetchByValue 反查 label
  useEffect(() => {
    if (!isAsync || !fetchByValueRef.current) {
      return;
    }
    if (value === undefined || value === null || value === '') {
      return;
    }
    const values = (Array.isArray(value) ? value : [value]).filter(
      v => v !== '' && v !== undefined && v !== null
    );
    if (!values.length) {
      return;
    }
    const known = new Set(renderOptions.map(item => String(item.value)));
    const missing = values.filter(v => !known.has(String(v)) && !fetchingValuesRef.current.has(String(v)));
    if (!missing.length) {
      return;
    }
    missing.forEach(v => fetchingValuesRef.current.add(String(v)));
    fetchByValueRef
      .current(missing)
      .then(opts => {
        setSelectedCache(prev => {
          const map = new Map(prev.map(item => [String(item.value), item]));
          (opts || []).forEach(item => map.set(String(item.value), item));
          return [...map.values()];
        });
      })
      .catch(() => {
        missing.forEach(v => fetchingValuesRef.current.delete(String(v)));
      });
  }, [value, renderOptions, isAsync]);

  const handleChange = (val: string | string[], opt: any) => {
    onChange?.(val, opt);
    setSelectedCache((Array.isArray(opt) ? opt : opt ? [opt] : []).filter(Boolean));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    selectProps?.onOpenChange?.(nextOpen);
    if (isAsync && nextOpen) {
      // 展开时清空残留关键字；默认列表有缓存则立即回显并静默刷新，无缓存才进入加载态
      setKeyword('');
      if (!defaultCacheRef.current) {
        if (inFlightSearchRef.current !== '') {
          runFetch('', 'reset');
        }
        return;
      }
      setFetchedOptions(defaultCacheRef.current);
      if (inFlightSearchRef.current !== '') {
        runFetch('', 'silent');
      }
    }
  };

  const showSearchBar = isAsync || mode !== 'multiple';

  return (
    <Select
      style={{ width: 300 }}
      placeholder={placeholder || '请选择'}
      onChange={handleChange}
      value={value}
      mode={mode}
      options={itemRender ? undefined : renderOptions}
      notFoundContent={isAsync && fetching ? <Spin size="small" /> : undefined}
      onOpenChange={handleOpenChange}
      popupRender={menu => (
        <>
          {showSearchBar && (
            <>
              <Input
                prefix={<SearchOutlined />}
                variant="borderless"
                placeholder="搜索"
                suffix={isAsync && fetching ? <Spin size="small" /> : undefined}
                value={isAsync ? keyword : undefined}
                onChange={e => {
                  const searchValue = e.target.value;
                  if (isAsync) {
                    setKeyword(searchValue);
                    debounceFetcher(searchValue);
                    return;
                  }
                  const newOptions = options.filter(
                    item =>
                      (item.label as string).includes(searchValue) ||
                      item.value.includes(searchValue)
                  );
                  setLocalOptions(newOptions);
                }}
              />
              <Divider style={{ margin: '2px 0' }} />
            </>
          )}
          {menu}
          {addItem && (
            <>
              <Divider style={{ margin: '2px 0' }} />
              <Space align="center" style={{ padding: '0px 8px 0px 8px', lineHeight: '24px' }}>
                <Typography.Link onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
                  <PlusOutlined /> 创建新的选项
                </Typography.Link>
              </Space>
            </>
          )}
        </>
      )}
      {...selectProps}
    >
      {itemRender ? renderOptions.map((item, index) => itemRender(item, index)) : undefined}
    </Select>
  );
};

export default SelectSearch;
