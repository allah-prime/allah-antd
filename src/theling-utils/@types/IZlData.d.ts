import { Dayjs } from 'dayjs';
export type ZlKey = string | number | bigint;
/**
 * 由value和text组成的选项
 */
export interface IOptions1 {
    /**
     * 文本
     */
    text: string;
    /**
     * 值
     */
    id: string;
    count?: number;
    /**
     * 循环用的key，不一定有值，需要和后端确认！
     */
    key?: ZlKey;
}
/**
 * 由id和text组成的选项
 */
export interface IOptions2 {
    /**
     * 文本
     */
    text: any;
    /**
     * 值
     */
    id: any;
    /**
     * 判断类型
     */
    type?: string;
    remark?: string;
    /**
     * 循环用的key，不一定有值，需要和后端确认！
     */
    key?: string | number;
}
/**
 * 由value和name组成的选项
 */
export interface IOptions3 {
    /**
     * 文本
     */
    name: any;
    /**
     * 值
     * @deprecated code
     */
    value: any;
    code: any;
    /**
     * 循环用的key，不一定有值，需要和后端确认！
     */
    key?: string | number;
}
/**
 * 由key和title组成的选项
 */
export interface IOptions4 {
    /**
     * 文本
     */
    key: any;
    /**
     * 值
     */
    title: any;
}
/**
 * 由key和title组成的选项
 */
export interface IOptions5 extends IOptions3 {
    /**
     * 文本
     */
    pCode: any;
}
/**
 * 由label和value和checked和disabled组成的选项
 * 泛型T为value的类型，k为key的类型
 */
export interface IOptions6<T, K = string | number | bigint> {
    label: any;
    value: T;
    checked?: boolean;
    disabled?: boolean;
    text?: string;
    /**
     * 循环用的key，不一定有值，需要和后端确认！
     */
    key: K;
    /**
     * 颜色
     */
    color?: string;
}
/**
 * 由label和value和key组成的选项
 */
export interface IOptions61<T> {
    label: string;
    value: T;
    key: string;
}
/**
 * 由label和value和checked和disabled组成的选项
 */
export interface IOptions7<T, O = Record<string, any>, K = string | number | bigint> extends IOptions6<T, K> {
    /**
     * 描述信息
     */
    description?: string;
    /**
     * 这个是为了兼容异步多级联动组件加上去的
     */
    loading?: boolean;
    /**
     * 额外的信息
     */
    other?: O;
    /**
     * 提示文本
     */
    tipText?: string;
}
/**
 * 分页的数据
 */
export interface ITablePage<T> {
    /**
     * 列表数据
     */
    records: T[];
    /**
     * 列表数据-确保不为空
     */
    list: T[];
    /**
     * 单页大小
     */
    size: number;
    /**
     * 当前页数
     */
    current: number;
    /**
     * 总页数
     */
    pages: number;
    /**
     * 总条数
     */
    total: number;
    /**
     * 是否升序
     */
    asc?: boolean;
}
/**
 * 文件对象
 */
export interface IFileItem {
    /**
     * 文件id
     */
    fileid: string;
    /**
     * 文件名称
     */
    filename: string;
    /**
     * 文件路径
     */
    filepath: string;
    /**
     * 文件格式
     */
    suffix: string;
    /**
     * 类型
     */
    type?: string;
}
/**
 * 文件对象
 */
export interface IFileItem2 {
    /**
     * 文件id
     */
    fileId: string;
    /**
     * 文件名称
     */
    fileName: string;
    /**
     * 文件路径
     */
    filePath: string;
    /**
     * 文件格式
     */
    suffix: string;
    /**
     * 类型
     */
    type?: string;
}
/**
 * 初始筛选
 */
export interface IBaseFilter {
    /**
     * 搜索的关键词
     */
    keyword?: string;
    /**
     * 开始日期
     */
    startDay?: string | Dayjs;
    startDayStr?: string | Dayjs;
    /**
     * 结束日期
     */
    endDay?: string | Dayjs;
    endDayStr?: string | Dayjs;
    /**
     * 页码
     */
    pageNum?: number;
    /**
     * 时间 -  除开始时间和结束时间外 其他的可以这么传
     */
    time?: string[] | Dayjs[];
    /**
     * 创建 时间
     */
    creTimeArr?: string[];
    /**
     * 更新 时间
     */
    updateTimeArr?: string[];
    /**
     * 单页文件大小，最大不超过20
     */
    pageSize?: number;
    /**
     * 当前页数
     */
    current?: number;
    /**
     * 排序，传递一个字段，和一个是否升序的布尔值
     */
    sort?: Record<string, boolean>;
    /**
     * 地区码
     */
    adminCode?: string;
    /**
     * 店铺id
     */
    shopId?: string;
}
/**
 * 用来进行展示的文件数组
 */
