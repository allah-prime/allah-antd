/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TFileUpload2Config } from '../../types';
import { IFormColumns } from '../../theling-utils';
import { IBaseFilter, IOptions7, ITablePage } from '../../theling-utils/@types/IZlData';
import { Toast } from 'antd-mobile';
import { AH_MOBILE_VERSION } from './packageVersion';

/**
 * 通用的请求
 */
type ICommRequestConfig = {
  // 获取表单组信息
  formGroupReq?: (formId?: string) => Promise<IFormColumns<any>[]>;
  /**
   * 根据key获取字典数组
   * @param groupKey 字典键
   * @param valueType 值的类型，传入后会对数据进行强制转换的
   */
  opt7ListByKey?: (
    groupKey: string,
    valueType?: 'string' | 'number' | 'bool'
  ) => Promise<IOptions7<any, any, any>[]>;
  /**
   * 标签接口
   */
  tagReq?: (params: IBaseFilter) => Promise<ITablePage<IOptions7<string>>>;
  /**
   * 新增标签
   */
  tagAddReq?: (name: string, color?: string) => Promise<IOptions7<string>>;
};

declare global {
  //设置全局属性
  interface Window {
    AhFormConfig: AhMobileConfig;
  }
}

const defWinCacheKey = 'AhFormConfig';

export interface IAhMobileDebugConfig {
  enabled?: boolean;
  toast?: boolean;
  console?: boolean;
  prefix?: string;
  duration?: number;
}

export interface IAhMobileConfigProps {
  commReq?: ICommRequestConfig;
  uploadConfig?: TFileUpload2Config;
  winCacheKey?: string;
  debug?: boolean | IAhMobileDebugConfig;
}

const defaultDebugConfig: IAhMobileDebugConfig = {
  enabled: false,
  toast: true,
  console: true,
  prefix: '[AhMobile]',
  duration: 1200
};

const normalizeDebugConfig = (
  debug?: boolean | IAhMobileDebugConfig
): IAhMobileDebugConfig => {
  if (typeof debug === 'boolean') {
    return {
      ...defaultDebugConfig,
      enabled: debug
    };
  }

  return {
    ...defaultDebugConfig,
    ...debug,
    enabled: Boolean(debug?.enabled)
  };
};

/**
 * Form库配置管理类
 */
class AhMobileConfig {
  private static instance: AhMobileConfig;
  private static hasLoggedVersion = false;
  private static uploadConfig: TFileUpload2Config = {};
  private static winCacheKey: string = defWinCacheKey;
  private static debugConfig: IAhMobileDebugConfig = defaultDebugConfig;

  private static commReq: ICommRequestConfig;

