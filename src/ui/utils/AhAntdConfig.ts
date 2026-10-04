import type { TFileUpload2Config } from '../../types';
import { fileUpload2Usage, IBaseFilter, IFormColumns, ITablePage } from '@allahjs/utils';
import type { IAsyncTaskScheduleVo } from '@allahjs/utils';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';
import type { IAreaTableModalProps } from '../AreaTable/AreaTableModal';
import type { IAreaTableProps } from '../AreaTable/interface';
import { ITagItem } from '../interface/tag';
import { AH_UI_VERSION } from './packageVersion';

/**
 * 通用的请求
 */
type ICommRequestConfig = {
  // 定时任务
  asyncTaskSchedule?: (key: string) => Promise<IAsyncTaskScheduleVo>;
  // 根据组件集合查询标签
  selectTagsByIds?: (keys: string[]) => Promise<ITagItem[]>;
  // 标签列表请求
  tagReq?: (params: IBaseFilter) => Promise<ITablePage<ITagItem>>;
  // 新增标签
  tagAddReq?: (keyword: string, color?: string) => Promise<ITagItem>;
  // 获取表单组信息
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formGroupReq?: (formId?: string) => Promise<IFormColumns<any>[]>;
};

type TAreaRequestConfig = {
  /**
   * 异步地区树
   */
  asyncTreeData?: IAreaTableProps['asyncTreeData'];
  /**
   * 获取表格数据
   */
  getTableData?: IAreaTableProps['selectTableData'];
  /**
   * 获取全部数据
   */
  selectAllData?: IAreaTableProps['selectAllData'];
  /**
   * 获取默认数据 - 传递一个分号隔开的地区字符串
   */
  selectDefList?: IAreaTableModalProps['selectDefList'];
  /**
   * 地区类型的配置
   */
  disTypeOptReq?: IAreaTableModalProps['disTypeOptReq'];
};

type IOtherConfig = {
  // 自定义图表的位置
  iconPath?: string[];
};

type TAhAntdConfig = {
  // 文件上传
  upload?: TFileUpload2Config;
  // 区域请求
  areaReq?: TAreaRequestConfig;
  // 通用的请求
  commReq?: ICommRequestConfig;
  // 其他配置
  other?: IOtherConfig;
  /**
   * 缓存在win下的别名
   */
  winCacheKey?: string;
  /**
   * 是否调试
   */
  isDebug?: boolean;
};

declare global {
  //设置全局属性
  interface Window {
    AhAntdConfig: AhAntdConfig;
  }
}

const defWinCacheKey = 'AhAntdConfig';

/**
 * 自有包的全局配置
 */
class AhAntdConfig {
  private static instance: AhAntdConfig;

  private static hasLoggedVersion = false;

  private static upload: TFileUpload2Config;

  private static areaReq: TAreaRequestConfig;

  private static commReq: ICommRequestConfig;

  private static other: IOtherConfig = {};

  private static winCacheKey: string;

  // 是否调试
  private static isDebug: boolean;

  // Antd实例
  private static messageInstance: MessageInstance;
  private static notificationInstance: NotificationInstance;
  private static modalInstance: Omit<ModalStaticFunctions, 'warn'>;

  constructor({
    upload = {
      usage: fileUpload2Usage.NORMAL
    },
    areaReq = {},
    commReq = {},
    other = {},
    winCacheKey = defWinCacheKey,
    isDebug = false
  }: TAhAntdConfig) {
    // 如果window存在，并且window下有缓存，就取window下的缓存
    if (window) {
      const cache = (window as any)[winCacheKey];
      if (cache) {
        return cache;
      }
    }
    if (!AhAntdConfig.instance) {
      AhAntdConfig.upload = upload;
      AhAntdConfig.areaReq = areaReq;
      AhAntdConfig.commReq = commReq;
      AhAntdConfig.isDebug = isDebug;
      AhAntdConfig.other = other;
      AhAntdConfig.instance = this;
      AhAntdConfig.winCacheKey = winCacheKey;
      AhAntdConfig.printVersion();
    }
    if (window) {
      // @ts-ignore
      window[winCacheKey] = AhAntdConfig;
    }
    return AhAntdConfig.instance;
  }

  static init(props: TAhAntdConfig) {
    return new AhAntdConfig(props);
  }

  static getVersion(): string {
    return AH_UI_VERSION;
  }

  static printVersion(): void {
    if (AhAntdConfig.hasLoggedVersion) {
      return;
    }

    AhAntdConfig.hasLoggedVersion = true;
    console.info(`[AhAntd] version ${AH_UI_VERSION}`);
  }

