import type {
    IWeChatChooseVideoResult,
    IWeChatResolvedMediaFile,
    IWeChatUploadConfig,
    TWeChatMediaSourceType
} from '../../types';
import AhMobileConfig from '../utils/AhMobileConfig';
import { dataUrlToFile, getFileSuffix, isWeChatEnv } from './utils';

type IWeChatSdkError = {
  errMsg?: string;
};

type IWeChatCheckJsApiResult = {
  checkResult?: Record<string, boolean>;
};

type IWeChatChooseImageResponse = {
  localIds?: string[];
};

type IWeChatGetLocalImgDataResponse = {
  localData?: string;
};

type IWeChatChooseVideoResponse = IWeChatChooseVideoResult;

type IWeChatJsSdk = {
  config: (config: Record<string, unknown>) => void;
  ready: (callback: () => void) => void;
  error: (callback: (error: IWeChatSdkError) => void) => void;
  chooseImage: (options: Record<string, unknown>) => void;
  getLocalImgData: (options: Record<string, unknown>) => void;
  chooseVideo: (options: Record<string, unknown>) => void;
  checkJsApi?: (options: Record<string, unknown>) => void;
  previewImage?: (options: Record<string, unknown>) => void;
};

const DEFAULT_SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
const DEFAULT_JS_API_LIST = [
  'checkJsApi',
  'chooseImage',
  'getLocalImgData',
  'previewImage',
  'chooseVideo'
];

let sdkScriptPromise: Promise<void> | null = null;
const readyPromiseCache = new Map<string, Promise<IWeChatJsSdk>>();

const getWxInstance = () => (window as Window & { wx?: IWeChatJsSdk }).wx;

const normalizeWeChatError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  }

  const message = typeof error === 'object' && error && 'errMsg' in error
    ? String((error as IWeChatSdkError).errMsg || '微信能力调用失败')
    : '微信能力调用失败';

  return new Error(message);
};

const normalizeCurrentUrl = () => window.location.href.split('#')[0];

const uniqueApiList = (apiList: string[]) => Array.from(new Set(apiList.filter(Boolean)));

const getReadyCacheKey = (url: string, signature: string, nonceStr: string, timestamp: number) =>
  [url, signature, nonceStr, timestamp].join('|');

const debugStatus = (message: string, extra?: unknown) => {
  AhMobileConfig.debugLog(message, extra);
  AhMobileConfig.debugToast(message);
};

const loadWeChatSdk = async (sdkUrl: string) => {
  if (typeof window === 'undefined') {
    throw new Error('当前环境不支持微信 JS-SDK');
  }

  if (getWxInstance()) {
    AhMobileConfig.debugLog('微信 SDK 已存在，跳过脚本加载');
    return;
  }

  if (!sdkScriptPromise) {
    debugStatus('开始加载微信 SDK');
    sdkScriptPromise = new Promise<void>((resolve, reject) => {
      const existedScript = document.querySelector(`script[src="${sdkUrl}"]`);
      if (existedScript && getWxInstance()) {
        debugStatus('检测到已加载的微信 SDK');
        resolve();
        return;
      }

      const script = existedScript || document.createElement('script');
      script.setAttribute('src', sdkUrl);
      script.setAttribute('async', 'true');

      script.addEventListener(
        'load',
        () => {
          debugStatus('微信 SDK 加载完成');
          resolve();
        },
        { once: true }
      );
      script.addEventListener(
        'error',
        () => {
          debugStatus('微信 SDK 加载失败');
          reject(new Error('微信 JS-SDK 加载失败'));
        },
        { once: true }
      );

      if (!existedScript) {
        document.head.appendChild(script);
      }
    }).catch(error => {
      sdkScriptPromise = null;
      throw error;
    });
  }

  return sdkScriptPromise;
};

