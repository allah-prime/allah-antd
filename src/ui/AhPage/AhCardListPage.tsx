import { ProFormInstance, ProFormSelect } from '@ant-design/pro-components';
import { IBaseFilter } from '../../theling-utils/@types/IZlData';
import { defaultTableData } from '../../theling-utils/utils/ObjectUtils';
import { useInfiniteScroll, useSize } from 'ahooks';
import { Card, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import LightFilter from '../LightFilter';
import SearchContent from '../utils/SearchContent';
import SearchDiv from '../utils/SearchDiv';
import AhReactUtils from '../utils/AhReactUtils';
import { IAhCardListPageProps } from '../ahAntdTypes';
import ProFormSearch from '../AhFormFilter/ProFormSearch';
import './AhCardListPage.css';

// 修改类型定义
type ProFormSelectElement = React.ReactElement<React.ComponentProps<typeof ProFormSelect>>;

const AhCardListPage = <T, F extends IBaseFilter>({
  searchForm,
  defParams = {
    pageSize: 20,
    pageNum: 1
  } as F,
  request,
  searchContentProps,
  pageRef,
  searchRender,
  searchContentRender,
  style,
  searchLayout,
  containerHeight,
  debounceTime = 500,
  itemRender,
  itemsRender,
  backgroundColor = '#eff2f5',
  containerStyle = {},
  noMoreRender,
  onParamsChange: propsOnParamsChange,
  rowKey = 'id',
  showHeader = true,
  showSearchInput = true
}: IAhCardListPageProps<T, F>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageBodyRef = useRef<HTMLDivElement | null>(null);

  const searchRef = useRef<any>(undefined);

  // 默认的容器高度
  const [defListHeight, setDefListHeight] = useState<number>(0);

  const formRef = useRef<ProFormInstance>(undefined);

  const [params, setParams] = useState<F>(defParams);
  const paramsRef = useRef<F>(defParams);
  const pendingParamsRef = useRef<F>(defParams);
  const [parentEl, setParentEl] = useState<HTMLElement | null>(null);

  const rootSize = useSize(document.getElementById('root'));

  useEffect(() => {
    let originalStyles: any | null = null;
    let parentElement: HTMLElement | null = null;

    if (pageBodyRef.current?.parentElement) {
      parentElement = pageBodyRef.current.parentElement;
      // 这个组件的父级要关闭滚动条
      parentElement.style.overflow = 'hidden';
      //console.log('如果clientHeight小于300则说明高度没有设置，那么就改成window.innerHeight')
      //console.log("pageBodyRef.current.parentElement.tagName",pageBodyRef.current.parentElement.tagName)
      // 如果父级是main标签，那么高度设置为 window.innerHeight - 56
      if (parentElement.tagName === 'MAIN') {
        // 保存原始高度
        originalStyles = parentElement.style;
        parentElement.style.height = `${window.innerHeight - 56}px`;
      } else if (parentElement.clientHeight < 300) {
        // 如果clientHeight小于300则说明高度没有设置，那么就改成window.innerHeight
        originalStyles = parentElement.style;
        parentElement.style.height = '100%';
      }
      // 当设置为100%时，还是无法指定父级的高度，那么就设置自己的高度为window.innerHeight
      if (parentElement.clientHeight < 300) {
        setDefListHeight(window.innerHeight);
      }
      setParentEl(parentElement as HTMLElement);
    }

    // 清理函数：组件销毁时恢复原始样式
    return () => {
      if (parentElement && originalStyles !== null) {
        parentElement.style.height = originalStyles.height;
        parentElement.style.overflow = originalStyles.overflow;
      }
    };
  }, [rootSize?.height]);

  // 数据的Loading
  const [loading, setLoading] = useState<boolean>(false);

  // 当前容器的高度
  const containerMeasuredHeight = containerHeight || defListHeight || parentEl?.clientHeight || 0;

  const dataList = useInfiniteScroll(
    async (p = { nextId: 1 }) => {
      let { nextId } = p;
      if (nextId === 1) {
        setLoading(true);
      }
      // 调用接口获取数据
      const res = await request({
        ...paramsRef.current,
        pageNum: nextId
      });
      // 判断下一页数据还有吗
      nextId = nextId + 1;
      if (nextId > res.pages) {
        nextId = undefined;
      }
      setLoading(false);
      return {
        ...res,
        list: res.records,
        nextId
      };
    },
    {
      target: containerRef,
      isNoMore: (d: any = { nextId: 1 }) => {
        console.log('containerRef', containerRef);
        return d.nextId === undefined;
      }
    }
  );

  const reloadRef = useRef(dataList.reload);

  useEffect(() => {
    reloadRef.current = dataList.reload;
  }, [dataList.reload]);

  const commitParams = (newParams: F) => {
    paramsRef.current = newParams;
    pendingParamsRef.current = newParams;
    setParams(newParams);
    formRef.current?.setFieldsValue(newParams);
    propsOnParamsChange?.(newParams);
  };

  const dataReload = useMemo(
    () =>
      debounce((newParams: F) => {
        commitParams(newParams);
        reloadRef.current();
      }, debounceTime),
    [debounceTime, propsOnParamsChange]
  );

  useEffect(() => {
    return () => {
      dataReload.cancel();
    };
  }, [dataReload]);

  const onSearch = (p2: F, immediate = false) => {
    // 滚动到上面去
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    // 这里把defParams放在后面，是为了避免有些参数没有传递的时候，能传递一个ubdefined过去
    const newParams = { ...paramsRef.current, ...defParams, ...p2 };
    pendingParamsRef.current = newParams;
    if (immediate) {
      dataReload.cancel();
      commitParams(newParams);
      reloadRef.current();
      return;
    }
    dataReload(newParams);
  };

  useImperativeHandle(pageRef, () => ({
    refresh: () => {
      dataReload.cancel();
      const newParams = { ...pendingParamsRef.current, pageNum: 1 };
      commitParams(newParams as F);
      return dataList.reloadAsync();
    },
    asyncRefresh: () => {
      dataReload.cancel();
      const newParams = { ...pendingParamsRef.current, pageNum: 1 };
      commitParams(newParams as F);
      return dataList.reload();
    },
    updateParams: (newParams: F) => onSearch(newParams, true),
    getListData: () => dataList.data || defaultTableData,
    updateData: (d) => dataList.mutate(d),
    updateOneData: (d: T) => {
      const { list = [] } = dataList.data;
      const index = list.findIndex(
        (item: { [x: string]: any }) => item[rowKey] === (d as any)[rowKey]
      );
      if (index > -1) {
        list[index] = d;
        dataList.data.list = list;
        dataList.mutate({ ...dataList.data });
      }
    },
    addData: (items: T | T[]) => {
      const { list = [] } = dataList.data;
      const newItems = Array.isArray(items) ? items : [items];
      const updatedList = [...list, ...newItems];
      const newData = {
        ...dataList.data,
        list: updatedList,
        records: updatedList,
        total: (dataList.data?.total || 0) + newItems.length
      };
      dataList.mutate(newData);
    },
    deleteData: (id: any) => {
      const { list = [] } = dataList.data;
      const updatedList = list.filter((item: { [x: string]: any }) => item[rowKey] !== id);
      const newData = {
        ...dataList.data,
        list: updatedList,
        records: updatedList,
        total: (dataList.data?.total || 0) - (list.length - updatedList.length)
      };
      dataList.mutate(newData);
    }
  }));

  // 添加类型声明
  const processFormItems = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const typedChild = child as React.ReactElement<any>;

      if (typedChild.type === ProFormSelect) {
        return React.cloneElement(typedChild as ProFormSelectElement, {
          fieldProps: {
            ...(typedChild.props.fieldProps || {}),
            popupMatchSelectWidth: false
          }
        });
      }

      // 如果有子元素，递归处理
      if (typedChild.props.children) {
        return React.cloneElement(typedChild, {
          children: processFormItems(typedChild.props.children)
        });
      }

      return typedChild;
    });
  };

  const searchDiv = () => {
    const searchDom = searchRender ? (
      processFormItems(searchRender(onSearch))
    ) : (
      <SearchContent
        className=""
        searchForm={
          <LightFilter
            formRef={formRef}
            initialValues={params}
            onValuesChange={(_, v: any) => {
              onSearch({ ...v, pageNum: 1 });
            }}
          >
            {showSearchInput && <ProFormSearch />}
            {processFormItems(searchForm)}
          </LightFilter>
        }
        {...searchContentProps}
      />
    );

    if (searchLayout === 'plugin') {
      return (
        <div className="ahWP_x_4 ahWP_y_2" ref={searchRef}>
          {searchDom}
        </div>
      );
    }

    if (searchLayout === 'card') {
      return (
        <Card style={{ marginBottom: 8 }} size="small" ref={searchRef}>
          {searchDom}
        </Card>
      );
    }
    return <SearchDiv searchRef={searchRef}>{searchDom}</SearchDiv>;
  };

  return (
    <div
      style={{
        height: containerMeasuredHeight,
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
      ref={pageBodyRef}
      data-domid="ah-card-list-page"
    >
      {showHeader && (
        <>
          {searchContentRender && <div ref={searchRef}>{searchContentRender(onSearch)}</div>}
          {!searchContentRender && searchDiv()}
        </>
      )}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: backgroundColor,
          padding: '16px',
          ...containerStyle
        }}
        ref={containerRef}
      >
        <Spin
          spinning={loading}
          description="正在努力加载数据~"
          style={{
            height: '100%'
          }}
        >
          {itemRender &&
            dataList.data?.list.map((item: T, index: number) => itemRender(item, index))}
          {itemsRender?.(dataList.data?.list || [])}
          {dataList.data?.total === 0 && noMoreRender}
          {AhReactUtils.buildListLoading({
            loading: dataList.loading,
            noMore: dataList.noMore,
            total: dataList.data?.total || 0,
            pageNum: params.pageNum!
          })}
        </Spin>
      </div>
    </div>
  );
};

export default AhCardListPage;
