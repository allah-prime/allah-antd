import { ReloadOutlined } from '@ant-design/icons';
import type { ParamsType } from '@ant-design/pro-components';
import { ActionType, ProColumns, ProTable, ProTableProps } from '@ant-design/pro-components';
import type { IBaseFilter } from '../../theling-utils/@types/IZlData';
import { useRequest } from 'ahooks';
import { Pagination, TablePaginationConfig, Tooltip } from 'antd';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useCssTokenSync } from '../utils';
import { useScrollbarDetection } from './useScrollbarDetection';
import './AhProTable.less';

/** 底部操作区固定高度 */
const FOOTER_HEIGHT = 38;

export type IAhProTableProps<T, U, ValueType> = ProTableProps<T, U, ValueType> & {
  /**
   * @name 列配置能力，支持一个数组
   */
  columns?: ProColumns<T, ValueType>[];
  /**
   * 是否自动分页，默认true
   */
  autoPagination?: boolean;
  /**
   * 右下角的渲染
   */
  footerRender?: React.ReactNode | null;
  /**
   * 顶部工具的样式
   */
  toolbarStyle?: React.CSSProperties;
  /**
   * 是否显示刷新按钮 - 默认true
   */
  showRefresh?: boolean;
  /**
   * 请求参数
   */
  params?: U;
  /**
   * 是否圆角
   */
  round?: boolean;
  /**
   * 是否显示边框
   */
  showBorder?: boolean;
  /**
   * 表格尺寸
   */
  size?: 'small' | 'middle' | 'medium' | 'large';
  /**
   * 搜索区域的高度 - 这个不是表格的，是外部要减去的
   */
  searchHeight?: number | boolean;
  /**
   * 最外层容器的样式
   */
  containerStyle?: React.CSSProperties;
  /**
   * 是否为单独页面
   */
  alonePage?: boolean;
};

type IParams = ParamsType &
  IBaseFilter & {
    pageNum?: number;
    pageSize?: number;
  };

