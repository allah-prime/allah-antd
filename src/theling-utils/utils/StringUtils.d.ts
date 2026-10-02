declare const StringUtils: {
    /**
     * 将参数中的null，''等属性删除掉
     * @param params 需要判断的对象
     */
    buildParamsNull: (params: any) => any;
    /**
     * 判断是否存在
     * @param str 需要判断的参数
     */
    isExit: (str?: string | number) => string | number | boolean | undefined;
    /**
     * 版本号比较方法
     * 传入两个字符串，当前版本号：curV；比较版本号：reqV
     * 调用方法举例：compare("1.1","1.2")，将返回false
     * @param locV 本地版本
     * @param serV 服务端版本
     * @return {boolean}
     */
    compareVer: (locV: string, serV: string) => boolean;
    /**
     * 转义 转义字符=>html
     * @param str
     */
    escape2Html: (str: string) => string;
    winPath: (path: string) => string;
    /**
     * 版本号更新
     * @param version 版本号
     * @param index 更新第几位
     */
    updateVersion: (version: string, index?: number) => string;
    /**
     * 富文本中的src转换
     * @param html 富文本
     * @param str1 域名
     * @param str2 后面跟的参数
     */
    htmlImgSrcReplace: (html: string, str1: string, str2?: Record<string, string>) => string;
    /**
     * 替换url的域名和前面的http或https
     */
    replaceUrlDomain: (url: string, domain: string) => string;
    /**
     * 替换对象或者数组中的空值
     */
    replaceEmpty: (data: any, replaceStr?: string) => any;
    /**
     * 替换指定的字段为 -
     */
    replaceFieldsEmpty: (data: any, fields: string[], replaceStr?: string) => any;
    /**
     * 将字节转成可读字符串，例如B、KB、MB、GB、TB
     */
    visualStorageStr: (limitStr: string | number) => string;
    /**
     * 将数字转成估值 x亿， x万，x千，x百，x十，x
     * @param text 数字
     * @returns 估值字符串
     */
    visualNumberStr: (text: string | number) => string;
    copyToClipboard: (text: string) => Promise<void>;
};
export default StringUtils;
