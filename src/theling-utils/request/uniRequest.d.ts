import { IZlRequestOption } from "../typings";
/**
 * 兼容 SSE 的 uni.request 直接封装（保留旧签名，避免调用方兼容问题）
 */
export declare const getUniSseReq: (url: string, config: {
    data: any;
    header: any;
}, event: IZlRequestOption["sseConfig"]) => any;
/**
 * 纯 uni.request Promise wrapper。
 * 只关心 request 语义，不依赖 axios，避免 axios 内部默认 headers（含 Content-Type: undefined）
 * 或 buildURL 等隐藏路径踩到 undefined.indexOf 之类的坑。
 *
 * 输入是一个类 axios config：{ url, method, headers, data, responseType, params?, ... }
 * 输出类 axios response：{ data, status, statusText, headers, config, request }
 */
declare const uniRequest: (config?: any) => Promise<any>;
export default uniRequest;
