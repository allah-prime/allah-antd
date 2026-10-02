/**
 * 修改URL的参数
 * @param urlParams
 */
export declare const changeUrlParams: (urlParams: any) => void;
/**
 * 将vh/vw转换成px
 * @param value
 */
export declare function viewportToPixels(value: string): number;
/**
 * 获取页面中全部的iframe，以及iframe中的iframe
 */
export declare const getAllIframe: (iframeDocument?: Document) => HTMLCollectionOf<HTMLElementTagNameMap["iframe"]>[];
/**
 * 指定元素的拖拽
 * @param dom 元素的dom
 */
export declare const dragDomFunc: (dom: HTMLElement) => void;
/**
 * 获取当前Chrome浏览器版本
 * -1 则不是Chrome浏览器
 */
export declare function getChromeVersion(): number;
