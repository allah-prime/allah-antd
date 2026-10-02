import { IAntTreeNode, IOptions7 } from '../@types/IZlData';
import { IEnumObj } from '../@types/IZlForm';
/**
 * 列表变化的数据
 */
export interface IListChangeVo {
    /**
     * 需要新增的数据
     */
    insertList: string[];
    /**
     * 需要删除的数据
     */
    deleteList: string[];
    /**
     * 没有变的数据
     */
    noChangeList: string[];
}
declare const ArrayUtil: {
    /**
     * 更新数组,若item已存在则将其从数组中删除,若不存在则将其添加到数组
     * **/
    updateArray: <T = any>(array: T[], item: T) => void;
    /**
     * 将数组中指定元素移除
     * @param array
     * @param item 要移除的item
     * @param id 要对比的属性，缺省则比较地址
     * @returns {*}
     */
    remove: (array: any[], item: any, id: any) => any[] | undefined;
    /**
     * 判断两个数组的是否相等
     * @return boolean true 数组长度相等且对应元素相等
     * */
    isEqual: (arr1?: any[], arr2?: any[]) => boolean;
    /**
     * clone 数组
     * @return Array 新的数组
     * */
    clone: (from: any[]) => any[];
    /**
     *获取两个数组的差集
     * @param arr1
     * @param arr2
     */
    subSet: (arr1: any[], arr2: any[]) => any[];
    /**
     * 获取数组中符合要求的项目
     * @param itemList 条目数组
     * @param v 比较值
     * @param k 比较的字段
     */
    getItemByKey: <T = any>(itemList: T[], v: any, k?: string) => T;
    /**
     * 树形数据降维
     */
    dimTreeReduction: (treeData: IAntTreeNode[], nodeKeys: string[], nodes: IAntTreeNode[]) => void;
    /**
     * 树形数据降维 - 返回一个完整的数组
     */
    dimTreeReduction2: (treeData: IAntTreeNode[]) => {
        nodes: IAntTreeNode[];
        nodeKeys: string[];
    };
    /**
     * 移除父节点
     */
    removePNode: (nodeList: any[]) => any[];
    /**
     * 数组转枚举
     */
    toEnum: (arr: IOptions7<string>[]) => IEnumObj;
    /**
     * 根据指定的字段进行去重
     * @param arr 数组
     * @param key 去重字段
     */
    uniqueBy: (arr: any[], key: string) => any[];
    /**
     * 把对象里面指定的属性转换成数组
     * @param obj 原始数据
     * @param keys 哪些字段要转换
     */
    toArrayByKeys: (obj: Record<string, any>, keys: string[]) => void;
    /**
     * 把对象里面指定的属性转换成数字数组
     * @param obj 原始数据
     * @param keys 哪些字段要转换
     */
    toNumArrayByKeys: (obj: Record<string, any>, keys: string[]) => void;
    /**
     * 把对象里面指定的属性转换成字符串
     * @param obj 原始数据
     * @param keys 哪些字段要转换
     * @param str 分隔符
     * @param joinAll 是否前后都加
     */
    toStringByKeys: (obj: Record<string, any>, keys: string[], str?: string, joinAll?: boolean) => void;
    /**
     * 把对象里面指定的属性转换成字符串 - 这个方法会在前后都补充对应的符号
     * <p>
     * ["a", "b"] => ";a;b;c;"
     * @param obj 原始数据
     * @param keys 哪些字段要转换
     */
    joinAll: (obj: Record<string, any>, keys: string[]) => void;
    /**
     * 把对象里面指定的属性转换成字符串
     * <p>
     * ["a", "b"] => "a;b;c"
     * @param obj 原始数据
     * @param keys 哪些字段要转换
     */
    join: (obj: Record<string, any>, keys: string[]) => void;
    /**
     * 查找出两个数组中需要删除的，需要更新的，没有变化的
     */
    findChangeData: (oldData: string[], newData: string[], key: string) => IListChangeVo;
    /**
     * 将字符串或者数组转成数组
     * @param str 字符串或者数组
     * @param splitStr 分隔符
     */
    toArray: (str: string | string[] | undefined | null, splitStr?: string) => string[] | null;
    /**
     * 判断对象里面的数组是否发生了变化
     * <br />
     * 一般来说，用在资源关联里面，比如判断下现在新的资源和旧的资源是否有变化，如果没有变化，就不需要重新请求接口
     */
    isChangeArray: (oldObj: Record<string, any[]>, newObj: Record<string, any[]>) => boolean;
    /**
     * 数组移动位置
     * @param array 数组
     * @param from 从哪个位置
     * @param to 移动到哪个位置
     */
    arrayMove<T>(array: T[], from: number, to: number): T[];
};
export default ArrayUtil;
