import { Change } from 'diff';
export default class DiffUtils {
    /**
     * 生成对象对数据
     * @param oldObj 旧的对象
     * @param newObj 新的对象
     */
    static buildDiffObj: (oldObj: any, newObj: any) => any;
    /**
     * 构建全是添加的数据
     * @param obj 操作的对象
     */
    static buildNewDiffObj: (obj: any) => any;
    static buildDiffArray: (oldArray: any[], newArray: any[]) => {
        added: any[];
        removed: any[];
        noed: any[];
        change: boolean;
    };
    /**
     * 比较对象数组，基于唯一标识字段判断新增、删除、无变化，，老的会存在同一组数据被误判为"删除+新增"
     * @param oldArray 旧的对象数组
     * @param newArray 新的对象数组
     * @returns 包含added（新增）、removed（删除）、noed（无变化）的对象
     */
    static buildDiffObjectArray: (oldArray: any[], newArray: any[]) => {
        added: any[][];
        removed: any[][];
        noed: any[][];
    };
}
export type DiffData = Change & {
    key: string;
};