function AhProTable<T extends Record<string, unknown>, U extends IParams = IParams, ValueType = 'text'>(
  props: IAhProTableProps<T, U, ValueType>
) {
  const {
    pagination: propsPagination,
    showRefresh = true,
    request,
    params: propsParams,
    actionRef,
    scroll,
    rowSelection,
    autoPagination = true,
    round = true,
    showBorder = true,
    size = 'middle',
    searchHeight,
    containerStyle,
    alonePage = true,
    ...rest
  } = props;

  let { className = 'ah-antd-pro-table', tableClassName = 'ah-antd-pro-table-dom' } = props;

  // 使用新的 CSS Token 同步 Hook
  const token = useCssTokenSync();
  const resolvedPropsParams = (propsParams ?? {}) as Partial<U>;
  const initialParams = {
    pageNum: 1,
    pageSize: 20,
    ...resolvedPropsParams
  } as U;

  // 请求参数
  const [params, setParams] = useState<U>(initialParams);

  // 是否选择了内容
  const [isSelected, setIsSelected] = useState<boolean>(false);

  // 分页配置
  const [pagination, setPagination] = useState<TablePaginationConfig | false>(
    typeof propsPagination === 'object'
      ? (propsPagination as TablePaginationConfig)
      : {
          defaultCurrent: initialParams.pageNum || 1,
          defaultPageSize: initialParams.pageSize || 20,
          pageSize: initialParams.pageSize || 20,
          current: initialParams.pageNum || 1
        }
  );

  const tableRef = useRef<ActionType>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动计算 scroll.y（未传 scroll.y 时使用）
  const [autoScrollY, setAutoScrollY] = useState<number>(0);
  const calcAutoScrollYRef = useRef<() => void>(() => {});

  const { loading, data, runAsync } = useRequest(request!, {
    manual: true,
    onSuccess: (res) => {
      if (autoPagination) {
        setPagination((currentPagination) => {
          if (!currentPagination) {
            return currentPagination;
          }

          return {
            ...currentPagination,
            total: res.total
          };
        });
      }
    }
  });

  // 监听propsParams的变化
  useEffect(() => {
    setParams((currentParams) => ({
      ...currentParams,
      ...resolvedPropsParams
    }));
  }, [propsParams]);

  // 只有数据大于0的时候才显示
  const showPagination = autoPagination && propsPagination !== false;

  const showFooter = props.footerRender !== undefined || showPagination;

  // 检测纵/横轴占位（纵轴用于表头错位；横向条在 body 内，不拿来缩短 scroll.y）
  const { hasVerticalScrollbar, checkScrollbar } = useScrollbarDetection(containerRef, [
    data?.records?.length,
    props.columns?.length,
    scroll?.x,
    size,
    showFooter,
    isSelected,
    autoScrollY
  ]);

  // 每次渲染都更新计算函数，保证闭包使用最新的值
  useEffect(() => {
    calcAutoScrollYRef.current = () => {
      if (!containerRef.current) return;
      const containerHeight = containerRef.current.offsetHeight;
      const toolbarEl = containerRef.current.querySelector<HTMLElement>(
        '.ant-pro-table-list-toolbar'
      );
      const toolbarHeight = toolbarEl?.offsetHeight ?? 0;
      const theadHeight = size === 'small' ? 39 : 46; // 表头高度
      const footerHeight = showFooter ? FOOTER_HEIGHT : 0;
      const rowSelectionBarHeight = rowSelection && isSelected ? 46 : 0;
      // 横向条在 body 内，不要再扣条高，否则表格与 footer 之间会空一截
      const y =
        containerHeight -
        toolbarHeight -
        theadHeight -
        footerHeight -
        rowSelectionBarHeight -
        2;
      setAutoScrollY(y > 0 ? y : 0);
    };
  });

  // 挂载时建立 ResizeObserver，监听容器尺寸变化自动重算
  useEffect(() => {
    calcAutoScrollYRef.current();
    const observer = new ResizeObserver(() => {
      calcAutoScrollYRef.current();
      checkScrollbar();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [checkScrollbar]);

  // isSelected / showFooter 变化时同步重算
  useEffect(() => {
    calcAutoScrollYRef.current();
  }, [showFooter, isSelected]);

  // y滚动高度计算，需要去头部和底部的高度
  // scroll?.y 和父组件的 calculateScrollY 是一个东西
  // 只有外部传入了有效的 scroll.y 时才进行高度偏移计算
  const hasScrollY = scroll?.y !== null && scroll?.y !== undefined && Number(scroll.y) > 0;
  let yScroll = hasScrollY ? Number(scroll!.y) : 0;
  if (hasScrollY && rowSelection && isSelected) {
    yScroll -= 46; // 减去rowSelection影响的高度
  }
  // 去掉底部（仅在有固定高度时才偏移）
  if (hasScrollY) {
    yScroll -= 48;
  }

  // 最终生效的 scroll.y：外部指定时用外部值，否则用自动计算值
  const effectiveScrollY = hasScrollY ? yScroll : autoScrollY;

  // antd 设了 scroll.y 后会写 overflow-y: scroll（总占位），改为 auto 后再测纵轴占位
  useEffect(() => {
    const body = containerRef.current?.querySelector(
      '.ant-table-body'
    ) as HTMLElement | null;
    if (!body) return;
    body.style.overflowY = 'auto';
    body.style.overflowX = 'auto';
    const timer = window.setTimeout(checkScrollbar, 0);
    return () => window.clearTimeout(timer);
  }, [checkScrollbar, effectiveScrollY, data?.records?.length]);

  const getBodyHeight = () => {
    // 如果 searchHeight 为 undefined，则说明没有搜索区域了
    if (
      searchHeight === false ||
      typeof searchHeight === 'boolean' ||
      typeof searchHeight === 'undefined'
    ) {
      return 'calc(100% - 8px)';
    }
    // 外层只扣搜索区；横向条在 table body 内，不要在容器上再留一条
    if (!showFooter) {
      return `calc(100% - ${searchHeight + 12}px)`;
    }
    return `calc(100% - ${searchHeight}px)`;
  };

  // 动态样式 - 现在可以直接使用 token，因为 CSS 变量已经同步
  const tableContainerStyle = {
    borderRadius: round ? token.borderRadius : 0,
    border: showBorder ? `1px solid ${token.colorBorderSecondary}` : 'none',
    backgroundColor: token.colorBgContainer,
    height: getBodyHeight(),
    ['--ah-footer-height']: `${FOOTER_HEIGHT}px`,
    ['--ah-table-body-y']:
      effectiveScrollY > 0 ? `${effectiveScrollY}px` : 'auto',
    ...containerStyle,
    // AhPageContent 会传入 display:block，这里改成 column，让 footer 贴容器底
    display: containerStyle?.display === 'none' ? 'none' : 'flex',
    flexDirection: 'column'
  } as React.CSSProperties;
  const footerStyle = {
    backgroundColor: token.colorBgContainer,
    padding: `0 ${token.paddingMD}px 0 0`,
    borderTop: showBorder ? `1px solid ${token.colorBorderSecondary}` : 'none',
    justifyContent: showPagination ? 'space-between' : 'flex-end',
    borderRadius: round ? `0 0 ${token.borderRadius}px ${token.borderRadius}px` : 0
  };

  const reloadIconStyle = {
    color: token.colorTextSecondary,
    marginLeft: token.marginXXS,
    fontSize: token.fontSizeLG
  };

  if (!round) {
    className = `${className} ah-antd-pro-table-no-radius`;
  }

  if (!showPagination) {
    // 没有分页的样式
    className = `${className} ah-antd-pro-table-no-pagination`;
  } else {
    // 有分页的样式
    className = `${className} ah-antd-pro-table-has-pagination ${alonePage ? 'ah-antd-pro-table-alone-page' : 'ah-antd-pro-table-not-alone-page'}`;
  }

  // 如果显示分页，并且开启圆角，那么就隐藏底部的border
  if (showPagination && round) {
    tableClassName = `${tableClassName} ah-antd-pro-hide-boottom-border`;
  }

  // 如果没有数据，就给100%的高度，让暂无数据居中
  if (data?.records?.length > 0) {
    // 有数据的时候，给一个默认的高度
    tableClassName = `${tableClassName} ah-antd-pro-table-has-data`;
  } else {
    tableClassName = `${tableClassName} ah-antd-pro-table-no-data`;
  }

  // 如果显示圆角，那么底部也要加上圆角
  if (round) {
    tableClassName = `${tableClassName} ah-antd-pro-bottom-border-radius`;
  }

  if (size === 'small') {
    className = `${className} ah-antd-pro-table-small`;
  }

  if (!data || !data.records || data.records?.length === 0) {
    // 这里说明没数据了，要做额外的处理
    className = `${className} ah-antd-pro-hide-border-bottom`;
  }

  useImperativeHandle(actionRef, () => tableRef.current);

  return (
    <div
      ref={containerRef}
      style={tableContainerStyle}
      className={`ah-antd-pro-table-container custom-scrollbar${
        hasVerticalScrollbar ? '' : ' ah-no-v-scrollbar'
      }`}
      data-domid="ah-antd-pro-table-container"
    >
      <ProTable<T, U, ValueType>
        className={className}
        actionRef={tableRef}
        tableClassName={tableClassName}
        request={runAsync}
        pagination={false}
        params={params}
        styles={{
          content:
            effectiveScrollY > 0
              ? {
                  height: effectiveScrollY,
                  maxHeight: effectiveScrollY,
                  overflowX: 'auto',
                  overflowY: 'auto'
                }
              : undefined
        }}
        rowSelection={
          rowSelection
            ? {
                ...rowSelection,
                columnWidth: 50,
                onChange: (selectedRowKeys, selectedRows, info) => {
                  setIsSelected(selectedRowKeys.length > 0);
                  rowSelection.onChange?.(
                    selectedRowKeys,
                    selectedRows,
                    info
                  );
                }
              }
            : false
        }
        scroll={
          effectiveScrollY > 0
            ? { ...(scroll ?? {}), y: effectiveScrollY }
            : scroll
        }
        size={size === 'middle' ? 'medium' : size}
        {...rest}
      />
      {!showFooter && !round && <div style={{ height: 4 }} />}
      {showFooter && (
        <div className="ah-antd-pro-table-footer" style={footerStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            {showPagination && pagination ? (
              <Pagination
                onChange={(page, pageSize) => {
                  // 如果page没变，但是变得是pageSize，就需要重置页码
                  if (page === pagination?.current && pageSize !== pagination?.pageSize) {
                    page = 1;
                  }
                  setPagination({
                    ...pagination,
                    current: page,
                    pageSize
                  });
                  // 修改参数发送请求
                  setParams({
                    ...params,
                    pageNum: page,
                    pageSize
                  });
                }}
                showQuickJumper
                size="small"
                total={data?.total || 0}
                showTotal={(total) => `共 ${total} 条`}
                pageSizeOptions={['10', '20', '30']}
                pageSize={10}
                style={{ marginLeft: token.marginMD }}
                {...pagination}
              />
            ) : null}
            {showRefresh && (
              <Tooltip title="刷新">
                <ReloadOutlined
                  style={reloadIconStyle}
                  spin={loading}
                  onClick={() => tableRef.current?.reload()}
                />
              </Tooltip>
            )}
          </div>
          <div className="ah-antd-pro-table-footer-extra">{rest.footerRender}</div>
        </div>
      )}
    </div>
  );
}

export default AhProTable;
