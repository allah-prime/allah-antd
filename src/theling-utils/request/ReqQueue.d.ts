type IReqQueueInit = {
    maxQueueLength?: number;
    cacheMethod?: (v: Record<string, any>) => void;
};
export default class ReqQueue {
    private static instance;
    private static reqQueue;
    private static maxQueueLength;
    private static cacheMethod;
    constructor(p: IReqQueueInit);
    static init(p: IReqQueueInit): ReqQueue;
    static getInstance(p: IReqQueueInit): ReqQueue;
    /**
     * 获取下日志队列
     */
    static getReqQueue(): Record<string, any>;
    /**
     * 添加或者更新一条记录
     * @param data
     * @param key
     */
    static addReqQueue(data: any, key?: string): void;
}
export {};