  static getInstance() {
    this.getWinCacheKey();
    if (!this.instance) {
      return (this.instance = new AhAntdConfig({}));
    }
    return this.instance;
  }

  static getUploadConfig(): TFileUpload2Config {
    this.getWinCacheKey();
    // @ts-ignore
    if (window && window[this.winCacheKey]) {
      // @ts-ignore
      return window[this.winCacheKey].upload || {};
    }
    return AhAntdConfig.upload || {};
  }

  static getAreaReq() {
    this.getWinCacheKey();
    // @ts-ignore
    if (window && window[this.winCacheKey]) {
      // @ts-ignore
      return window[this.winCacheKey].areaReq || {};
    }
    return AhAntdConfig.areaReq || {};
  }

  static getCommReq(): ICommRequestConfig {
    this.getWinCacheKey();
    // @ts-ignore
    if (window && window[this.winCacheKey]) {
      // @ts-ignore
      return window[this.winCacheKey].commReq || {};
    }
    return AhAntdConfig.commReq;
  }

  static getOtherConfig(): IOtherConfig {
    this.getWinCacheKey();
    // @ts-ignore
    if (window && window[this.winCacheKey]) {
      // @ts-ignore
      return window[this.winCacheKey].other || {};
    }
    return AhAntdConfig.other;
  }

  static getWinCacheKey(): string {
    if (!AhAntdConfig.winCacheKey) {
      AhAntdConfig.winCacheKey = defWinCacheKey;
    }
    return AhAntdConfig.winCacheKey;
  }

  static setWinCacheKey(key: string): void {
    AhAntdConfig.winCacheKey = key;
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window[key] = AhAntdConfig.instance;
    }
  }

  /**
   * 是否调试
   */
  static getIsDebug(): boolean {
    return AhAntdConfig.isDebug;
    if (typeof window !== 'undefined') {
      // @ts-ignore
      return window[AhAntdConfig.winCacheKey].isDebug;
    }
  }

  /**
   * 设置是否调试
   * @param isDebug - 是否调试
   */
  static setIsDebug(isDebug: boolean): void {
    AhAntdConfig.isDebug = isDebug;
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window[AhAntdConfig.winCacheKey].isDebug = isDebug;
    }
  }

  /**
   * 设置全局Message实例
   * @param messageInstance - Message实例
   */
  static setMessage(messageInstance: MessageInstance): void {
    AhAntdConfig.messageInstance = messageInstance;
  }

  /**
   * 获取全局Message实例
   * @returns Message实例
   */
  static getMessage(): MessageInstance {
    return AhAntdConfig.messageInstance;
  }

  /**
   * 设置全局Notification实例
   * @param notificationInstance - Notification实例
   */
  static setNotification(notificationInstance: NotificationInstance): void {
    AhAntdConfig.notificationInstance = notificationInstance;
  }

  /**
   * 获取全局Notification实例
   * @returns Notification实例
   */
  static getNotification(): NotificationInstance {
    return AhAntdConfig.notificationInstance;
  }

  /**
   * 设置全局Modal实例
   * @param modalInstance - Modal实例
   */
  static setModal(modalInstance: Omit<ModalStaticFunctions, 'warn'>) {
    AhAntdConfig.modalInstance = modalInstance;
  }

  /**
   * 获取全局Modal实例
   * @returns Modal实例
   */
  static getModal(): Omit<ModalStaticFunctions, 'warn'> {
    return AhAntdConfig.modalInstance;
  }

  /**
   * 显示消息
   * @param content - 消息内容
   */
  static message(content: string) {
    if (AhAntdConfig.messageInstance) {
      AhAntdConfig.messageInstance.info(content);
    } else {
      console.warn('Message实例未初始化，请先调用setMessage方法');
    }
  }

  /**
   * 显示通知
   * @param content - 通知内容
   */
  static notification(content: string) {
    if (AhAntdConfig.notificationInstance) {
      AhAntdConfig.notificationInstance.info({
        title: '通知',
        description: content
      });
    } else {
      console.warn('Notification实例未初始化，请先调用setNotification方法');
    }
  }

  /**
   * 显示确认对话框
   * @param content - 对话框内容
   */
  static modal(content: string) {
    if (AhAntdConfig.modalInstance) {
      AhAntdConfig.modalInstance.info({
        title: '提示',
        content: content
      });
    } else {
      console.warn('Modal实例未初始化，请先调用setModal方法');
    }
  }

  /**
   * 自定义日志输出
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static log(...args: any[]) {
    if (AhAntdConfig.getIsDebug()) {
      console.log(...args);
    }
  }
}

export default AhAntdConfig;

// 导出一个别名，短点的
export const ahLog = AhAntdConfig.log;
export { AH_UI_VERSION };
