import {
  ActionType,
  ProFormDateRangePicker,
  ProFormInstance,
  ProFormSelect
} from '@ant-design/pro-components';
import { dateUtils, handleReqListParams } from '@allahjs/utils';
import type { IBaseFilter, ITablePage } from '@allahjs/utils';
import { useDebounceFn, useSize } from 'ahooks';
import dayjs from 'dayjs';
import { Button, Card, Input, message, Table } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import LightFilter from '../LightFilter';
import SearchContent from '../utils/SearchContent';
import { IAhPageContentProps } from '../ahAntdTypes';
import AhProTable from '../AhProTable/AhProTable';
import {
  isEmptyFilterValue,
  pickEffectiveParams,
  readUrlParams,
  stableStringify,
  writeUrlParams
} from './filterUtils';
import AhFilterViewBar, { AhFilterHeaderBar, useFilterViews } from './AhFilterViewBar';
import AhFilterConditionPopover, { AhFilterChips } from './AhFilterConditionPopover';
import AhSortConditionPopover from './AhSortConditionPopover';
import type { IAhSortField } from '../ahAntdTypes';
import './filterBar.less';

/** 内置排序字段（sortSearch === true 时使用） */
const DEFAULT_SORT_FIELDS: IAhSortField[] = [
  { field: 'update_time', label: '更新时间', type: 'date' },
  { field: 'cre_time', label: '创建时间', type: 'date' }
];

/** 时间筛选字段配置 */
type ITimeFieldConfig = { field: string; label: string };
/** 排序筛选选项 */
type ISortOption = { label: string; value: string; sort: Record<string, boolean> };
type ISortSearchConfig = { name: string; label: string; options: ISortOption[] };

const DEFAULT_SORT_OPTIONS: ISortOption[] = [
  { label: '更新排序', value: '1', sort: { update_time: false } },
  { label: '创建排序', value: '2', sort: { cre_time: false } }
];

/** 分页保留键：重置时页码回 1、页大小保留，dirty 判定忽略 */
const PAGINATION_KEYS = ['pageNum', 'pageSize', 'current'];
/** 非表单键：铺表单初始值时剔除，避免 LightFilter 误判"有筛选" */
const NON_FORM_KEYS = [...PAGINATION_KEYS, 'keyword', 'sort'];

