/**
 * Cookie操作工具类
 * 提供cookie的读取、设置、删除等功能
 */
declare const cookieUtils: {
    /**
     * 读取指定名称的cookie值
     * @param name cookie名称
     * @returns cookie值，如果不存在则返回null
     */
    read(name: string): string | null;
    /**
     * 设置cookie
     * @param name cookie名称
     * @param value cookie值
     * @param options cookie选项
     */
    set(name: string, value: string, options?: {
        expires?: Date | number;
        path?: string;
        domain?: string;
        secure?: boolean;
        sameSite?: "Strict" | "Lax" | "None";
    }): void;
    /**
     * 删除指定名称的cookie
     * @param name cookie名称
     * @param options cookie选项（path和domain需要与设置时一致）
     */
    remove(name: string, options?: {
        path?: string;
        domain?: string;
    }): void;
    /**
     * 获取所有cookie
     * @returns 包含所有cookie的对象
     */
    getAll(): Record<string, string>;
    /**
     * 检查cookie是否存在
     * @param name cookie名称
     * @returns 是否存在
     */
    exists(name: string): boolean;
    /**
     * 清除所有cookie
     * @param options cookie选项
     */
    clearAll(options?: {
        path?: string;
        domain?: string;
    }): void;
};
export default cookieUtils;
