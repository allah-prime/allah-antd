import { useState, useImperativeHandle, useCallback, useMemo } from 'react';
import {
  InfiniteScroll,
  List,
  PullToRefresh as AntdPullToRefresh,
  SearchBar,
  ErrorBlock,
  DotLoading
} from 'antd-mobile';
import { debounce } from 'lodash';
import { defBaseFilter, IBaseFilter } from '../../theling-utils';
import { IAhFlatListProps } from './types';

const AhFlatList = <T, F extends IBaseFilter>({
  searchForm,
  defParams = {
    pageSize: 20,
    pageNum: 1
  } as F,
  request,
  pageRef,
  style,
  containerHeight,
  debounceTime = 500,
  itemRender,
  itemsRender,
  backgroundColor = '#eff2f5',
  containerStyle = {},
  noMoreRender,
  emptyRender,
  onParamsChange: propsOnParamsChange,
  rowKey = 'id',
  showSearchInput = true
}: IAhFlatListProps<T, F>) => {
  // 状态管理
  const [params, setParams] = useState<F>(() => ({
    ...defBaseFilter,
    ...defParams
  }));

  console.log(noMoreRender, searchForm);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // 搜索的Loading
  const [searchLoading, setSearchLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 数据加载函数
  const loadData = useCallback(
    async (loadParams: F, isRefresh = false) => {
      try {
        console.log('loadData', loadParams);
        if (!isRefresh) {
          setLoading(true);
        }

        const result = await request(loadParams);
        const newData = result.records || [];
        const currentPageNum = loadParams.pageNum!;

        if (isRefresh || currentPageNum === 1) {
          // 刷新或第一页，替换数据
          setData(newData);
        } else {
          // 加载更多，追加数据
          setData(prev => [...prev, ...newData]);
        }
        // 判断是否还有更多数据 接口返回的总页数 pages 大于 pageNum 就是有数据
        const hasMoreData = result.pages! > currentPageNum;
        setHasMore(hasMoreData);
        // 如果还有数据，就加一，为下一次请求做准备
        if (hasMoreData) {
          const nextPage = params.pageNum! + 1;
          const loadMoreParams = { ...params, pageNum: nextPage };
          setParams(loadMoreParams);
          propsOnParamsChange?.(loadMoreParams);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setSearchLoading(false);
        }, 100);
      }
    },
    [request, params, propsOnParamsChange]
  );

  // 搜索防抖处理
  const debouncedSearch = useMemo(
    () =>
      debounce((keyword: string) => {
        const newParams = {
          ...params,
          pageNum: 1,
          keyword
        };
        setParams(newParams);
        propsOnParamsChange?.(newParams);
        loadData(newParams, true);
      }, debounceTime),
    [loadData, propsOnParamsChange]
  );

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchLoading(true);
    setSearchKeyword(value);
    debouncedSearch(value);
  };

  // 下拉刷新处理
  const handleRefresh = useCallback(async () => {
    console.log('下拉刷新');
    await loadData({ ...params, pageNum: 1 }, true);
  }, [params, loadData]);

  // 加载更多处理
  const handleLoadMore = async () => {
    console.log('加载更多', params);
    if (loading || !hasMore) return;
    await loadData(params, false);
  };

  // 暴露给父组件的方法
  useImperativeHandle(
    pageRef,
    () => ({
      refresh: () => {
        handleRefresh();
      },
      asyncRefresh: async () => {
        await handleRefresh();
      },
      updateParams: (newParams: F) => {
        const updatedParams = { ...params, ...newParams, current: 1 };
        setParams(updatedParams);
        propsOnParamsChange?.(updatedParams);
        setSearchLoading(false);
        loadData(updatedParams, true);
      },
      getListData: () => data,
      updateData: (newData: T[]) => {
        setData(newData);
      },
      updateOneData: (item: T | any, index?: number) => {
        if (typeof index === 'number') {
          setData(prev => {
            const newData = [...prev];
            newData[index] = item;
            return newData;
          });
        } else {
          // 如果没有指定索引，尝试根据rowKey更新
          setData(prev =>
            prev.map(prevItem => (prevItem[rowKey] === item[rowKey] ? item : prevItem))
          );
        }
      },
      // 追加数据
      appendData: (newData: T[]) => {
        setData(prev => [...prev, ...newData]);
      }
    }),
    [params, rowKey]
  );

  // 渲染列表项
  const renderListItems = () => {
    if (searchLoading) {
      return (
        <div className="ahWL_ah_jz_all ahWM_t_4">
          <span>正在搜索中</span>
          <DotLoading className="ahWM_t_4" />
        </div>
      );
    }
    if (itemsRender) {
      return itemsRender(data);
    }

    if (itemRender) {
      return (
        <>
          {data.map((item, index) => (
            <div key={item.id || index}>{itemRender(item, index)}</div>
          ))}
        </>
      );
    }

    // 默认渲染
    return (
      <List>
        {data.map((item, index) => (
          <List.Item key={item.id || index}>
            <div>{JSON.stringify(item)}</div>
          </List.Item>
        ))}
      </List>
    );
  };

  // 渲染空数据占位
  const renderEmptyPlaceholder = () => {
    if (searchLoading) {
      return null;
    }
    if (data.length === 0 && !hasMore && !searchLoading) {
      // 如果用户传入了 emptyRender，则优先使用自定义渲染
      if (emptyRender) {
        return null;
      }
      return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <ErrorBlock status="empty" />
        </div>
      );
    }
    if (!hasMore) {
      // 如果用户传入了 noMoreRender，则优先使用自定义渲染
      if (noMoreRender) {
        return <>{noMoreRender}</>;
      }
      return `已经到底了，总计${data.length}条数据`;
    }
    return '正在加载中...';
  };

  const nowContainerHeight = () => {
    if (containerHeight) {
      if (showSearchInput) {
        return containerHeight - 56;
      }
      return containerHeight;
    }
    if (showSearchInput) {
      return 'calc(100% - 56px)';
    }
    return '100%';
  };

  // 根据是否启用下拉刷新来决定最终渲染
  return (
    <div
      style={{
        height: '100%',
        ...style
      }}
    >
      {showSearchInput && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fff' }}>
          <SearchBar
            placeholder="请输入搜索关键词"
            showCancelButton
            value={searchKeyword}
            onChange={handleSearch}
          />
        </div>
      )}
      <div
        style={{
          backgroundColor: backgroundColor,
          height: nowContainerHeight(),
          overflow: 'auto',
          ...containerStyle
        }}
      >
        <AntdPullToRefresh onRefresh={handleRefresh}>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {renderListItems()}
            {data.length === 0 && !hasMore && !searchLoading && emptyRender?.(params)}
            <InfiniteScroll loadMore={handleLoadMore} hasMore={hasMore}>
              {renderEmptyPlaceholder()}
            </InfiniteScroll>
          </div>
        </AntdPullToRefresh>
      </div>
    </div>
  );
};

AhFlatList.displayName = 'AhFlatList';

export default AhFlatList;
