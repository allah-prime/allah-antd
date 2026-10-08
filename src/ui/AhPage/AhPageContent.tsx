import {
  ActionType,
  ProFormDateRangePicker,
  ProFormInstance,
  ProFormSelect
} from '@ant-design/pro-components';
import { dateUtils, handleReqListParams } from '@allahjs/utils';
import type { IBaseFilter } from '@allahjs/utils';
import { useSize } from 'ahooks';
import { Card, Input, Table } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import LightFilter from '../LightFilter';
import SearchContent from '../utils/SearchContent';
import { IAhPageContentProps } from '../ahAntdTypes';
import AhProTable from '../AhProTable/AhProTable';

/**
 * 页面容器组件
 */
const AhPageContent = <T, F extends IBaseFilter>({
  searchForm,
  defParams = {
    pageSize: 20,
    pageNum: 1
  } as F,
  request,
  columns,
  rowKey = 'id',
  xScroll,
  searchContentProps,
  tableProps,
  children,
  pageRef,
  searchRender,
  searchContentRender,
  style,
  searchLayout = 'div',
  containerHeight,
  debounceTime = 400,
  rowSelection,
  showKeyword = true,
  onRowClick,
  footerRender,
  setParams: propsSetParams,
  params: propsParams = {} as F,
  background = '#fff',
  needSearch = true,
  timeSearch = true,
  field = 'creTimeObj',
  timeName = '创建时间',
  searchLayoutStyle,
  sortSearch,
  subHeight
}: IAhPageContentProps<T, F>) => {
  const formRef = useRef<ProFormInstance>(undefined);

  // 列表数据
  const [params, setParams] = useState<F>({ ...defParams, ...propsParams });
  const [keyword, setKeyword] = useState<string>(
    (propsParams as any).keyword ?? (defParams as any).keyword ?? ''
  );
  const searchRef = useRef<any>(undefined);
  const actionRef = useRef<ActionType>(undefined);
  const searchHeight = useSize(searchRef)?.height;
  const keywordRef = useRef<string>(
    (propsParams as any).keyword ?? (defParams as any).keyword ?? ''
  );

  /**
   * 最外层页面容器引用，用于获取父容器元素
   */
  const pageBodyRef = useRef<HTMLDivElement | null>(null);
  const rootSize = useSize(typeof document === 'undefined' ? null : document.getElementById('root'));

  // 更新参数
  const updateParams = useCallback(
    (updatedParams: F, syncForm = true) => {
      if ('keyword' in (updatedParams as object)) {
        const nextKeyword = (updatedParams as any).keyword ?? '';
        keywordRef.current = nextKeyword;
        setKeyword(nextKeyword);
      }
      setParams((prevParams) => {
        const newParams = { ...prevParams, ...defParams, ...updatedParams };
        propsSetParams?.(newParams);
        if (syncForm) {
          formRef.current?.setFieldsValue(newParams);
        }
        return newParams;
      });
    },
    [defParams, propsSetParams]
  );

  useImperativeHandle(pageRef, () => ({
    refresh: actionRef.current!.reload,
    asyncRefresh: actionRef.current!.reload,
    updateParams: updateParams,
    setParams: (v: F) => {
      if ('keyword' in (v as object)) {
        const nextKeyword = (v as any).keyword ?? '';
        keywordRef.current = nextKeyword;
        setKeyword(nextKeyword);
      }
      formRef.current?.setFieldsValue(v);
      setParams(v);
    }
  }));

  const normalizeSearchValues = useCallback(
    (values: Record<string, any>) => {
      const nextValues = { ...values };
      if (field && nextValues[field]?.length > 0) {
        nextValues[field] = dateUtils.getStartEndTimeStr(nextValues[field], 'auto');
      } else if (field) {
        nextValues[field] = undefined;
      }
      if (nextValues.timeSort === '1') {
        nextValues.sort = { update_time: false };
      } else if (nextValues.timeSort === '2') {
        nextValues.sort = { cre_time: false };
      }
      delete nextValues.timeSort;
      return nextValues;
    },
    [field]
  );

  const renderSearchDiv = useCallback(() => {
    const searchFormComponent = searchRender ? (
      searchRender(updateParams)
    ) : (
      <SearchContent
        className={searchLayout === 'div' ? 'ah-page-header-search' : ''}
        searchForm={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {showKeyword && (
              <Input.Search
                placeholder="请输入关键字查询"
                allowClear
                style={{ width: 200 }}
                value={keyword}
                onSearch={(value) => {
                  keywordRef.current = value;
                  setKeyword(value);
                  updateParams({ keyword: value, pageNum: 1 } as F);
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  keywordRef.current = value;
                  setKeyword(value);
                  updateParams({ keyword: value, pageNum: 1 } as F);
                }}
              />
            )}
            <LightFilter
              formRef={formRef}
              initialValues={propsParams}
              onValuesChange={(_, values: any) => {
                const nextValues = normalizeSearchValues(values);
                updateParams(
                  {
                    ...nextValues,
                    ...(showKeyword
                      ? ({ keyword: keywordRef.current } as Record<string, any>)
                      : {}),
                    pageNum: 1
                  } as F,
                  false
                );
              }}
            >
              {timeSearch && <ProFormDateRangePicker label={timeName} key={3} name={field} />}
              {sortSearch && (
                <ProFormSelect
                  name="timeSort"
                  initialValue="1"
                  label="排序"
                  options={[
                    {
                      label: '更新排序',
                      value: '1'
                    },
                    {
                      label: '创建排序',
                      value: '2'
                    }
                  ]}
                />
              )}
              {searchForm}
            </LightFilter>
          </div>
        }
        showExpand={searchLayout === 'div'}
        {...searchContentProps}
      />
    );

    return searchLayout === 'card' ? (
      <Card size="small" style={{ marginBottom: 8 }}>
        {searchFormComponent}
      </Card>
    ) : (
      <div
        style={{
          ...(searchLayout === 'plugin' ? { paddingTop: 8, paddingBottom: 8 } : undefined),
          ...searchLayoutStyle
        }}
      >
        {searchFormComponent}
      </div>
    );
  }, [
    keyword,
    normalizeSearchValues,
    propsParams,
    searchRender,
    searchForm,
    searchLayout,
    searchLayoutStyle,
    showKeyword,
    searchContentProps,
    sortSearch,
    timeName,
    timeSearch,
    field,
    updateParams
  ]);

  // 监听defParams的变化
  useEffect(() => {
    updateParams(propsParams);
  }, [JSON.stringify(propsParams)]);

  // 锁定搜索区域高度，避免频繁变化
  const [lockedSearchHeight, setLockedSearchHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    // 一旦搜索区域高度大于0且稳定，就锁定它
    if (searchHeight && searchHeight > 0 && searchHeight !== lockedSearchHeight) {
      setLockedSearchHeight(searchHeight);
    }
    return undefined; // 明确返回undefined
  }, [searchHeight, lockedSearchHeight]);

  const containerDisplay = useMemo(() => {
    if (!needSearch) {
      return 'block';
    }
    return lockedSearchHeight ? 'block' : 'none';
  }, [needSearch, lockedSearchHeight]);

  /**
   * 解析横向滚动宽度：
   * - 显式 xScroll 优先
   * - 列宽均为像素数字：累加总和（含勾选列），保证 ellipsis 按 width 裁切
   * - 百分比/非数字列宽：不设 scroll.x，表格铺满容器后 ellipsis 才能按百分比生效
   * - 存在固定列但无像素总和时：回退 true（固定列需要横向滚动能力）
   * - 勿用 max-content：会把表格按内容撑开并破坏省略
   */
  const resolvedScrollX = useMemo(() => {
    if (xScroll != null) {
      return xScroll;
    }
    if (!columns?.length) {
      return undefined;
    }

    let sum = 0;
    let allNumeric = true;
    let hasFixedColumn = false;

    for (const col of columns) {
      if (col.fixed) {
        hasFixedColumn = true;
      }
      if (typeof col.width !== 'number') {
        allNumeric = false;
      } else {
        sum += col.width;
      }
    }

    if (allNumeric && sum > 0) {
      if (rowSelection) {
        sum += 50;
      }
      return sum;
    }

    // 百分比宽度场景不要给 scroll.x，否则单元格无法按容器百分比约束，ellipsis 失效
    if (hasFixedColumn) {
      return true;
    }

    return undefined;
  }, [xScroll, columns, rowSelection]);

  const getContainerHeight = () => {
    if (containerHeight && !subHeight) {
      return containerHeight;
    }
    if (containerHeight && subHeight) {
      return containerHeight - subHeight;
    }
    if (subHeight && !containerHeight) {
      return window.innerHeight - subHeight;
    }
    return '100%';
  };

  /**
   * 父级若可滚（如页面 isScroll），会和表体抢滚动条。
   * 对齐 AhCardListPage：锁 overflow；底边超出视口时把高度收到剩余视口。
   */
  useEffect(() => {
    const parentElement = pageBodyRef.current?.parentElement;
    if (!parentElement) {
      return undefined;
    }

    const originalOverflow = parentElement.style.overflow;
    const originalHeight = parentElement.style.height;
    parentElement.style.overflow = 'hidden';

    const parentRect = parentElement.getBoundingClientRect();
    const overflowed = parentRect.bottom > window.innerHeight + 1;
    if (overflowed) {
      parentElement.style.height = `${Math.max(0, window.innerHeight - parentRect.top)}px`;
    }

    return () => {
      parentElement.style.overflow = originalOverflow;
      if (overflowed) {
        parentElement.style.height = originalHeight;
      }
    };
  }, [rootSize?.height]);

  const resolvedContainerHeight = getContainerHeight();

  return (
    <div className="ah-page-body" data-domid="AhPageContent" style={style} ref={pageBodyRef}>
      <div
        style={{
          height: resolvedContainerHeight,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          flex: resolvedContainerHeight === '100%' ? 1 : undefined
        }}
      >
        {needSearch && (
          <div ref={searchRef} style={{ flexShrink: 0 }}>
            {searchContentRender && searchContentRender(updateParams)}
            {!searchContentRender && renderSearchDiv()}
          </div>
        )}
        <AhProTable
          style={{
            background: background
          }}
          containerStyle={{
            display: containerDisplay === 'none' ? 'none' : undefined,
            flex: 1,
            minHeight: 0,
            height: 0
          }}
          searchHeight={needSearch === false ? needSearch : lockedSearchHeight}
          round={['card', 'plugin'].includes(searchLayout)}
          debounceTime={debounceTime}
          options={false}
          params={params}
          columns={columns}
          actionRef={actionRef}
          cardBordered
          search={false}
          rowSelection={
            rowSelection && {
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              ...rowSelection
            }
          }
          request={async (v: F = params, sort?: Record<string, SortOrder>) => {
            v = handleReqListParams(v, sort);
            const res = await request(v);
            return {
              ...res,
              data: res.records,
              page: res.current,
              success: true
            };
          }}
          rowKey={rowKey as any}
          // 勿默认 max-content：会把表格按内容撑开，且在有 fixed 列时强制 table-layout:auto，导致省略失效。
          scroll={{
            y: '100%',
            ...(resolvedScrollX != null ? { x: resolvedScrollX } : {})
          }}
          footerRender={footerRender?.()}
          onRow={(record) => {
            return {
              onClick: () => {
                onRowClick?.(record);
              }
            };
          }}
          alonePage={false}
          {...tableProps}
        />
        {children}
      </div>
    </div>
  );
};

export default AhPageContent;
