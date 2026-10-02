/**
 * 由value和text组成的选项
 */

/**
 * 由id和text组成的选项
 */

/**
 * 由value和name组成的选项
 */

/**
 * 由key和title组成的选项
 */

/**
 * 由key和title组成的选项
 */

/**
 * 由label和value和checked和disabled组成的选项
 * 泛型T为value的类型，k为key的类型
 */

/**
 * 由label和value和key组成的选项
 */

/**
 * 由label和value和checked和disabled组成的选项
 */

/**
 * 分页的数据
 */

/**
 * 文件对象
 */

/**
 * 文件对象
 */

/**
 * 初始筛选
 */

/**
 * 用来进行展示的文件数组
 */

/**
 * 版本信息
 */

/**
 * 天气
 */

/**
 * 全部下拉列表的数据,获取推送类型、改革方式、业务阶段、对象类型列表
 */

/**
 * 树数据
 */

/**
 * 微信信息
 */

/**
 * 用来做表格的选择跟取消选择的
 */

/**
 * antd的tree组件的节点数据
 */

/**
 * 权限枚举 - 同后端的 com.theling.common.constant。ZlPermissions
 */
export var ZlPermissionEnum = /*#__PURE__*/function (ZlPermissionEnum) {
  ZlPermissionEnum[ZlPermissionEnum["PUBLIC"] = 0] = "PUBLIC";
  ZlPermissionEnum[ZlPermissionEnum["PRIVATE"] = 1] = "PRIVATE";
  ZlPermissionEnum[ZlPermissionEnum["LOGIN"] = 2] = "LOGIN";
  ZlPermissionEnum[ZlPermissionEnum["DEPT"] = 3] = "DEPT";
  return ZlPermissionEnum;
}({});
export var ZlPermissionEnumOpts = [{
  label: '公有',
  value: ZlPermissionEnum.PUBLIC,
  key: ZlPermissionEnum.PUBLIC
}, {
  label: '私有',
  value: ZlPermissionEnum.PRIVATE,
  key: ZlPermissionEnum.PRIVATE
}, {
  label: '登录后可以查看',
  value: ZlPermissionEnum.LOGIN,
  key: ZlPermissionEnum.LOGIN
}];

/**
 * 数字有效性
 */

export var IValidityNumOpts = [{
  label: '无效',
  value: 0,
  key: 0
}, {
  label: '有效',
  value: 1,
  key: 1
}];
export var IYesNoNumOpts = [{
  label: '否',
  value: 0,
  key: 0
}, {
  label: '是',
  value: 1,
  key: 1
}];

/**
 * bool有效性
 */

export var IValidityBoolOpts = [{
  label: '无效',
  value: false,
  key: 0
}, {
  label: '有效',
  value: true,
  key: 1
}];

/**
 * 动态的数据
 */

/**
 * 标签的选择数据
 */

/**
 * 基本的自定义属性对象
 */