/** 去掉空值与分页键，用于视图快照与变更对比 */
const stripPagination = (source: Record<string, unknown>) => {
  const copy = pickEffectiveParams(source ?? {}) as Record<string, unknown>;
  for (const key of PAGINATION_KEYS) {
    delete copy[key];
  }
  return copy;
};

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
  subHeight,
  searchMode = 'instant',
  syncUrl = false,
  onError,
  searchCollapsible,
  showReset = true,
  filterFields,
  filterViews,
  title,
  description,
  headerRightRender
}: IAhPageContentProps<T, F>) => {
  const formRef = useRef<ProFormInstance>(undefined);

  /** div 布局默认走新版「视图栏 + 左右两栏」；显式 searchCollapsible 保留旧版展开收起 */
  const useNewLayout = searchLayout === 'div' && searchCollapsible !== true;
  // 视图为显式开启：传了 filterViews，或使用声明式 filterFields；其余 div 页面保持无视图栏
  const viewsApi = useFilterViews(filterViews, !!filterFields?.length);
  const initialViewParams = viewsApi.enabled ? viewsApi.activeView?.params : undefined;
  /** submit 模式下新布局的暂存值（弹层/chip/排序），点「查询」统一提交 */
  const [pending, setPending] = useState<Record<string, unknown>>({});

  /**
   * 最外层页面容器引用，用于获取父容器元素
   */
  const pageBodyRef = useRef<HTMLDivElement | null>(null);
  const rootSize = useSize(typeof document === 'undefined' ? null : document.getElementById('root'));

  // URL 同步的 key 白名单（对象形态时可限定只同步部分参数）
  const urlKeys = syncUrl && syncUrl !== true ? syncUrl.keys : undefined;
  const urlKeysRef = useRef(urlKeys);
  urlKeysRef.current = urlKeys;

  // 列表数据：初始合并顺序 defParams < URL < propsParams
  const urlInitialParamsRef = useRef<Record<string, unknown>>(
    syncUrl ? readUrlParams(urlKeys) : {}
  );
  const [params, setParams] = useState<F>(() => ({
    ...defParams,
    ...initialViewParams,
    ...urlInitialParamsRef.current,
    ...propsParams
  } as F));
  /**
   * 声明式筛选的条件行（有序字段名，'' 为尚未选字段的新增行）。
   * 初始 = defaultVisible 字段 ∪ 已有值的字段；重置/切换视图时按快照重算
   */
  const computeConditions = (values: Record<string, unknown>) =>
    (filterFields ?? [])
      .filter((item) => item.defaultVisible || !isEmptyFilterValue(values[item.name]))
      .map((item) => item.name);
  const [conditions, setConditions] = useState<string[]>(() =>
    computeConditions(params as Record<string, unknown>)
  );
  // params 的同步镜像：所有写入路径统一维护，updateParams 无需函数式更新即可读到最新值
  const paramsRef = useRef<F>(params);
  const [keyword, setKeyword] = useState<string>(
    (propsParams as Record<string, unknown>).keyword as string ??
      (initialViewParams?.keyword as string | undefined) ??
      (defParams as Record<string, unknown>).keyword as string ??
      ''
  );
  const searchRef = useRef<any>(undefined);
  const actionRef = useRef<ActionType>(undefined);
  const searchHeight = useSize(searchRef)?.height;
  const keywordRef = useRef<string>(
    (propsParams as Record<string, unknown>).keyword as string ??
      (initialViewParams?.keyword as string | undefined) ??
      (defParams as Record<string, unknown>).keyword as string ??
      ''
  );

  // 重置目标快照（挂载时的 defParams + 初始 propsParams，不含 URL 态——重置应回到"出厂"而非"上次链接"）
  const resetSnapshotRef = useRef<F>({ ...defParams, ...propsParams, pageNum: 1 } as F);
  // 表单初始值（剔除分页/keyword/sort 等非表单键，URL 态需要回显所以保留），挂载时计算一次
  const initialFormValuesRef = useRef<Record<string, unknown> | undefined>(undefined);
  if (initialFormValuesRef.current === undefined) {
    const merged = {
      ...defParams,
      ...initialViewParams,
      ...urlInitialParamsRef.current,
      ...propsParams
    } as Record<string, unknown>;
    initialFormValuesRef.current = Object.fromEntries(
      Object.keys(merged)
        .filter((key) => !NON_FORM_KEYS.includes(key))
        .map((key) => [key, merged[key]])
    );
  }

  /** 请求成功结果缓存：失败时回放，表格保留旧数据 */
  const lastSuccessRef = useRef<ITablePage<T> | undefined>(undefined);
  /** 上次请求是否失败：失败后同参重试需要强制 reload（参数未变时 ProTable 不会重发请求） */
  const hadErrorRef = useRef(false);
  const onErrorRef = useRef<((e: unknown) => void) | undefined>(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  /** 重置信号：递增触发 LightFilter 清空内部暂存值 */
  const [resetSignal, setResetSignal] = useState(0);

  /** 时间筛选字段列表：true 保持单字段（field/timeName），数组支持多区间 */
  const timeFields: ITimeFieldConfig[] = useMemo(() => {
    if (!timeSearch) {
      return [];
    }
    if (timeSearch === true) {
      return [{ field, label: timeName }];
    }
    return timeSearch.map((item) => ({ field: item.field, label: item.label ?? timeName }));
  }, [timeSearch, field, timeName]);

  /** 排序筛选配置：true 用默认两项，对象可自定义 */
  /** 新布局多条件排序字段；仅给旧版 options 时为 undefined（回退单选下拉） */
  const sortFields: IAhSortField[] | undefined = useMemo(() => {
    if (!useNewLayout || !sortSearch) {
      return undefined;
    }
    if (sortSearch === true) {
      return DEFAULT_SORT_FIELDS;
    }
    if (sortSearch.fields?.length) {
      return sortSearch.fields;
    }
    return sortSearch.options?.length ? undefined : DEFAULT_SORT_FIELDS;
  }, [useNewLayout, sortSearch]);

  const sortConfig: ISortSearchConfig | undefined = useMemo(() => {
    if (!sortSearch || sortFields) {
      return undefined;
    }
    if (sortSearch === true) {
      return { name: 'timeSort', label: '排序', options: DEFAULT_SORT_OPTIONS };
    }
    return {
      name: sortSearch.name ?? 'timeSort',
      label: sortSearch.label ?? '排序',
      options: sortSearch.options?.length ? sortSearch.options : DEFAULT_SORT_OPTIONS
    };
  }, [sortSearch, sortFields]);

  // 更新参数：合并语义。默认值只在初始化生效（defParams 铺底），
  // 任意筛选键更新且未显式给 pageNum 时自动回第 1 页。
  const updateParams = useCallback(
    (updatedParams: F, syncForm = true) => {
      if ('keyword' in (updatedParams as object)) {
        const nextKeyword = (updatedParams as Record<string, unknown>).keyword as string ?? '';
        keywordRef.current = nextKeyword;
        setKeyword(nextKeyword);
      }
      const prev = paramsRef.current as Record<string, unknown>;
      const updates = (updatedParams ?? {}) as Record<string, unknown>;
      const hasFilterKey = Object.keys(updates).some((key) => !PAGINATION_KEYS.includes(key));
      const newParams = {
        ...defParams,
        ...prev,
        ...updates,
        ...(hasFilterKey && !('pageNum' in updates) ? { pageNum: 1 } : {})
      } as F;
      paramsRef.current = newParams;
      setParams(newParams);
      propsSetParams?.(newParams);
      if (syncForm) {
        formRef.current?.setFieldsValue(newParams);
      }
    },
    [defParams, propsSetParams]
  );

  useImperativeHandle(pageRef, () => ({
    refresh: actionRef.current!.reload,
    asyncRefresh: actionRef.current!.reload,
    updateParams: updateParams,
    setParams: (v: F) => {
      if ('keyword' in (v as object)) {
        const nextKeyword = (v as Record<string, unknown>).keyword as string ?? '';
        keywordRef.current = nextKeyword;
        setKeyword(nextKeyword);
      }
      formRef.current?.setFieldsValue(v);
      paramsRef.current = v;
      setParams(v);
      // 与 updateParams 对齐：受控父组件同样收到通知
      propsSetParams?.(v);
    }
  }));

  const normalizeSearchValues = useCallback(
    (values: Record<string, any>) => {
      const nextValues = { ...values };
      // 配置的日期区间字段 + 自动识别表单里的 Dayjs 二元数组（自塞的日期字段免声明）
      for (const key of Object.keys(nextValues)) {
        const value = nextValues[key];
        const isConfigured = timeFields.some((item) => item.field === key);
        const isDayjsPair =
          Array.isArray(value) && value.length === 2 && dayjs.isDayjs(value[0]);
        if (isConfigured || isDayjsPair) {
          nextValues[key] = value?.length > 0 ? dateUtils.getStartEndTimeStr(value, 'auto') : undefined;
        }
      }
      // 排序映射：选中项翻译为 sort 对象；清空时清除残留
      if (sortConfig) {
        const matched = sortConfig.options.find(
          (option) => option.value === nextValues[sortConfig.name]
        );
        nextValues.sort = matched ? matched.sort : undefined;
        delete nextValues[sortConfig.name];
      }
      return nextValues;
    },
    [timeFields, sortConfig]
  );

  /** keyword 提交（参数层防抖，请求层防抖兜底） */
  const submitKeyword = useCallback(
    (value: string) => {
      updateParams({ keyword: value, pageNum: 1 } as F);
    },
    [updateParams]
  );
  const { run: debouncedKeywordSubmit, cancel: cancelKeywordDebounce } = useDebounceFn(
    (value: string) => submitKeyword(value),
    { wait: debounceTime }
  );

  /** submit 模式：读取表单当前值 + keyword 统一提交 */
  const doSubmitQuery = useCallback(() => {
    const formValues = (formRef.current?.getFieldsValue() ?? {}) as Record<string, unknown>;
    const nextValues = normalizeSearchValues(formValues);
    const nextParams = {
      ...nextValues,
      ...pending,
      ...(showKeyword ? { keyword: keywordRef.current } : {}),
      pageNum: 1
    } as F;
    setPending({});
    // 参数（按合并语义）未变但上次失败：updateParams 不会触发重发，需强制 reload 兜底重试
    const merged = {
      ...defParams,
      ...(paramsRef.current as Record<string, unknown>),
      ...(nextParams as Record<string, unknown>)
    } as F;
    const unchanged = stableStringify(merged) === stableStringify(paramsRef.current);
    updateParams(nextParams, false);
    if (unchanged && hadErrorRef.current) {
      setTimeout(() => actionRef.current?.reload(), 0);
    }
  }, [normalizeSearchValues, updateParams, showKeyword, defParams, pending]);

  /**
   * 一键重置：表单/折叠暂存/keyword/params 全部回到目标快照。
   * 不传 target 回到挂载快照；传视图快照则整体切换到该视图（「清除变更」「切换视图」共用）
   */
  const handleReset = useCallback((target?: Record<string, unknown>) => {
    cancelKeywordDebounce();
    setPending({});
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({
      ...initialFormValuesRef.current,
      // 视图快照里的标量值回填 legacy 表单（对象型日期区间由 chip/弹层自行回显）
      ...Object.fromEntries(
        Object.entries(target ?? {}).filter(
          ([key, value]) => !NON_FORM_KEYS.includes(key) && typeof value !== 'object'
        )
      )
    });
    setResetSignal((signal) => signal + 1);
    const snapshot = (target ?? resetSnapshotRef.current) as Record<string, unknown>;
    const nextKeyword =
      typeof snapshot.keyword === 'string' ? (snapshot.keyword as string) : '';
    keywordRef.current = nextKeyword;
    setKeyword(nextKeyword);
    const prev = paramsRef.current as Record<string, unknown>;
    const next = {
      // 快照里没有的旧键显式置空：AhProTable 内部按"合并"吸收 params，缺省键会残留旧值
      ...Object.fromEntries(
        Object.keys(prev)
          .filter((key) => !(key in snapshot) && !PAGINATION_KEYS.includes(key))
          .map((key) => [key, undefined])
      ),
      ...snapshot,
      // 页大小保留用户当前选择，页码回 1
      pageSize: prev.pageSize ?? snapshot.pageSize,
      pageNum: 1
    } as F;
    const unchanged = stableStringify(next) === stableStringify(paramsRef.current);
    setConditions(computeConditions(next as Record<string, unknown>));
    paramsRef.current = next;
    setParams(next);
    propsSetParams?.(next);
    if (unchanged && hadErrorRef.current) {
      setTimeout(() => actionRef.current?.reload(), 0);
    }
  }, [propsSetParams, cancelKeywordDebounce]);

  /** 当前对比基线：所选视图快照，未选视图时为挂载快照 */
  const baselineSnapshot = (viewsApi.enabled ? viewsApi.activeView?.params : undefined) ??
    (resetSnapshotRef.current as Record<string, unknown>);

  /** 是否有变更（相对基线）；submit 模式下有未提交暂存也算，控制重置/清除变更 */
  const filtersDirty = useMemo(
    () =>
      stableStringify(stripPagination(params as Record<string, unknown>)) !==
        stableStringify(stripPagination(baselineSnapshot)) ||
      Object.keys(pending).length > 0,
    [params, baselineSnapshot, pending]
  );

  /** 保存视图：快照 = 当前已生效参数（keyword、筛选、sort），不含分页 */
  const handleCreateView = (name: string) => {
    const view = {
      id: `v_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name,
      params: stripPagination(paramsRef.current as Record<string, unknown>)
    };
    viewsApi.save(view);
    viewsApi.select(view.id);
    message.success('视图已保存');
  };
  const handleUpdateView = () => {
    if (viewsApi.activeView) {
      viewsApi.save({
        ...viewsApi.activeView,
        params: stripPagination(paramsRef.current as Record<string, unknown>)
      });
      message.success('视图已更新');
    }
  };
  const handleSelectView = (id?: string) => {
    viewsApi.select(id);
    const target = id ? viewsApi.views.find((view) => view.id === id)?.params : undefined;
    handleReset(target);
  };

  /** 新布局：筛选/排序条件变更（instant 直接生效，submit 暂存） */
  const handleConditionChange = (patch: Record<string, unknown>) => {
    if (searchMode === 'submit') {
      setPending((prev) => ({ ...prev, ...patch }));
    } else {
      updateParams(patch as F, false);
    }
  };
  /** 弹层/chip 展示值：已生效参数叠加 submit 暂存 */
  const conditionValues = { ...(params as Record<string, unknown>), ...pending };

  // 受控 propsParams 响应：key 排序的稳定比较；与当前一致时跳过，避免"内部更新 → 父回灌"的回声循环
  const propsParamsKey = stableStringify(propsParams);
  const paramsKeyRef = useRef<string>(stableStringify(params));
  paramsKeyRef.current = stableStringify(params);
  useEffect(() => {
    if (paramsKeyRef.current === propsParamsKey) {
      return;
    }
    updateParams(propsParams);
    // updateParams 为稳定引用（deps: defParams/propsSetParams），propsParamsKey 变化才需要重放
  }, [propsParamsKey]);

  // URL 同步：写入用 replaceState（不产生历史栈）
  const paramsKey = stableStringify(params);

  // 外部写入（受控 params、popstate、ref）带来了新条件字段时，补进条件行，保证 chip 不丢
  useEffect(() => {
    if (!filterFields?.length) {
      return;
    }
    const missing = computeConditions(params as Record<string, unknown>).filter(
      (name) => !conditions.includes(name)
    );
    if (missing.length) {
      setConditions((prev) => [...prev, ...missing]);
    }
  }, [paramsKey]);
  useEffect(() => {
    if (!syncUrl) {
      return;
    }
    writeUrlParams(params as Record<string, unknown>, urlKeysRef.current);
  }, [paramsKey, syncUrl]);

  // 浏览器前进/后退还原筛选
  useEffect(() => {
    if (!syncUrl) {
      return undefined;
    }
    const onPopState = () => {
      updateParams(readUrlParams(urlKeysRef.current) as F);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [syncUrl, updateParams]);

  /** AhProTable 内部分页变化上行：静默合并进 params（相等不写），父组件不再持有陈旧页码 */
  const handleInternalParamsChange = useCallback(
    (internal: Record<string, unknown>) => {
      const page = internal.pageNum as number | undefined;
      const size = internal.pageSize as number | undefined;
      const prev = paramsRef.current as Record<string, unknown>;
      if (prev.pageNum === page && prev.pageSize === size) {
        return;
      }
      const next = {
        ...prev,
        ...(page !== undefined && page !== null ? { pageNum: page } : {}),
        ...(size !== undefined && size !== null ? { pageSize: size } : {})
      } as F;
      paramsRef.current = next;
      setParams(next);
      propsSetParams?.(next);
    },
    [propsSetParams]
  );

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
    if (xScroll !== undefined && xScroll !== null) {
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
    // 仅当父元素顶部已在视口内才收拢；首屏之外的父元素（如长文档页下方的 demo）
    // innerHeight - top 为负，钳成 0 会把整个组件隐藏。
    const overflowed =
      parentRect.bottom > window.innerHeight + 1 && parentRect.top < window.innerHeight;
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

  /** searchForm 支持 render-prop 形态（拿到 form 实例） */
  const searchFormNode =
    typeof searchForm === 'function'
      ? searchForm(formRef.current)
      : searchForm;

  const keywordNode = showKeyword ? (
    <Input.Search
      placeholder="请输入关键字查询"
      aria-label="关键词搜索"
      allowClear
      style={{ width: 200 }}
      value={keyword}
      onSearch={(value) => {
        keywordRef.current = value;
        setKeyword(value);
        cancelKeywordDebounce();
        if (searchMode === 'submit') {
          doSubmitQuery();
        } else {
          submitKeyword(value);
        }
      }}
      onChange={(e) => {
        const value = e.target.value;
        keywordRef.current = value;
        setKeyword(value);
        // 参数层防抖：每键只更新输入态，提交经 debounceTime 收敛为一次
        if (searchMode === 'instant') {
          debouncedKeywordSubmit(value);
        }
      }}
    />
  ) : null;

  /** 传统筛选表单（searchForm + 日期区间 + 旧版单选排序），list 为要渲染的日期区间 */
  const renderLightFilter = (list: ITimeFieldConfig[]) => (
    <LightFilter
      formRef={formRef}
      initialValues={initialFormValuesRef.current as Record<string, unknown>}
      resetSignal={resetSignal}
      onValuesChange={(_, values: any) => {
        // submit 模式下表单值只暂存，点「查询」统一提交
        if (searchMode !== 'instant') {
          return;
        }
        const nextValues = normalizeSearchValues(values);
        updateParams(
          {
            ...nextValues,
            ...(showKeyword ? ({ keyword: keywordRef.current } as Record<string, any>) : {}),
            pageNum: 1
          } as F,
          false
        );
      }}
    >
      {list.map((item) => (
        <ProFormDateRangePicker key={item.field} label={item.label} name={item.field} />
      ))}
      {sortConfig && (
        <ProFormSelect
          name={sortConfig.name}
          initialValue={sortConfig.options[0]?.value}
          label={sortConfig.label}
          allowClear
          options={sortConfig.options.map((option) => ({
            label: option.label,
            value: option.value
          }))}
        />
      )}
      {searchFormNode}
    </LightFilter>
  );

  /** 新版 div 布局：视图栏 + 左（筛选条件）右（搜索与排序）各占一半、各自换行 */
  const renderNewSearch = () => {
    const hasFilterFields = !!filterFields?.length;
    // 声明式字段模式下日期区间由 dateRange 字段承担，LightFilter 仅承载手写 searchForm/旧排序
    const showLightFilter = !hasFilterFields || !!searchFormNode || !!sortConfig;
    return (
      <div className="ah-filter-header ah-page-header-search">
        {(viewsApi.enabled || title || description || headerRightRender) && (
          <AhFilterHeaderBar title={title} description={description} rightRender={headerRightRender}>
            {viewsApi.enabled && (
              <AhFilterViewBar
                views={viewsApi.views}
                activeId={viewsApi.activeId}
                defaultViewName={(filterViews || undefined)?.defaultViewName}
                dirty={filtersDirty}
                showClear={showReset}
                onCreate={handleCreateView}
                onUpdate={handleUpdateView}
                onRename={(id, name) => {
                  const target = viewsApi.views.find((view) => view.id === id);
                  if (target) {
                    viewsApi.save({ ...target, name });
                  }
                }}
                onDelete={viewsApi.remove}
                onSelect={handleSelectView}
                onClear={() => handleReset(viewsApi.activeView?.params)}
              />
            )}
          </AhFilterHeaderBar>
        )}
        <div className="ah-filter-row">
          <div className="ah-filter-row-left">
            {hasFilterFields && (
              <>
                <AhFilterConditionPopover
                  fields={filterFields!}
                  conditions={conditions}
                  values={conditionValues}
                  onChange={handleConditionChange}
                  onConditionsChange={setConditions}
                />
                <AhFilterChips
                  fields={filterFields!}
                  conditions={conditions}
                  values={conditionValues}
                  onChange={handleConditionChange}
                />
              </>
            )}
            {showLightFilter && renderLightFilter(hasFilterFields ? [] : timeFields)}
          </div>
          <div className="ah-filter-row-right">
            {keywordNode}
            {sortFields && (
              <AhSortConditionPopover
                fields={sortFields}
                value={conditionValues.sort as Record<string, boolean> | undefined}
                onChange={(next) => handleConditionChange({ sort: next })}
              />
            )}
            {searchMode === 'submit' && (
              <Button type="primary" onClick={doSubmitQuery}>
                查询
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSearchDiv = () => {
    if (useNewLayout && !searchRender) {
      return <div style={searchLayoutStyle}>{renderNewSearch()}</div>;
    }
    const searchFormComponent = searchRender ? (
      searchRender(updateParams)
    ) : (
      <SearchContent
        className={searchLayout === 'div' ? 'ah-page-header-search' : ''}
        searchForm={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {keywordNode}
            {renderLightFilter(timeFields)}
            {searchMode === 'submit' && (
              <Button type="primary" onClick={doSubmitQuery}>
                查询
              </Button>
            )}
            {showReset && (
              <Button
                size="small"
                type="text"
                disabled={!filtersDirty && searchMode !== 'submit'}
                onClick={() => handleReset()}
              >
                重置
              </Button>
            )}
          </div>
        }
        showExpand={searchCollapsible ?? searchLayout === 'div'}
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
  };

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
          onParamsChange={handleInternalParamsChange}
          request={async (v: F = params, sort?: Record<string, SortOrder>) => {
            // 列头排序与筛选排序（timeSort）合并：列排序优先，内置排序其余键保留
            const baseSort = (v as Record<string, unknown>).sort;
            v = handleReqListParams(v, sort);
            if (
              sort &&
              Object.keys(sort).length > 0 &&
              baseSort &&
              typeof baseSort === 'object'
            ) {
              const columnSort = (v as Record<string, unknown>).sort;
              (v as Record<string, unknown>).sort = {
                ...(baseSort as Record<string, unknown>),
                ...(typeof columnSort === 'object' && columnSort !== null
                  ? (columnSort as Record<string, unknown>)
                  : {})
              };
            }
            // 空值归一：undefined/null/''/空数组不再发给后端
            const effectiveParams = pickEffectiveParams(
              v as Record<string, unknown>
            ) as unknown as F;
            try {
              const res = await request(effectiveParams);
              lastSuccessRef.current = res;
              hadErrorRef.current = false;
              return {
                ...res,
                data: res.records,
                page: res.current,
                success: true
              };
            } catch (error) {
              hadErrorRef.current = true;
              if (onErrorRef.current) {
                onErrorRef.current(error);
              } else {
                message.error({ content: '加载失败，请重试', key: 'ah-page-request-error' });
              }
              // 失败保留旧数据（无缓存则空页），表格不清空、分页不丢
              const fallback: ITablePage<T> =
                lastSuccessRef.current ?? {
                  records: [],
                  list: [],
                  total: 0,
                  size: 0,
                  current: 1,
                  pages: 0
                };
              return {
                ...fallback,
                data: fallback.records,
                page: fallback.current,
                success: true
              };
            }
          }}
          rowKey={rowKey as any}
          // 勿默认 max-content：会把表格按内容撑开，且在有 fixed 列时强制 table-layout:auto，导致省略失效。
          scroll={{
            y: '100%',
            ...(resolvedScrollX !== undefined && resolvedScrollX !== null
              ? { x: resolvedScrollX }
              : {})
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
