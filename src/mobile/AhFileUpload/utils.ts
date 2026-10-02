import type { IFileObjVoBase } from '../../theling-utils/@types/IBase';

const VIDEO_SUFFIXES = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'm4v'];

/**
 * 获取视频时长
 */
export const getVideoDuration = (file: any) => {
  if (!file?.type?.startsWith('video/')) {
    return Promise.resolve(file?.videoDuration || 0);
  }

  if (typeof document === 'undefined' || !file.originFileObj) {
    return Promise.resolve(file?.videoDuration || 0);
  }

  if (typeof URL === 'undefined' || !URL.createObjectURL) {
    return Promise.resolve(file?.videoDuration || 0);
  }

  if (file.type?.startsWith('video/')) {
    return new Promise(resolve => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const fileURL = URL.createObjectURL(file.originFileObj);
      video.src = fileURL;
      video.addEventListener('loadedmetadata', () => {
        const duration = video.duration;
        resolve(Math.round(duration));
        URL.revokeObjectURL(fileURL);
      });
      video.addEventListener('error', () => {
        console.error('视频上传出错');
        resolve(0);
      });
    });
  }
  return Promise.resolve(0);
};

/**
 * 获取文件base64
 */
export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

/**
 * 判断是否微信环境
 */
export function isWeChatEnv() {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
}

export const getFileSuffix = (fileName: string) => fileName.split('.').pop()?.toLowerCase() || '';

export const isVideoFileName = (fileName: string) => VIDEO_SUFFIXES.includes(getFileSuffix(fileName));

export const acceptIncludesType = (accept: string | undefined, type: 'image' | 'video') => {
  if (!accept) {
    return false;
  }

  const normalizedList = accept
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);

  if (type === 'image') {
    return normalizedList.some(item => item.startsWith('image/') || item === '.jpg' || item === '.jpeg' || item === '.png' || item === '.gif' || item === '.bmp' || item === '.webp');
  }

  return normalizedList.some(item => item.startsWith('video/') || VIDEO_SUFFIXES.some(suffix => item === `.${suffix}`));
};

const dataUrlToBlob = (dataUrl: string) => {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0]?.match(/:(.*?);/);
  const mimeType = mimeMatch?.[1] || 'application/octet-stream';
  const binary = atob(parts[1] || '');
  const length = binary.length;
  const bytes = new Uint8Array(length);

  for (let index = 0; index < length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
};

export const dataUrlToFile = (dataUrl: string, fileName: string) => {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], fileName, { type: blob.type });
};

export const createUploadFileItem = async (
  file: File,
  options: {
    usage?: IFileObjVoBase['usage'];
    bucket?: string;
    permission?: IFileObjVoBase['permission'];
    preview?: string;
    uid?: string;
  } = {}
): Promise<IFileObjVoBase> => {
  const uid = options.uid || `${Date.now()}-${Math.random()}`;
  const preview = options.preview ?? (file.type.startsWith('image/') ? await getBase64(file) : '');

  return {
    uid,
    name: file.name,
    fileName: file.name,
    size: file.size,
    fileSize: file.size,
    suffix: getFileSuffix(file.name),
    type: file.type,
    originFileObj: file,
    preview,
    status: 'done',
    percent: 0,
    oldFile: false,
    fileId: '',
    zlFileId: '',
    usage: options.usage,
    cosKey: '',
    bucket: options.bucket || '',
    permission: options.permission || 0,
    cosWaterKey: '',
    previewUrl: ''
  };
};
