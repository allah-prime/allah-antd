import type { IFileObjVoBase } from '../theling-utils/@types/IBase';
import type { IProgressInfo } from './progress';

export type TWeChatMediaSourceType = 'album' | 'camera';

export interface IWeChatSdkConfig {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
  jsApiList?: string[];
  openTagList?: string[];
  debug?: boolean;
}

export interface IWeChatChooseVideoResult {
  localId: string;
  duration?: number;
  size?: number;
  height?: number;
  width?: number;
  fileName?: string;
  preview?: string;
}

export interface IWeChatResolvedMediaFile {
  file?: File;
  preview?: string;
  fileName?: string;
  size?: number;
  duration?: number;
  type?: string;
  suffix?: string;
  localId?: string;
}

export interface IWeChatUploadConfig {
  enabled?: boolean;
  sdkUrl?: string;
  preferPreviewImage?: boolean;
  autoFallbackToInput?: boolean;
  jsApiList?: string[];
  imageSourceType?: TWeChatMediaSourceType[];
  videoSourceType?: TWeChatMediaSourceType[];
  getConfig?: (currentUrl: string) => Promise<IWeChatSdkConfig>;
  resolveVideoFile?: (
    video: IWeChatChooseVideoResult
  ) => Promise<IWeChatResolvedMediaFile | null | undefined>;
}

/**
 * 文件上传配置接口
 */
export interface TFileUpload2Config {
  /**
   * 获取文件的keys
   */
  fileKeyRequest?: (files: IFileObjVoBase[]) => Promise<IFileObjVoBase[]>;
  /**
   * 本地上传文件对象
   */
  uploadLocalRequest?: (
    fileData: IFileObjVoBase & {
      formData: FormData;
    },
    onProgress?: (v: IProgressInfo) => void
  ) => Promise<string>;
  /**
   * 上传文件对象
   */
  uploadRequest?: (
    file: IFileObjVoBase,
    onProgress?: (v: IProgressInfo) => void
  ) => Promise<string>;
  /**
   * 获取文件的返回地址接口
   */
  generateSignUrlReq?: (file: IFileObjVoBase) => Promise<string>;
  /**
   * 根据cos的key获取文件访问链接
   * @param cosKey 文件的cosKey
   */
  getSigUrlByKey?: (cosKey: string) => Promise<string>;
  /**
   * 根据cos的key获取文件访问链接
   * @param fileId 文件的fileId
   */
  getSignUrlByFileId?: (fileId: string) => Promise<string>;
  /**
   * 文件上传接口
   */
  uploadFile?: (
    key: string,
    file: any,
    bucket?: string,
    onProgress?: (v: IProgressInfo) => void
  ) => Promise<string>;
  /**
   * 获取页面信息的接口
   */
  webPageInfoReq?: (url: string) => Promise<any>;
  /**
   * 文件用途
   */
  usage?: string | any;
  /**
   * 查询关联的文件
   */
  getFileByRelId?: (params: { relId: string; busiScene: string }) => Promise<IFileObjVoBase[]>;
  /**
   * 微信浏览器内的上传增强配置
   */
  wechatUpload?: IWeChatUploadConfig;
}
