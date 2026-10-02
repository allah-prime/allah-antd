import { IOptions7 } from "../@types/IZlData";
import { ISysDefinedAttributes } from './type';
import { IFormColumns, IJsonRuleListItem } from "../@types/IZlForm";
/**
 * 表单规则校验方法
 * @param rules 规则组 - 包含多个规则项的数组
 * @param data 数据 - 需要校验的表单数据对象
 * @returns 返回符合条件的事件名称数组
 * @deprecated 应该使用 validateActions 方法
 */
export declare function validateRules(rules: IJsonRuleListItem[], data: Record<string, any>): string[];
type ActionResult = {
    show: boolean;
    hide: boolean;
    disable: boolean;
    clear: boolean;
};
/**
 * 表单动作校验方法
 * @param rules 规则组
 * @param data 数据
 */
export declare function validateActions(rules: IJsonRuleListItem[], data: Record<string, any>): ActionResult;
/**
 * 初始化自定义属性配置
 * @param configItem 配置项 - 系统定义的属性配置对象，可为null
 * @param form 表单实例 - Antd Form 实例，用于设置表单字段值
 */
export declare const initAttributesConfig: (configItem: ISysDefinedAttributes | null, form: any) => void;
/**
 * 自定义属性中的选项发生变化时的处理函数
 * @param newOpt 新选项 - 新的选项数组
 * @param configItem 配置项 - 当前的属性配置对象，可为null
 * @param setConfigItem 设置配置项函数 - 用于更新配置项的回调函数
 */
export declare const onAttributesConfigListOptionsChange: (newOpt: IOptions7<string>[], configItem: ISysDefinedAttributes | null, setConfigItem: (item: ISysDefinedAttributes) => void) => void;
/**
 * 根据用户选择的值，生成新的表单配置（改进版）
 * @param value 当前表单的数据
 * @param config 默认的配置
 * @returns 更新后的表单配置
 */
export declare const buildNewFormItemPropsVer: ({ value }: any, config: IFormColumns) => IFormColumns;
/**
 * 按照 title 类型的列对数据进行分组
 * @param columns 列配置数组
 * @returns 分组后的数据结构数组
 */
export declare const groupColumnsByTitle: <T extends Record<string, any>>(columns: IFormColumns<T>[]) => Array<IFormColumns<T> & {
    columns: IFormColumns<T>[];
}>;
export {};
