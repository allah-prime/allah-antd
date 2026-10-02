import { IOptions2, ITablePage } from '../@types/IZlData';
/**
 * 当前页是否是最后一页
 * @param data
 */
export declare const isLastPageData: (data: ITablePage<any>) => boolean;
/**
 * 说明：生成翻页配置数据
 * @author tangbin
 * @date 2019/2/14
 * @time 16:36
 * @param data 后台传递的数据
 */
export declare const buildPageConfig: (data?: ITablePage<any>) => {
    current: number;
    pageSize: number;
    total: number;
    showQuickJumper: boolean;
    showSizeChanger: boolean;
    showTotal: (total: number, range: number[]) => string;
};
/**
 * 判断是否照片文件
 * @param filename
 */
export declare const isImageFile: (filename: string) => boolean;
/**
 * 构建钱的数值转换
 * @param str 需要转换的金钱
 * @return {string} 转成功了的
 */
export declare const buildMoneyStr: (str: string) => string | 0;
/**
 * 获取url的参数
 */
export declare function getUrlParams<T = any>(url?: string): T;
/**
 * 从url中或者指定位置的路径字符串
 * @param url 需要获取的url
 * @param index 如果是-1则是最后一个，如果是0则是第一个
 */
export declare const getLocalPath: (url: string, index?: number) => string;
/**
 * 从url中或者指定位置的路径字符串
 * @param index 如果是-1则是最后一个，如果是0则是第一个 默认是最后一个
 */
export declare const getWebLocalPath: (index?: number) => string;
/**
 * 刷新url的状态
 */
export declare function refreshUrlState(data: Record<string, string>): void;
type TSetUrlParams = {
    pathname: string;
    query: Record<string, any>;
};
/**
 * 设置URL参数
 */
export declare function setUrlParams(params: TSetUrlParams): string;
/**
 * 构建查询参数字符串
 * 该函数接收一个对象，将对象中的键值对转换为URL编码格式的查询参数字符串。
 * 对于对象中的数组值，采用`repeat`模式，即数组中的每个元素都会单独形成一个键值对。
 * @param params - 包含查询参数的对象，键为字符串类型，值可以是基本类型（如string、number、boolean等）或数组类型。
 * @returns 返回拼接好的URL查询参数字符串
 */
export declare function buildQueryParams(params: any): string;
/**
 * 获取页面URL中的查询参数
 * 该函数通过解析当前页面URL中 `?` 符号后的部分，提取出所有的查询参数，并以对象形式返回。
 * 如果URL中不存在查询参数部分，则返回一个空对象。
 * @returns {Object} 解析后的查询参数对象，键为参数名，值为对应的参数值，重复的参数名将被合并到一个数组中
 */
export declare function getPageQueryParams(queryString: string): any;
/**
 * 更新URL中的参数 -> 得到新的url
 */
export declare function getUpdateUrl(href: string, params: Record<string, string>): string;
/**
 * param 将要转为URL参数字符串的对象
 * prefix URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * return URL参数字符串
 */
export declare function urlEncode(param: any, prefix?: string, encode?: boolean): string;
/**
 * 将数据中的''转换成指定的字符串
 * @param obj 需要转换的对象
 * @param str 需要转换的字符串，默认是无
 */
export declare function buildNullStr<T = any>(obj: any, str?: string): T;
/**
 * 获取最近几年的年份
 * @param num 几年？默认三年（向上取）
 */
export declare function getYearOpt(num?: number): IOptions2[];
/**
 * 获取最近几年的年份
 * @param num 几年？默认三年（向下取）
 */
export declare function getYearOpts(num?: number): IOptions2[];
/**
 * 从optList中筛选出目标对象
 * @param s 需要筛选的目标字符串
 * @param optList 目标数组
 * @param key 数据的下标
 */
export declare const getListId: (s: string, optList: IOptions2[], key: string) => any;
export declare const urlToList: (url?: string) => string[];
/**
 * 导入cdn的方法
 * @param url 需要导入的文件
 * @param name 名称
 */
export declare const importCDN: (url: string, name: keyof Window) => Promise<number>;
/**
 * 常用颜色
 */
export declare const zlColor: string[];
/**
 * 将对象的key变成数字
 */
export declare const objToNum: (obj: any) => any;
/**
 * 等待~
 * @param ms 毫秒
 */
export declare const zlWait: (ms: number) => Promise<unknown>;
/**
 * 默认的表格数据
 */
export declare const defaultTableData: ITablePage<any>;
/**
 * 给vuex进行刷新的方法
 */
export declare const refreshState: (state: any, payload: any) => void;
/**
 * 删除对象里面的时间字段
 */
export declare const deleteTime: (obj: any, keys?: string[]) => any;
declare const _default: {
    buildMoneyStr: (str: string) => string | 0;
    buildPageConfig: (data?: ITablePage<any>) => {
        current: number;
        pageSize: number;
        total: number;
        showQuickJumper: boolean;
        showSizeChanger: boolean;
        showTotal: (total: number, range: number[]) => string;
    };
    isImageFile: (filename: string) => boolean;
    getUrlParams: typeof getUrlParams;
    refreshUrlState: typeof refreshUrlState;
    setUrlParams: typeof setUrlParams;
    urlEncode: typeof urlEncode;
    buildNullStr: typeof buildNullStr;
    getYearOpt: typeof getYearOpt;
    getYearOpts: typeof getYearOpts;
    getListId: (s: string, optList: IOptions2[], key: string) => any;
    urlToList: (url?: string) => string[];
    isLastPageData: (data: ITablePage<any>) => boolean;
    zlColor: string[];
    zlWait: (ms: number) => Promise<unknown>;
    importCDN: (url: string, name: keyof Window) => Promise<number>;
    defaultTableData: ITablePage<any>;
    getUpdateUrl: typeof getUpdateUrl;
    refreshState: (state: any, payload: any) => void;
    deleteTime: (obj: any, keys?: string[]) => any;
    enumToOptions: (enumObj: any) => any[];
};
export default _default;