export interface IFileObj2 {
    fileList: IFileItem[];
    typename: string;
}
/**
 * 版本信息
 */
export interface IVerInfo {
    /**
     * 版本号
     */
    verNum: string;
    /**
     * 所属系统
     */
    sysName: string;
    /**
     * 系统的类型
     */
    sysType: string;
    /**
     * 更新时间
     */
    upTime: number;
    /**
     * 更新内容
     */
    content: string;
}
/**
 * 天气
 */
export interface IWaterInfo {
    /**
     * 返回状态值为0或11：成功；0：失败
     */
    status: IValidityNum;
    /**
     * 返回结果总数目
     */
    count: number;
    /**
     * 返回的状态信息
     */
    info: string;
    /**
     * 返回状态说明,10000代表正确
     */
    infocode: string;
    /**
     * 实况天气数据信息
     */
    lives: IWaterLives[];
}
export interface IWaterLives {
    /**
     * 省份名
     */
    province: string;
    /**
     * 城市名
     */
    city: string;
    /**
     * 区域编码
     */
    adcode: string;
    /**
     * 天气现象（汉字描述）
     */
    weather: string;
    /**
     * 实时气温，单位：摄氏度
     */
    temperature: string;
    /**
     * 风向描述
     */
    winddirection: string;
    /**
     * 风力级别，单位：级
     */
    windpower: string;
    /**
     * 空气湿度
     */
    humidity: string;
    /**
     * 数据发布的时间
     */
    reporttime: string;
}
/**
 * 全部下拉列表的数据,获取推送类型、改革方式、业务阶段、对象类型列表
 */
export interface IAllList {
    /**
     * 推送类型
     */
    pushType: IOptions2[];
    /**
     * 改革方式
     */
    reformWay: IOptions2[];
    /**
     * 业务阶段
     */
    stageOfBusiness: IOptions2[];
    /**
     * 对象类型
     */
    objectType: IOptions2[];
}
/**
 * 树数据
 */
export interface ISysTree {
    code: string;
    pcode: string;
    pCode: string;
    name: string;
    id?: string;
    nodeType?: 1 | 0 | '1' | '0';
    children?: ISysTree[];
}
/**
 * 微信信息
 */
export interface IWeCharTokenInfo {
    code: string;
    state: string;
}
/**
 * 用来做表格的选择跟取消选择的
 */
export interface ISelectObj<T> {
    selectKeyList: string[];
    selectItemList: T[];
    type?: string;
}
/**
 * antd的tree组件的节点数据
 */
export interface IAntTreeNode {
    title: string | any;
    label: string | any;
    key: string;
    value: string;
    /**
     * 父编码
     */
    pcode: string;
    /**
     * 是否是叶子节点 true 是叶子节点 false 不是叶子节点
     */
    isLeaf: boolean;
    other?: Record<string, any>;
    children?: IAntTreeNode[];
    loading?: boolean;
    disabled?: boolean;
}
/**
 * 权限枚举 - 同后端的 com.theling.common.constant。ZlPermissions
 */
export declare enum ZlPermissionEnum {
    /**
     * 公有
     */
    PUBLIC = 0,
    /**
     * 私有
     */
    PRIVATE = 1,
    /**
     * 登录后可以查看
     */
    LOGIN = 2,
    /**
     * 本部门可见/部门内可见
     */
    DEPT = 3
}
export declare const ZlPermissionEnumOpts: IOptions7<number>[];
/**
 * 数字有效性
 */
export type IValidityNum = 0 | 1;
export declare const IValidityNumOpts: IOptions7<number>[];
export declare const IYesNoNumOpts: IOptions7<number>[];
/**
 * bool有效性
 */
export type IValidityBool = true | false;
export declare const IValidityBoolOpts: IOptions7<boolean>[];
/**
 * 动态的数据
 */
export interface IDynamicData {
    key: string;
    /**
     * 用户的名称
     */
    user: string;
    /**
     * 用户的操作
     */
    active: string;
    content: string;
    time: string;
}
/**
 * 标签的选择数据
 */
export type ITagOptDto = IOptions7<string> & {
    color?: string;
};
/**
 * 基本的自定义属性对象
 */
export type IDefSysDefinedAttributes<T = any> = {
    id: string;
    attLabel: string;
    attType: T;
    attTypeText: string;
    description: string;
    weight: number;
    /**
     * 基本的自定义对象对象的默认值
     */
    defaultValue?: any;
    dicGroupKey?: string;
    options?: {
        value: any;
        eum: any;
    };
    zlKey: string;
    resValue: any;
    showSearch?: boolean;
    /**
     * 表单的额外配置
     */
    fieldProps: Record<string, any>;
};
