/**
 * @author tangbin
 * @date 2018年10月25日21:24:27
 * @descriptions: 网络相关工具
 */

import { IResponse, imageUtils } from '@allahjs/utils';
import type { IRequestOption } from '@allahjs/utils';
import { Modal, notification } from 'antd';

/**
 * 获取文件的上下文
 * @param suffix 后缀名
 * @return {string}
 */
export const fileMIME = (suffix: string) => {
  switch (suffix) {
    case 'txt':
      return 'text/plain';
    case 'doc':
      return 'application/msword';
    case 'pdf':
      return 'application/pdf';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
    case 'tar':
      return 'application/x-tar';
    case 'zip':
      return 'application/zip';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/x-wav';
    case 'bmp':
      return 'image/bmp';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'jpeg':
      return 'image/jpeg';
    case 'jpg':
      return 'image/jpeg';
    case 'css':
      return 'text/css';
    case 'htm':
      return 'text/html';
    case 'html':
      return 'text/html';
    case 'js':
      return 'application/x-javascript';
    case 'log':
      return 'text/plain';
    case 'svg':
      return 'image/svg+xml';
    case 'flv':
      return 'application/octet-stream';
    case 'f4v':
      return 'application/octet-stream';
    case 'mp4':
      return 'video/mp4';
    case 'ogv':
      return 'video/ogg';
    case 'webm':
      return 'video/webm';
    case 'svf':
      return 'image/vnd';
    case 'tad':
      return 'application/octet-stream';
    case 'jsom':
      return 'application/json';
    case 'xla':
      return 'application/vnd.ms-excel';
    case 'xlc':
      return 'application/vnd.ms-excel';
    case 'xlm':
      return 'application/vnd.ms-excel';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlt':
      return 'application/vnd.ms-excel';
    case 'xlw':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.ms-excel';
    default:
      return '';
  }
};
/**
 * 文件下载
 * @param { function } downloadFile 下载文件的方法
 * @param { string } fileid 文件的id
 * @param { string } name 文件的名称
 * @param { string } suffix 文件的后缀名
 * @param { string }alias 别名
 */
export const downloadFileUtil = (
  downloadFile: any,
  fileid: string,
  name: string,
  suffix: string,
  alias?: string
) => {
  // 获取文件的名字
  const getName = alias ? `${name}_${alias}` : name;
  // 获得mime配置
  const mime = fileMIME(suffix);
  downloadFile({ fileid }).then((res: BlobPart) => {
    // 这里res.data是返回的blob对象
    // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
    const blob = new Blob([res], { type: `${mime};charset=utf-8` });
    const downloadElement = document.createElement('a');
    // 创建下载的链接
    const href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    // 下载后文件名
    downloadElement.download = getName;
    document.body.appendChild(downloadElement);
    // 点击下载
    downloadElement.click();
    // 下载完成移除元素
    document.body.removeChild(downloadElement);
    // 释放掉blob对象
    window.URL.revokeObjectURL(href);
  });
};

/**
 * 打开URL进行文件下载
 * @param url 指定的url
 */
export const openUrlDown = (url: string) => {
  const downloadUrl = `${
    url + (url.indexOf('?') > -1 ? '&' : '?')
  }response-content-disposition=attachment`; // 补充强制下载的参数
  // 这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
  window.open(downloadUrl);
};

/**
 * @param fileName 文件名
 * @param url 文件地址地址
 */
export const downloadImage = (url: string, fileName: string) => {
  const downloadElement = document.createElement('a');
  // 创建下载的链接
  // cos文档提供的 根据getPublicUrl获取的url下载文件
  let downloadUrl = '';
  // 补充强制下载的参数
  if (url.indexOf('?') > -1) {
    downloadUrl = `${url}&response-content-disposition=attachment`;
  } else {
    downloadUrl = `${url}?a=1&response-content-disposition=attachment`;
  }
  downloadElement.href = downloadUrl;
  // 下载后文件名
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * 转换成用于进行文件上传的对象数组
 * @param objList 需要转换的对象
 * @param type 文件的类型
 */
export const buildUploadObj = (objList: any[], type: any) =>
  objList.map(item => {
    return {
      type,
      fileid: item.fileid
    };
  });

/**
 * 说明：下载文件
 * @author tangbin
 * @date 2019/2/18
 * @time 16:48
 * @param fileObj 文件的二进制对象
 * @param fileName 文件的名字
 * @param fileType 文件的类型
 */
export const downFile = (fileObj: any, fileName: string, fileType: string) => {
  const mime = fileMIME(fileType);
  const blob = new Blob([fileObj], { type: `${mime};charset=utf-8` });
  const downloadElement = document.createElement('a');
  // 创建下载的链接
  const href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  // 下载后文件名
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(href);
};

export const urlToBlob = (url: string): Promise<Blob> => {
  return new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject(new Error('urlToBlob failed'));
    };
    xhr.send();
  });
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const downloadElement = document.createElement('a');
  downloadElement.href = window.URL.createObjectURL(blob);
  downloadElement.download = fileName;
  downloadElement.style.display = 'none';
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(downloadElement.href);
};

export const downloadUrl = async (url: string, newFileName: string) => {
  const blob = await urlToBlob(url);
  downloadBlob(blob, newFileName);
};

/**
 * 接口请求的异常处理程序
 */
export const ahReqErrorHandler = (result: IResponse, opt: IRequestOption): IResponse => {
  const errorText = result.statusText || result.msg;
  const { status } = result;
  const { url = '' } = opt;
  if (status === 401) {
    notification.error({
      title: `请求错误 ${status}: ${url!.split('/').pop()}`,
      description: '登录过期或无权限访问（请重新登录）',
      key: 'ah-request-notification'
    });
  } else if (status === 402) {
    Modal.warn({
      content: result.msg,
      okText: '关闭',
      onOk: () => {
        if (!window.location.href.includes('user/login')) {
          // dvaApp._store.dispatch({
          //   type: 'login/logout',
          // });
        }
      }
    });
  } else if (opt.autoCatch) {
    notification.error({
      title: `请求错误 ${status}: ${url!.split('/').pop()}`,
      description: errorText,
      key: 'ah-request-notification'
    });
  }
  return result;
};

const AhNetWork = {
  downFile,
  buildUploadObj,
  downloadFileUtil,
  fileMIME,
  openUrlDown,
  downloadUrl,
  downloadBlob,
  urlToBlob,
  ahReqErrorHandler
};

export default AhNetWork;
