import type { Dayjs } from 'dayjs';
export declare const UNITS: {
    年: number;
    月: number;
    天: number;
    小时: number;
    分钟: number;
    秒: number;
};
export type DTimeType = 'day' | 'hours' | 'minutes' | 'seconds';
export interface IDiffTime {
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    /**
     * 显示的字符串
     */
    string: string;
    /**
     * 是否到期
     */
    isEnd: boolean;
    /**
     * 值
     */
    value: number;
}
export interface DateTimeObject {
    year: number;
    month: number;
    day: number;
    weekday: number;
    hours: number;
    minutes: number;
    time: string;
    yearStr: string;
    monthStr: string;
    dayStr: string;
    weekdayStr: string;
    dateStr: string;
    fullDateStr: string;
    timeStr: string;
    yearChinese: string;
    monthChinese: string;
    dayChinese: string;
    dateChinese: string;
    fullDateChinese: string;
    timeChinese: string;
}
declare const DateUtils: {
    /**
     * 语义化时间
     * @param {Object} milliseconds
     * @param {Object} date
     */
    latelyTime: (milliseconds: number, date: Date) => string;
    /**
     * 显示多久以前,传递一个时间字符串
     * @param {Number | String} dataNumber 时间错
     */
    formatDate: (dataNumber: string | number) => string;
    /**
     * 计算时间差 得到显示的字符串，会根据时间差的大小，自动转换为天、小时、分钟、秒
     * @param endDay 结束时间
     * @param type 显示的级别，1 天，2 小时，3 分钟，4 秒
     * @param defStr 默认显示的字符串
     */
    diffTimeStr2: (endDay: Dayjs, type?: 1 | 2 | 3 | 4, defStr?: string) => string;
    /**
     * 计算时间差
     * @param endDay 结束时间
     * @param type 类型
     */
    diffTimeObj: (endDay: Dayjs, type: DTimeType) => IDiffTime;
    /**
     * 生成开始时间和结束时间字符串
     */
    getStartEndTimeStr: (date: (Dayjs | string | number | undefined)[], type?: "time" | "day" | "auto") => {
        startDay: string | undefined;
        endDay: string | undefined;
    };
    /**
     * 生成开始时间和结束时间时间戳
     */
    getStartEndTimeUnix: (date: (Dayjs | string | number | undefined)[]) => {
        startDay: number | undefined;
        endDay: number | undefined;
    };
    /**
     * 根据当前的时间，来生成是凌晨、早上、中午、下午、晚上，返回对应的字符串
     */
    getDayTimeStr: (date?: Dayjs) => "" | "凌晨" | "上午" | "中午" | "下午" | "晚上";
    /**
     * 安全格式化日期
     *
     * @param date - 要格式化的日期，可以是字符串、数字、Date 对象或 dayjs 对象
     * @param format - 输出的日期格式，默认为 "YYYY-MM-DD"
     * @returns 格式化后的日期字符串；如果输入无效，则返回 "-"
     *
     * @example
     * safeFormat("2025-09-20") // "2025-09-20"
     * safeFormat("2025-13-40") // "-"
     * safeFormat(new Date(), "YYYY/MM/DD HH:mm") // "2025/09/20 16:30"
     */
    safeFormat: (date: any, format?: string) => string;
    /**
     * 安全格式化时间
     */
    safeFormatTime: (date: any, format?: string) => string;
    /**
     * 格式化日期范围显示
     * 将开始时间和结束时间格式化为范围显示
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @returns 格式化后的日期范围字符串
     */
    formatDateRange: (startTime?: string, endTime?: string) => string;
    /**
     * 将中文日期字符串转换为 dayjs 对象
     * @param dateStr 中文日期字符串，例如 "2025年9月20日"
     * @returns dayjs 对象
     */
    parseChineseDate: (dateStr: string) => Dayjs | null;
    /**
     * 将日期转成拆开的时间对象（含普通与纯中文格式）
     */
    parseDateToTimeObj: (date: string | number | Date) => DateTimeObject;
};
export declare const templateObj: {
    day: string;
    time: string;
    start: string;
    end: string;
};
export default DateUtils;