const ensureWeChatReady = async (wechatUpload?: IWeChatUploadConfig) => {
  if (!wechatUpload?.enabled || !isWeChatEnv()) {
    return null;
  }

  if (!wechatUpload.getConfig) {
    throw new Error('未配置微信签名获取方法');
  }

  const sdkUrl = wechatUpload.sdkUrl || DEFAULT_SDK_URL;
  const currentUrl = normalizeCurrentUrl();
  debugStatus('开始获取微信签名配置', { currentUrl });
  const sdkConfig = await wechatUpload.getConfig(currentUrl);
  debugStatus('微信签名配置获取完成');
  const cacheKey = getReadyCacheKey(
    currentUrl,
    sdkConfig.signature,
    sdkConfig.nonceStr,
    sdkConfig.timestamp
  );

  if (readyPromiseCache.has(cacheKey)) {
    AhMobileConfig.debugLog('命中微信 SDK ready 缓存');
    return readyPromiseCache.get(cacheKey)!;
  }

  const readyPromise = (async () => {
    await loadWeChatSdk(sdkUrl);

    const wx = getWxInstance();
    if (!wx) {
      throw new Error('微信 JS-SDK 未就绪');
    }

    const jsApiList = uniqueApiList([
      ...DEFAULT_JS_API_LIST,
      ...(wechatUpload.jsApiList || []),
      ...(sdkConfig.jsApiList || [])
    ]);
    debugStatus('开始执行微信 SDK 配置', { jsApiList });

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const resolveOnce = () => {
        if (settled) {
          return;
        }
        settled = true;
        debugStatus('微信 SDK ready 成功');
        resolve();
      };
      const rejectOnce = (error: unknown) => {
        if (settled) {
          return;
        }
        settled = true;
        debugStatus('微信 SDK ready 失败', error);
        reject(normalizeWeChatError(error));
      };

      wx.ready(resolveOnce);
      wx.error(rejectOnce);
      wx.config({ ...sdkConfig, jsApiList });
    });

    return wx;
  })().catch(error => {
    readyPromiseCache.delete(cacheKey);
    throw error;
  });

  readyPromiseCache.set(cacheKey, readyPromise);
  return readyPromise;
};

const invokeWxMethod = <TResult>(
  invoke: (options: {
    success: (result: TResult) => void;
    fail: (error: unknown) => void;
    cancel: () => void;
  }) => void
) =>
  new Promise<TResult>((resolve, reject) => {
    invoke({
      success: resolve,
      fail: error => reject(normalizeWeChatError(error)),
      cancel: () => reject(new Error('用户取消了操作'))
    });
  });

export const canUseWeChatUpload = (wechatUpload?: IWeChatUploadConfig) =>
  Boolean(wechatUpload?.enabled && isWeChatEnv());

export const checkWeChatApiSupported = async (
  apiName: string,
  wechatUpload?: IWeChatUploadConfig
) => {
  const wx = await ensureWeChatReady(wechatUpload);
  if (!wx) {
    return false;
  }

  if (!wx.checkJsApi) {
    AhMobileConfig.debugLog(`当前微信 SDK 未提供 checkJsApi，默认认为支持 ${apiName}`);
    return true;
  }

  debugStatus(`开始检测微信 API: ${apiName}`);
  const result = await invokeWxMethod<IWeChatCheckJsApiResult>(options => {
    wx.checkJsApi?.({
      jsApiList: [apiName],
      ...options
    });
  });

  const supported = Boolean(result.checkResult?.[apiName]);
  debugStatus(`微信 API 检测结果 ${apiName}: ${supported ? '支持' : '不支持'}`);
  return supported;
};

const normalizeLocalImageData = (localData: string) => {
  if (localData.startsWith('data:image')) {
    return localData.replace('image/jgp', 'image/jpeg');
  }

  return `data:image/jpeg;base64,${localData}`;
};

const getImageFileName = (index: number) => `wx-image-${Date.now()}-${index + 1}.jpg`;

