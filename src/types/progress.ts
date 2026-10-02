/**
 * 上传/下载进度信息
 */
export interface IProgressInfo {
  /** 已上传/下载的字节数，单位 B（字节） */
  loaded: number;
  /** 要上传/下载的文件的大小，单位 B（字节） */
  total: number;
  /** 速度，单位 B/s */
  speed?: number;
  /** 进度百分比，范围是 0-1，保留两位小数 */
  percent: number;
}