  private constructor({ commReq, uploadConfig, winCacheKey, debug }: IAhMobileConfigProps) {
    // 如果window存在，并且window下有缓存，就取window下的缓存
    if (typeof window !== 'undefined') {
      const cache = (window as any)[AhMobileConfig.winCacheKey];
      if (cache) {
        return cache;
      }
    }
    AhMobileConfig.commReq = commReq || {};
    AhMobileConfig.uploadConfig = { ...AhMobileConfig.uploadConfig, ...uploadConfig };
    AhMobileConfig.debugConfig = normalizeDebugConfig(debug);
    AhMobileConfig.winCacheKey = winCacheKey || defWinCacheKey;
    AhMobileConfig.instance = this;
    AhMobileConfig.printVersion();
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window[AhMobileConfig.winCacheKey] = this;
    }
  }

  /**
   * 初始化配置
   */
  static init(props: IAhMobileConfigProps) {
    return new AhMobileConfig(props);
  }

  public static getVersion(): string {
    return AH_MOBILE_VERSION;
  }

  public static printVersion(): void {
    if (AhMobileConfig.hasLoggedVersion) {
      return;
    }

    AhMobileConfig.hasLoggedVersion = true;
    console.info(`[AhMobile] version ${AH_MOBILE_VERSION}`);
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): AhMobileConfig {
    AhMobileConfig.getWinCacheKey();
    if (!AhMobileConfig.instance) {
      AhMobileConfig.instance = new AhMobileConfig({});
    }
    return AhMobileConfig.instance;
  }

  /**
   * 获取上传配置 - 静态方法
   */
  public static getUploadConfig(): TFileUpload2Config {
    AhMobileConfig.getWinCacheKey();
    // @ts-ignore
    if (typeof window !== 'undefined' && window[AhMobileConfig.winCacheKey]) {
      // @ts-ignore
      return window[AhMobileConfig.winCacheKey].getUploadConfig() || {};
    }
    return AhMobileConfig.uploadConfig || {};
  }

  /**
   * 设置上传配置 - 静态方法
   */
  public static setUploadConfig(config: TFileUpload2Config): void {
    AhMobileConfig.uploadConfig = { ...AhMobileConfig.uploadConfig, ...config };
    // 如果已经有实例，也更新实例中的配置
    if (typeof window !== 'undefined') {
      const instance = (window as any)[AhMobileConfig.winCacheKey];
      if (instance && instance.setUploadConfig) {
        instance.setUploadConfig(config);
      }
    }
  }

  /**
   * 获取Window缓存Key
   */
  public static getWinCacheKey(): string {
    if (!AhMobileConfig.winCacheKey) {
      AhMobileConfig.winCacheKey = defWinCacheKey;
    }
    return AhMobileConfig.winCacheKey;
  }

  /**
   * 设置Window缓存Key
   */
  public static setWinCacheKey(key: string): void {
    AhMobileConfig.winCacheKey = key;
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window[key] = AhMobileConfig.instance;
    }
  }

  /**
   * 设置上传配置 - 实例方法
   */
  public setUploadConfig(config: TFileUpload2Config): void {
    AhMobileConfig.uploadConfig = { ...AhMobileConfig.uploadConfig, ...config };
  }

  /**
   * 设置 debug 配置
   */
  public static setDebugConfig(debug?: boolean | IAhMobileDebugConfig): void {
    AhMobileConfig.debugConfig = normalizeDebugConfig(debug);
  }

  /**
   * 获取 debug 配置
   */
  public static getDebugConfig(): IAhMobileDebugConfig {
    AhMobileConfig.getWinCacheKey();
    if (typeof window !== 'undefined') {
      const instance = (window as any)[AhMobileConfig.winCacheKey];
      if (instance && instance.getDebugConfig) {
        return instance.getDebugConfig() || defaultDebugConfig;
      }
    }
    return AhMobileConfig.debugConfig;
  }

  /**
   * 是否启用 debug
   */
  public static isDebugEnabled(): boolean {
    return Boolean(AhMobileConfig.getDebugConfig().enabled);
  }

  /**
   * 输出 debug 日志
   */
  public static debugLog(message: string, extra?: unknown): void {
    const debugConfig = AhMobileConfig.getDebugConfig();
    if (!debugConfig.enabled || !debugConfig.console) {
      return;
    }

    const prefix = debugConfig.prefix || defaultDebugConfig.prefix;
    if (typeof extra !== 'undefined') {
      console.log(`${prefix} ${message}`, extra);
      return;
    }

    console.log(`${prefix} ${message}`);
  }

  /**
   * 输出 debug 提示
   */
  public static debugToast(message: string): void {
    const debugConfig = AhMobileConfig.getDebugConfig();
    if (!debugConfig.enabled || !debugConfig.toast) {
      return;
    }

    Toast.show({
      content: message,
      duration: debugConfig.duration || defaultDebugConfig.duration
    });
  }

  public setDebugConfig(debug?: boolean | IAhMobileDebugConfig): void {
    AhMobileConfig.debugConfig = normalizeDebugConfig(debug);
  }

  public getDebugConfig(): IAhMobileDebugConfig {
    return AhMobileConfig.debugConfig;
  }

  /**
   * 获取上传配置 - 实例方法
   */
  public getUploadConfig(): TFileUpload2Config {
    return AhMobileConfig.uploadConfig;
  }

  /**
   * 重置配置
   */
  public resetConfig(): void {
    AhMobileConfig.uploadConfig = {};
    AhMobileConfig.debugConfig = defaultDebugConfig;
  }

  // 获取commReq
  public static getCommReq(): ICommRequestConfig {
    return AhMobileConfig.commReq;
  }

  // 设置commReq
  public static setCommReq(config: ICommRequestConfig): void {
    AhMobileConfig.commReq = { ...AhMobileConfig.commReq, ...config };
  }
}

// 导出单例实例
export default AhMobileConfig;
export { AH_MOBILE_VERSION };
