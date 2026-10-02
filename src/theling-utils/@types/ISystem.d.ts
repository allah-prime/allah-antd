import { IBaseFilter } from './IZlData';
/**
 * <p>
 * 系统的字典表
 * </p>
 *
 * @author allahbin123
 * @since 2019-09-17
 */
export interface ISysDictionary {
    /**
     * 字典项id
     */
    dicId: string;
    /**
     * 字典组的兼职
     */
    groupKey: string;
    /**
     * 字典键
     */
    dicKey: string;
    /**
     * 字典值
     */
    dicValue: string;
    /**
     * 排序号
     */
    seqno: number;
}
export interface ISysDistrict {
    /**
     * 行政区
     */
    disId: string;
    /**
     * 编码
     */
    code: string;
    /**
     * 父编码
     */
    pcode: string;
    /**
     * 节点类型
     */
    nodeType: string;
    /**
     * 部门名称
     */
    disName: string;
    /**
     * 地区码
     */
    adminCode: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 部门类型
     */
    disType: string;
    /**
     * 排序号
     */
    seqNo: number;
    /**
     * 创建人
     */
    creUser: string;
    /**
     * 创建时间
     */
    creTime: number;
    /**
     * 拼音名称
     */
    spellName: string;
    /**
     * 创建时间
     */
    upTime: number;
    /**
     * 更新人
     */
    upUser: string;
    /**
     * 其他属性
     */
    otherProperty: string;
}
/**
 * <p>
 * 系统的字典组，用来对字典进行分组管理
 * </p>
 *
 * @author allahbin123
 * @since 2019-09-17
 */
export interface ISysDictionaryGroup {
    /**
     * 字典组id
     */
    groupId: string;
    /**
     * 编码
     */
    code: string;
    /**
     * 父编码
     */
    pcode: string;
    /**
     * 字典组集合id
     */
    groupKey: string;
    /**
     * 字典组合名称
     */
    groupName: string;
    /**
     * 排序
     */
    sqeno: number;
    /**
     * 节点类型1 父节点，0子节点
     */
    nodeType: number;
}
/**
 * 系统文件
 */
export interface ISysFile {
    /**
     * 文件id
     */
    fileId: string;
    /**
     * 文件大小
     */
    fileSize: number;
    /**
     * 初始名称（修改前的）
     */
    origName: string;
    /**
     * 文件的名称（修改后的）
     */
    fileName: string;
    /**
     * 文件保存在服务器的地址
     */
    filePath: string;
    /**
     * MD5码
     */
    md5: string;
    /**
     * 文件的状态
     */
    status: number;
    /**
     * 文件的后缀
     */
    suffix: string;
    /**
     * 创建时间
     */
    creTime: number;
    /**
     * 创建人id
     */
    creUserId: string;
    /**
     * 创建人名称
     */
    creUserName: string;
    /**
     * 文件的类型
     */
    fileType: string;
}
/**
 * 系统日志
 */
export interface ISysLog {
    /**
     * 日志id
     */
    logId: string;
    /**
     * 创建人id
     */
    creUserId: string;
    /**
     * 创建人名称
     */
    creUserName: string;
    /**
     * 创建时间
     */
    creTime: number;
    /**
     * 记录ip
     */
    ip: string;
    /**
     * 请求类型
     */
    method: string;
    /**
     * 访问的url
     */
    url: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 操作系统
     */
    os: string;
    /**
     * 浏览器
     */
    browser: string;
    /**
     * 传递的参数
     */
    params: string;
    /**
     * 类方法
     */
    classMethod: string;
}
/**
 * 系统用户
 */
export interface ISysUser {
    /**
     * 用户id
     */
    userId: string;
    /**
     * 用户类型
     */
    userType: string;
    /**
     * 用户名称
     */
    userName: string;
    /**
     * 登录名称
     */
    loginName: string;
    /**
     * 密码
     */
    password: string;
    /**
     * 部门id
     */
    depId: string;
    /**
     * 部门编码
     */
    depCode: string;
    /**
     * 部门名称
     */
    depName: string;
    /**
     * 行政区号
     */
    adminCode: string;
    /**
     * 用户状态1 可用 0 不可用
     */
    status: number;
    /**
     * 邮箱
     */
    email: string;
    /**
     * QQ
     */
    qq: string;
    /**
     * 手机
     */
    mobile: string;
    /**
     * 最后登录id
     */
    lastLoginId: string;
    /**
     * 最后登录时间
     */
    lastLoginTime: number;
    /**
     * 创建人
     */
    creUserName: string;
    /**
     * 创建时间
     */
    creTime: number;
    /**
     * 街巷长类型
     */
    streetLake: number;
    /**
     * 是否党员 1 是 0 不是
     */
    isCpc: number;
    /**
     * 党组织id
     */
    cpcId: string;
    /**
     * 党组织名称
     */
    cpcName: string;
    /**
     * 党员类型
     */
    cpcUserType: string;
    /**
     * 用户的拼音名称
     */
    spellName: string;
    /**
     * 工单权限
     */
    workAuthority: string;
    /**
     * 是否缓存
     */
    isRedisUser: boolean;
}
export interface ISysDisFilter extends IBaseFilter {
    pcode?: string;
    /**
     * 地区类型
     */
    depType?: string;
    /**
     * 其他属性
     */
    otherProperty?: string;
    /**
     * 搜索方式
     */
    searchType?: 'all' | '';
    /**
     * 地区编码
     */
    adminCode?: string;
    adminCodes?: string[];
    /**
     * 层级
     */
    disType?: string;
}
