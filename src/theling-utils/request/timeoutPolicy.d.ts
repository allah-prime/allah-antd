/** 普通 HTTP 走默认超时；SSE 流式请求不套超时。 */
export declare const shouldApplyHttpTimeout: (reqType?: string) => boolean;
/** fetch AbortError / axios 取消，均视为超时或主动取消。 */
export declare const isAbortLikeError: (error: unknown) => boolean;
