import { useCallback, useRef, useState } from 'react';
import type { IFileDownReturn, IUseFileDownOptions } from './interface';

/**
 * 文件下载的hooks
 */
export default function useFileDown(url: string, options: IUseFileDownOptions): IFileDownReturn {
  const { fileName, onCompleted, onError } = options;
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const download = useCallback(() => {
    const xhr = (xhrRef.current = new XMLHttpRequest());
    xhr.open('GET', url); //默认异步请求
    xhr.responseType = 'blob';
    xhr.onprogress = e => {
      //判断资源长度是否可计算
      if (e.lengthComputable) {
        const percent = Math.floor((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        //请求资源完成，将文件内容转为blob
        const blob = new Blob([xhr.response], {
          type: 'application/octet-stream'
        });
        //通过a标签将资源下载
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = decodeURIComponent(fileName);
        link.click();
        window.URL.revokeObjectURL(link.href);
        onCompleted?.();
      } else {
        onError?.(new Error('下载失败'));
      }
      setIsDownloading(false);
    };
    xhr.onerror = () => {
      onError?.(new Error('下载失败'));
      setIsDownloading(false);
    };
    xhrRef.current.send(); //发送请求
    setProgress(0); //每次发送时将进度重置为0
    setIsDownloading(true);
  }, [fileName, onCompleted, onError, url]);

  const cancel = useCallback(() => {
    xhrRef.current?.abort(); //取消请求
    setIsDownloading(false);
  }, [xhrRef]);

  return {
    download,
    cancel,
    progress,
    isDownloading
  };
}
