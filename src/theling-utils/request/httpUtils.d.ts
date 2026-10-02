import { ICallBack, IZlRequestOption } from '../typings';
export declare const zlDelay: (time: number) => Promise<unknown>;
/**
 * 请求拦截
 * @param url 请求地址
 * @param options 请求配置
 * @return {{options: *, url: *}}
 */
export declare const requestErrorIntercept: (url: string, options: IZlRequestOption) => IZlRequestOption;
/** 基于 Unicode 分布使用的颜色表，用于首字取色 */
export declare const colorList: string[];
/**
 * 从 colorList 中随机获取一个颜色
 * @returns 随机颜色值（十六进制字符串）
 */
export declare const getRandomColor: () => string;
/**
 * 根据字符串首字的 Unicode 码点返回固定颜色，首字相同则颜色相同
 * @param str 用于生成颜色的字符串（如用户名、标签名）
 * @returns 对应的颜色值（十六进制字符串）
 */
export declare const getColorByString: (str: string) => string;
/**
 * 请求错误拦截——后台返回错误数据的拦截，到这里的话，相当于http状态码的校验已经通过了
 * @param data 后台传递的结果数据
 * @param url 请求的地址
 * @param newOptions 请求的配置项
 * @param callback 回调函数
 */
export declare const responseErrorIntercept: (data: any, newOptions: IZlRequestOption, url: string, callback?: ICallBack) => any;
/**
 * 处理请求列表的参数 - 分页和排序参数
 * @param v 参数
 * @param sort 排序
 */
export declare const handleReqListParams: (v: any, sort: any) => any;