export const chooseWeChatImages = async (
  options: {
    count?: number;
    sourceType?: TWeChatMediaSourceType[];
  } = {},
  wechatUpload?: IWeChatUploadConfig
): Promise<IWeChatResolvedMediaFile[]> => {
  const wx = await ensureWeChatReady(wechatUpload);
  if (!wx) {
    throw new Error('当前不是可用的微信环境');
  }

  const supported = await checkWeChatApiSupported('chooseImage', wechatUpload);
  if (!supported) {
    throw new Error('当前微信环境不支持图片选择');
  }

  const chooseResult = await invokeWxMethod<IWeChatChooseImageResponse>(invokeOptions => {
    debugStatus('开始调用微信 chooseImage');
    wx.chooseImage({
      count: options.count || 1,
      sourceType: options.sourceType || wechatUpload?.imageSourceType || ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      ...invokeOptions
    });
  });

  const localIds = chooseResult.localIds || [];
  debugStatus(`微信 chooseImage 返回 ${localIds.length} 张图片`);
  const fileList = await Promise.all(
    localIds.map(async (localId, index) => {
      const imageDataResult = await invokeWxMethod<IWeChatGetLocalImgDataResponse>(invokeOptions => {
        wx.getLocalImgData({
          localId,
          ...invokeOptions
        });
      });
      const preview = normalizeLocalImageData(imageDataResult.localData || '');
      const fileName = getImageFileName(index);
      const file = dataUrlToFile(preview, fileName);

      return {
        file,
        preview,
        fileName,
        size: file.size,
        type: file.type,
        suffix: getFileSuffix(file.name),
        localId
      };
    })
  );

  return fileList;
};

export const chooseWeChatVideo = async (
  options: {
    sourceType?: TWeChatMediaSourceType[];
    maxDuration?: number;
    camera?: 'front' | 'back';
  } = {},
  wechatUpload?: IWeChatUploadConfig
): Promise<IWeChatResolvedMediaFile | null> => {
  const wx = await ensureWeChatReady(wechatUpload);
  if (!wx) {
    throw new Error('当前不是可用的微信环境');
  }

  const supported = await checkWeChatApiSupported('chooseVideo', wechatUpload);
  if (!supported) {
    throw new Error('当前微信环境不支持视频选择');
  }

  const chooseResult = await invokeWxMethod<IWeChatChooseVideoResponse>(invokeOptions => {
    debugStatus('开始调用微信 chooseVideo');
    wx.chooseVideo({
      sourceType: options.sourceType || wechatUpload?.videoSourceType || ['album', 'camera'],
      maxDuration: options.maxDuration || 60,
      camera: options.camera || 'back',
      ...invokeOptions
    });
  });

  const fileName = chooseResult.fileName || `wx-video-${Date.now()}.mp4`;
  debugStatus('微信 chooseVideo 返回成功', {
    fileName,
    duration: chooseResult.duration,
    size: chooseResult.size
  });
  const resolvedVideo = wechatUpload?.resolveVideoFile
    ? await wechatUpload.resolveVideoFile({ ...chooseResult, fileName })
    : null;

  if (resolvedVideo?.file) {
    debugStatus('微信视频已转换为可上传文件');
  } else {
    AhMobileConfig.debugLog('微信视频暂未转换为可上传文件，将由业务决定是否回退');
  }

  return {
    localId: chooseResult.localId,
    duration: resolvedVideo?.duration ?? chooseResult.duration,
    size: resolvedVideo?.size ?? chooseResult.size,
    preview: resolvedVideo?.preview ?? chooseResult.preview,
    fileName: resolvedVideo?.fileName || fileName,
    file: resolvedVideo?.file,
    type: resolvedVideo?.type || resolvedVideo?.file?.type || 'video/mp4',
    suffix: resolvedVideo?.suffix || getFileSuffix(resolvedVideo?.fileName || fileName) || 'mp4'
  };
};

export const previewWeChatImage = async (
  urls: string[],
  current?: string,
  wechatUpload?: IWeChatUploadConfig
) => {
  const wx = await ensureWeChatReady(wechatUpload);
  if (!wx?.previewImage) {
    AhMobileConfig.debugLog('当前微信 SDK 不支持 previewImage');
    return false;
  }

  const supported = await checkWeChatApiSupported('previewImage', wechatUpload);
  if (!supported) {
    return false;
  }

  wx.previewImage({
    urls,
    current: current || urls[0]
  });
  debugStatus('已调用微信图片预览');
  return true;
};