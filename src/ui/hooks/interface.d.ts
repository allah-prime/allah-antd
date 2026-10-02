import type { ITablePage } from '../../theling-utils/@types/IZlData';
import type Fetch from 'ahooks/lib/useRequest/src/Fetch';
import type { SortOrder } from 'antd/es/table/interface';
import type React from 'react';
import type { RequestData } from '@ant-design/pro-components';
import type { ActionType, ProFormInstance } from '@ant-design/pro-components';
import type { IAsyncTaskScheduleVo } from '../../theling-utils/@types/IAsyncTaskScheduleVo';
import type { FileUpload2Fun } from '../../theling-utils';

export type IUseCustomFormItemProps<T> = {
  value?: string[];
  /**
   * 调用这个接口，获取已选择好的标签
   */
  defValReq?: (v: string[]) => Promise<T[]>;
  /**
   * 当值发生变化时，调用这个方法，将值赋值给表单
   */
  onSetValues?: (v: T[]) => void;
  /**
   * 值所在的key
   */
  valueKey?: string;
  /**
   * loading状态
   */
  setLoading?: (v: boolean) => void;
};

export interface IUseFileDownOptions {
  /**
   * 下载的文件名
   */
  fileName: string;
  /**
   * 请求完成的回调方法
   */
  onCompleted?: () => void;
  /**
   * 请求失败的回调方法
   * @param error
   */
  onError?: (error: Error) => void;
}

export interface IFileDownReturn {
  /**
   * 下载
   */
  download: () => void;
  /**
   * 取消
   */
  cancel: () => void;
  /**
   * 下载进度百分比
   */
  progress: number;
  /**
   * 是否下载中
   */
  isDownloading: boolean;
}

export type IUseItemDetailsProps<T> = {
  /**
   * 打开弹窗
   * @param item 打开的数据
   * @param v 显示和隐藏的控制
   */
  openModal: (item: T, v: boolean) => void;
  /**
   * 当前是否显示弹窗
   */
  visible: boolean;
  /**
   * 当前选中的数据 - 就是openModal的item
   */
  selectItem: T;
  /**
   * 是否是详情
   */
  isDetail: boolean;
  /**
   * 设置弹窗的显示和隐藏
   */
  setModalChange: (flag: boolean) => void;
  /**
   * 新增弹窗；设置弹窗显示，设置选中的数据为空，设置isDetail为false
   */
  addModal: () => void;
  /**
   * 设置isDetail
   */
  setIsDetail: (v: boolean) => void;
  /**
   * 设置选中的数据
   */
  setSelectItem: (v: T) => void;
  /**
   * 详情弹窗是否显示
   */
  detailVisible: boolean;
  /**
   * 设置详情弹窗的显示和隐藏
   */
  setDetailVisible: (v: boolean) => void;
};
export type IUseItemDetailsModalReqProps<T> = {
  req: (p: any) => Promise<T>;

  /**
   * 主键
   */
  id?: any;
};
export type IItemListReqProps<T, F> = {
  params: F;
  listReq: (p: F) => Promise<ITablePage<T>>;
  /**
   * 刷新的标识
   */
  refCallBack?: boolean;
  /**
   * 设置刷新的标识
   */
  setRefCallBack?: (f: boolean) => void;
  /**
   * 额外的关键词，比如全局搜索的
   */
  keyword?: string;
  /**
   * 获取数据后的回调
   */
  onSuccess?: (data: ITablePage<T>) => void;
};
export type IItemListReqReturnProps<T, F> = {
  data: ITablePage<T>;
  /**
   * 加载中
   */
  loading: boolean;
  /**
   * 再次执行
   */
  run: Fetch<T, F[]>['run'];
  /**
   * 刷新的回调
   * @param v
   */
  setRefCallBack: (v: boolean) => void;
  /**
   * 立即变更数据
   * @param v 数据
   * @param index 索引
   * @param action 操作 delete 删除，update 更新
   */
  mutateCallBack: (v: T, index: number, action?: 'de' | 'up') => void;
  /**
   * 重置数据
   */
  resetData: () => void;
};

/**
 * 用于进行资源列表管理的hooks。可以查看theling-jyfw项目中的具体使用
 */
export interface IUseItemListSelectProps<T, K> {
  /**
   * 初始化方法，调用接口得到要渲染的数据
   */
  initFunc?: () => Promise<T[]>;
  /**
   * 依赖id
   */
  refreshId?: K;
  /**
   * 根据数据的主键id进行删除关联关系
   * @param itemId
   */
  removeMap?: (itemId: K) => Promise<void>;
  /**
   * 新增关联关系
   * @param itemId 主键
   */
  addMap?: (itemId: K) => Promise<void>;
  /**
   * 数据变化的回调
   * @param v
   */
  onChange?: (v: K[]) => void;
  /**
   * 值所在的key
   */
  valueKey: string;
  /**
   * 模式，单选还是多选
   */
  mode?: 'single' | 'multiple';
}

export interface IUseAhPageConfigProps<T> {
  /**
   * 默认的参数
   */
  defValue?: T;
  /**
   * 需要减去的高度
   */
  subHeight?: number;
  /**
   * 容器高度 - 默认屏幕高度
   */
  containerHeight?: number;
  /**
   * 列表滚动区的高度
   */
  enterAltitude?: number | string;
}

