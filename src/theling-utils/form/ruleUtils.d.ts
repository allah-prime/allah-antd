import { IJsonRuleItem } from "../@types/IZlForm";
export declare const showPicker: string[];
export declare const selectRuleOptions: {
    label: string;
    value: string;
}[];
export declare const digitOptions: {
    label: string;
    value: string;
}[];
export declare const switchOptions: {
    label: string;
    value: string;
}[];
export declare const formRuleObj: {
    checkbox: {
        label: string;
        value: string;
    }[];
    select: {
        label: string;
        value: string;
    }[];
    radio: {
        label: string;
        value: string;
    }[];
    text: {
        label: string;
        value: string;
    }[];
    textarea: {
        label: string;
        value: string;
    }[];
    digit: {
        label: string;
        value: string;
    }[];
    date: {
        label: string;
        value: string;
    }[];
    dateYear: {
        label: string;
        value: string;
    }[];
    switch: {
        label: string;
        value: string;
    }[];
    customRender: {
        label: string;
        value: string;
    }[];
};
export type IFormRuleObjKey = keyof typeof formRuleObj;
export declare const canValidateLengthType: string[];
export declare const validateType: {
    text: string;
    textarea: string;
    checkbox: string;
    select: string;
    digit: string;
};
export declare const defaultFormValue: {
    event: string;
    all: {
        connect: string;
    }[];
}[];
/**
 * 通用比较操作符处理函数
 * @param operator 操作符 - 比较操作类型
 * @param actualValue 实际值 - 需要比较的值
 * @param expectedValue 期望值 - 用于比较的目标值
 * @returns 返回比较结果，true表示符合条件，false表示不符合
 */
export declare const executeComparison: (operator: string, actualValue: any, expectedValue: any) => boolean;
/**
 * 对数字类型字段的校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的数字值
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export declare const validateRulesDigit: (item: IJsonRuleItem, value: any) => boolean;
/**
 * 对年份进行比较校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的日期值，会提取年份进行比较
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export declare const validateRulesDateYear: (item: IJsonRuleItem, value: any) => boolean;
/**
 * 对日期进行比较校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的日期值，会转换为时间戳进行比较
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export declare const validateRulesDate: (item: IJsonRuleItem, value: any) => boolean;
/**
 * 对开关类型字段的校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的开关值
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export declare const validateRulesSwitch: (item: IJsonRuleItem, value: any) => boolean;
/**
 * 对文本类型字段（text、textarea）的校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的文本值
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export declare const validateRulesText: (item: IJsonRuleItem, value: any) => boolean;
/**
 * 对自定义渲染类型字段的校验（使用正则表达式）
 * @param item 规则项 - 包含校验条件的规则对象，value 为正则表达式字符串
 * @param value 值 - 需要校验的文本值
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export declare const validateRulesCustomRender: (item: IJsonRuleItem, value: any) => boolean;
/**
 * 对选择类型字段（select、checkbox、radio）的校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的选项值数组，默认为空数组
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export declare const validateRulesOptions: (item: IJsonRuleItem, value?: any[]) => boolean;
/**
 * 校验单个规则项
 * @param item 规则项 - 包含校验条件的规则对象
 * @param data 数据 - 需要校验的表单数据对象
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export declare const validateRulesItem: (item: IJsonRuleItem, data: any) => boolean;
export declare const useDicGroupKeyList: string[];
export declare const useDigitTypeList: string[];
export declare const useYearTypeList: string[];
export declare const useSwitchTypeList: string[];
export declare const useTextTypeList: string[];
export declare const useCustomRenderTypeList: string[];
export declare const canShowPlaceholder: string[];
