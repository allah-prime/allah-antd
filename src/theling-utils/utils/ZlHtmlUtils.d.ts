/**
 * 新增的场景下，用户在html中插入的图片是使用的server的地址，也就是用的cosKey来进行的。
 * <br />
 * 在详情显示的时候，根据网络的情况，需要将对应的接口转成外网或者内网的接口
 * <br />
 * 如果是外网，那么就需要将server的接口转成cos的接口
 * <br />
 * 如果是内网，那么就更新server的接口
 * <br />
 * 所有的富文本的img都存这种类型的：http://theling.top:9002/cloud-service/api/file/cross/signUrl?fileId=e2b42debf56066fd349afe97f775148f&token=07e30d80cccd38fb3ffc4eecb8b6918343e6b07e1666059496947
 * <br />
 * 然后根据实际的网页进行转换！！！
 * <br />
 * Notion / ANotion 附件落盘格式同样处理：
 * video[src] / audio[src] / a[data-type="file"][href]
 */
export type IFileUrlType = {
    cosKey: string;
    type: 'server' | 'cos';
};
export type IJsonContentNode = {
    type?: string;
    attrs?: {
        src?: string;
        [key: string]: unknown;
    };
    content?: IJsonContentNode[];
};
export type IJsonDoc = {
    type: string;
    content?: IJsonContentNode[];
};
/**
 * 解析url路径得到对应的文件key或者id
 * @param url 资源的地址
 */
export declare const parseUrlPath: (url: string) => IFileUrlType;
/**
 * 解析富文本，得到所有的图片/附件的key
 * <br />
 * 这是在存储的时候要用到的，从html里面得到所有文件的对象，然后进行关联就好了
 * @param html 富文本
 */
export declare const getFileKeyListFromHtml: (html: string) => IFileUrlType[];
export declare const getUrlFormMdImg: (urlTag: string) => string;
export declare const getAltFormMdImg: (urlTag: string) => string;
/**
 * 解析Markdown，得到所有图片/附件的cosKey
 * <br />
 * 含 MD 图片语法，以及嵌入的 Notion HTML 媒体片段
 */
export declare const getFileKeyListFromMarkdown: (markdown: string) => IFileUrlType[];
export declare const replaceUrlDomain: (url: string, domain: string) => string;
/**
 * 保存前：把 HTML 中的临时签 URL 换成 cosKey（含 img/video/audio/file 锚点）
 */
export declare const updateHtmlImgUrl: (html: string, urlVer?: (url: string) => boolean) => string;
/**
 * 详情/编辑回显：把 HTML 中的 cosKey（非 http）换签为可访问 URL
 */
export declare const infoHtmlImgUrl: (html: string, urlReq: (key: string) => Promise<string>) => Promise<string>;
/**
 * 保存前：JSON 文档中 image / file 节点的临时签 → cosKey
 */
export declare const updateJsonImgUrl: (json: IJsonDoc, urlVer?: (url: string) => boolean) => IJsonDoc;
/**
 * 详情/编辑回显：JSON 文档中 image / file 节点换签
 */
export declare const infoJsonImgUrl: (json: IJsonDoc, urlReq: (key: string, bucket?: string) => Promise<string>, bucket?: string) => Promise<IJsonDoc>;
/**
 * 保存前：Markdown 图片 + 嵌入的 Notion HTML 媒体 → cosKey
 */
export declare const updateMarkdownImgUrl: (markdown: string, urlVer?: (url: string) => boolean) => string;
/**
 * 详情/编辑回显：Markdown 中的 cosKey 换签（含嵌入 HTML 媒体）
 */
export declare const infoMarkdownImgUrl: (markdown: string, urlReq: (key: string, bucket?: string) => Promise<string>, bucket?: string) => Promise<string>;
export type IUrlFileInfo = {
    /**
     * 文件的名称
     */
    name: string;
    /**
     * 文件后缀
     */
    suffix: string;
};
/**
 * 从url中得到文件的信息
 * @param url
 */
export declare const getFileNameFormUrl: (url: string) => IUrlFileInfo;