export type IUseItemTableProps<T, F> = {
  request: (p: F) => Promise<ITablePage<T>>;
  /**
   * 是否自动请求
   */
  autoRequest?: boolean;
  /**
   * 防抖时间
   */
  debounceTime?: number;
} & IUseAhPageConfigProps<F>;

export type IReturnProps<T, F> = IUseAhPageConfigProps<F> & {
  /**
   * 参数
   */
  params: F;
  /**
   * 更新参数
   * @param v
   */
  setParams: (v: F) => void;
  /**
   * 请求
   * @param params 参数
   * @param sort 排序
   * @param filter 过滤
   */
  tableReq: (
    params: any,
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[] | null>
  ) => Promise<Partial<RequestData<T>>>;
  /**
   * 当前表格的ref
   */
  actionRef: React.MutableRefObject<ActionType | undefined>;
  /**
   * 搜索的ref
   */
  searchRef: React.MutableRefObject<any>;
  /**
   * 滚动高度
   */
  scrollY: number | string;
  /**
   * 刷新
   */
  refresh: ((resetPageIndex?: boolean | undefined) => Promise<void>) | undefined;
  asyncRefresh: ((resetPageIndex?: boolean | undefined) => void) | undefined;
  /**
   * 更新参数
   */
  updateParams: (v: F) => void;
  /**
   * 获取到的数据
   */
  data: ITablePage<T>;
};

export type IUseScheduleRequestReq = {
  /**
   * 进度信息
   */
  pollingProgress: IAsyncTaskScheduleVo;
  /**
   * 更新进度信息
   */
  setPollingProgress: (v: IAsyncTaskScheduleVo) => void;
  /**
   * 导入的loading
   */
  importLoading: boolean;
  /**
   * 是否进行中
   */
  running: boolean;
  /**
   * 禁用导入按钮
   */
  importDisabled: boolean;
  /**
   * 设置导入按钮的禁用
   */
  setImportDisabled: (v: boolean) => void;
  /**
   * 设置导入按钮的loading
   */
  setImportLoading: (v: boolean) => void;
  /**
   * 轮询的请求hooks
   */
  scheduleRequest: any;
  /**
   * 批次
   */
  batch: string;
  /**
   * 设置批次
   */
  setBatch: (v: string) => void;
  /**
   * 重置
   */
  reset: () => void;
  /**
   * 启动 任务 - 如果指定了key，会使用指定的key，否则会尝试调用接口获取key
   * @param key 缓存的key
   */
  start: (key?: string) => void;
  /**
   * 重启任务
   */
  restart: () => void;
  /**
   * 取消任务
   */
  cancel: () => void;
  /**
   * 直接获取进度，不去调用业务接口
   */
  getProgress: (key?: string) => void;
};

export type IUseUpdateStatue = {
  /**
   * 检测更新的方法 - 如果有返回值，说明就有更新了
   */
  checkUpdate: () => Promise<string | null>;
  /**
   * 自定义的回调
   */
  onCheckUpdate?: (data: any) => void;
  /**
   * 自动检测的时间段示例：[8, 17]
   */
  autoCheckTime?: [number, number];
};

export interface IUseAhModalFormProps<T> {
  /**
   * 默认的宽度
   */
  defWidth?: number;
  /**
   * 宽度的选项
   */
  defWidthOpt?: [number, number];
  /**
   * 主键
   */
  id?: string;
  /**
   * 详情的数据获取
   */
  infoRequest: (v: string) => Promise<T>;
  /**
   * 额外的请求函数对象，用于加载次要数据
   * key为字段名，value为请求函数
   */
  extraRequests?: Record<string, (v: string) => Promise<any>>;
  /**
   * 获取详情的回调
   */
  onSuccess?: (v: T) => void;
  /**
   * 表单点击提交的回调
   */
  onSubmit?: (v: T) => Promise<void>;
}

export interface IUseAhModalFormReturn<T> {
  /**
   * 表格的宽度
   */
  width: number;
  /**
   * 加载数据的loading
   */
  loading: boolean;
  /**
   * 设置加载数据的loading
   */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * 额外请求的加载状态映射
   */
  extraLoadingMap: Record<string, boolean>;
  /**
   * 手动加载特定的额外数据
   */
  loadExtraData: (key: string) => void;
  /**
   * 额外请求对象映射
   */
  extraReqMap: Record<string, any>;
  /**
   * 表单的ref
   */
  formRef: React.MutableRefObject<ProFormInstance<any> | undefined>;
  /**
   * 上传的ref
   */
  uploadRef: React.MutableRefObject<FileUpload2Fun>;
  /**
   * 关联列表的数据
   */
  relListObj: Record<string, string[]>;
  /**
   * 设置关联列表的数据
   */
  setRelListObj: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  /**
   * 提交表单
   */
  submit: () => Promise<void>;
  /**
   * 获取详情的请求
   */
  infoReq: import('ahooks/lib/useRequest/src/types').Result<T, [v: string]>;
  /**
   * 是否显示
   */
  visible: boolean;
  /**
   * 设置是否显示
   */
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * 重置数据
   */
  resetData: () => void;
  /**
   * 表单的数据
   */
  data: T;
  /**
   * 更新数据
   */
  updateData: (v: T) => void;
}
