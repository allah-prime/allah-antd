export declare const docSuffix: string[];
export declare const pdfSuffix: string[];
export declare const exclSuffix: string[];
export declare const pptSuffix: string[];
export declare const fileMIMEObj: {
    [key: string]: string;
};
/**
 * 获取文件的上下文
 * @param suffix 后缀名
 * @return {string}
 */
export declare const fileMIME: (suffix: string) => string;
/**
 * 根据上下文获取文件的后缀名
 */
export declare const getFileSuffix: (mime: string) => string;
/**
 * 文件下载
 * @param { function } downloadFile 下载文件的方法
 * @param { string } fileid 文件的id
 * @param { string } name 文件的名称
 * @param { string } suffix 文件的后缀名
 * @param { string }alias 别名
 */
export declare const downloadFileUtil: (downloadFile: any, fileid: string, name: string, suffix: string, alias?: string) => void;
/**
 * 打开URL进行文件下载
 * @param url 指定的url
 */
export declare const openUrlDown: (url: string) => void;
/**
 * @param fileName 文件名
 * @param url 文件地址地址
 */
export declare const downloadImage: (url: string, fileName: string) => void;
/**
 * 转换成用于进行文件上传的对象数组
 * @param objList 需要转换的对象
 * @param type 文件的类型
 */
export declare const buildUploadObj: (objList: any[], type: any) => {
    type: any;
    fileid: any;
}[];
/**
 * 说明：下载文件
 * @author tangbin
 * @date 2019/2/18
 * @time 16:48
 * @param fileObj 文件的二进制对象
 * @param fileName 文件的名字
 * @param fileType 文件的类型
 */
export declare const downFile: (fileObj: any, fileName: string, fileType: string) => void;
/**
 * 说明：将url转换成blob对象
 * @param url
 * @param callback 进度回调
 */
export declare const urlToBlob: (url: string, callback?: (progress: number, loaded: number, total: number) => void) => Promise<Blob>;
export declare const downloadBlob: (blob: Blob, fileName: string) => void;
export declare const downloadUrl: (url: string, newFileName: string, callback?: (progress: number, loaded: number, total: number) => void) => Promise<void>;
declare const ZlNetWork: {
    downFile: (fileObj: any, fileName: string, fileType: string) => void;
    buildUploadObj: (objList: any[], type: any) => {
        type: any;
        fileid: any;
    }[];
    downloadFileUtil: (downloadFile: any, fileid: string, name: string, suffix: string, alias?: string) => void;
    fileMIME: (suffix: string) => string;
    openUrlDown: (url: string) => void;
    downloadUrl: (url: string, newFileName: string, callback?: (progress: number, loaded: number, total: number) => void) => Promise<void>;
    downloadBlob: (blob: Blob, fileName: string) => void;
    urlToBlob: (url: string, callback?: (progress: number, loaded: number, total: number) => void) => Promise<Blob>;
};
export default ZlNetWork;
type DownloadFileParams = {
    fileUrl: string;
    filename: string;
    onProgress?: (downloadProgress: number) => void;
};
/**
 * 文件下载
 * @param filename 文件名
 * @param fileUrl 文件地址地址
 * @param onProgress 下载进度回调
 */
export declare const xhrDownloadFile: ({ filename, fileUrl, onProgress }: DownloadFileParams) => {
    pause: () => void;
    resume: () => void;
    cancel: () => void;
};
/**
 * 文件下载
 * @param filename 文件名
 * @param fileUrl 文件地址地址
 * @param onProgress 下载进度回调
 */
export declare const fetchDownloadFile: ({ filename, fileUrl, onProgress }: DownloadFileParams) => {
    pause: () => void;
    resume: () => void;
    cancel: () => void;
};
/**
 * 初始化微信环境
 */
export declare const initZlDefWx: () => void;
export declare const checkIsSafari: () => boolean;
/**
 * 将数据导出为 CSV 文件
 * @param headers 表头
 * @param data 数据
 * @param filename 文件名
 */
export declare const exportToCSV: (headers: string[], data: any[], filename?: string) => void;
