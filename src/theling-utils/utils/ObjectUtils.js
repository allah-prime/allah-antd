function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import ArrayUtil from "./ArrayUtil";

/**
 * 当前页是否是最后一页
 * @param data
 */
export var isLastPageData = function isLastPageData(data) {
  if (Object.keys(data).length > 0) {
    // 判断当前数据是否是最后一条
    var records = data.records,
      current = data.current;
    // 如果当前只有一条数据了并且当前页数大于一页
    return records.length === 1 && current > 1;
  }
  return false;
};

/**
 * 说明：生成翻页配置数据
 * @author tangbin
 * @date 2019/2/14
 * @time 16:36
 * @param data 后台传递的数据
 */
export var buildPageConfig = function buildPageConfig(data) {
  return {
    // 设置第几页
    current: (data === null || data === void 0 ? void 0 : data.current) || 0,
    // 设置每页条数
    pageSize: (data === null || data === void 0 ? void 0 : data.size) || 0,
    // 设置总页数
    total: (data === null || data === void 0 ? void 0 : data.total) || 0,
    // 页数跳转
    showQuickJumper: true,
    //是否支持切换每页的大小
    showSizeChanger: false,
    // 总页数显示
    showTotal: function showTotal(total, range) {
      return "".concat(Number(total).toLocaleString('en-US'), " \u6761\u6570\u636E\u4E2D\u7684\u7B2C").concat(range[0], "-").concat(range[1], "\u6761 ");
    }
  };
};

/**
 * 判断是否照片文件
 * @param filename
 */
export var isImageFile = function isImageFile(filename) {
  var rgx = '(JPEG|jpeg|JPG|jpg|gif|GIF|HEIC|heic|BMP|bmp|PNG|png)$';
  var re = new RegExp(rgx, 'i');
  var fileExt = filename.replace(/.+\./, '');
  return re.test(fileExt);
};

/**
 * 构建钱的数值转换
 * @param str 需要转换的金钱
 * @return {string} 转成功了的
 */
export var buildMoneyStr = function buildMoneyStr(str) {
  if (!str) return 0;
  // 先找到小数点的位置
  var smallMoney = '';
  var money = '';
  if (str.indexOf('.') > 0) {
    smallMoney = str.substring(str.indexOf('.'));
    // 计算前面那部分的钱
    money = str.substring(0, str.indexOf('.'));
  } else {
    money = str;
  }
  var num = (money || 0).toString();
  var result = '';
  while (num.length > 3) {
    result = ",".concat(num.slice(-3)).concat(result);
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result + smallMoney;
  }
  return result;
};

/**
 * 获取url的参数
 */
export function getUrlParams(url) {
  if (!url && typeof window !== 'undefined') {
    url = window.location.href;
  }
  var theRequest = {};
  if (!url) {
    console.error('无效的url');
    return theRequest;
  }
  var queryIndex = url.indexOf('?');
  if (queryIndex !== -1) {
    var str = url.slice(queryIndex + 1);
    var pairs = str.split('&');
    var _iterator = _createForOfIteratorHelper(pairs),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var pair = _step.value;
        var _pair$split = pair.split('='),
          _pair$split2 = _slicedToArray(_pair$split, 2),
          key = _pair$split2[0],
          value = _pair$split2[1];
        if (key) {
          theRequest[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return theRequest;
}

/**
 * 从url中或者指定位置的路径字符串
 * @param url 需要获取的url
 * @param index 如果是-1则是最后一个，如果是0则是第一个
 */
export var getLocalPath = function getLocalPath(url) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
  // url要去掉开头的//和后面的参数。然后用剩下的。如果它有的话
  if (url.startsWith('http')) {
    // 说明是完整的url。现在只需要pathname
    url = new URL(url).pathname;
  }
  // 去掉开头的/
  url = url.replace(/^\//, '');
  // 拆成数组
  var urlArr = url.split('/');
  // 如果是-1则返回最后一个
  if (index === -1) {
    return urlArr[urlArr.length - 1];
  }
  return urlArr[index];
};

/**
 * 从url中或者指定位置的路径字符串
 * @param index 如果是-1则是最后一个，如果是0则是第一个 默认是最后一个
 */
export var getWebLocalPath = function getWebLocalPath() {
  var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
  if (!window) {
    return '';
  }
  return getLocalPath(window.location.pathname, index);
};

/**
 * 刷新url的状态
 */
export function refreshUrlState(data) {
  if (!window) {
    return;
  }
  var searchStr = window.location.href;
  // 问号前面的
  var url = searchStr.substring(0, searchStr.indexOf('?'));
  var newUrl = setUrlParams({
    pathname: url,
    query: data
  });
  window.history.replaceState(null, '', newUrl);
}
/**
 * 设置URL参数
 */
export function setUrlParams(params) {
  var query = params.query;
  var pathname = params.pathname;
  if (_typeof(query) === 'object') {
    // 开始拼接
    Object.keys(query).forEach(function (key, index) {
      // 判断数据是否存在
      if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
        if (index === 0) {
          pathname = "".concat(pathname, "?").concat(key, "=").concat(query[key]);
        } else {
          pathname = "".concat(pathname, "&").concat(key, "=").concat(query[key]);
        }
      }
    });
  }
  return pathname;
}
/**
 * 构建查询参数字符串
 * 该函数接收一个对象，将对象中的键值对转换为URL编码格式的查询参数字符串。
 * 对于对象中的数组值，采用`repeat`模式，即数组中的每个元素都会单独形成一个键值对。
 * @param params - 包含查询参数的对象，键为字符串类型，值可以是基本类型（如string、number、boolean等）或数组类型。
 * @returns 返回拼接好的URL查询参数字符串
 */
export function buildQueryParams(params) {
  var paramPairs = [];
  var _loop = function _loop(key) {
    var value = params[key];
    if (Array.isArray(value)) {
      value.forEach(function (v) {
        paramPairs.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(v)));
      });
    } else {
      paramPairs.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value)));
    }
  };
  for (var key in params) {
    _loop(key);
  }
  return paramPairs.join('&');
}
/**
 * 获取页面URL中的查询参数
 * 该函数通过解析当前页面URL中 `?` 符号后的部分，提取出所有的查询参数，并以对象形式返回。
 * 如果URL中不存在查询参数部分，则返回一个空对象。
 * @returns {Object} 解析后的查询参数对象，键为参数名，值为对应的参数值，重复的参数名将被合并到一个数组中
 */
export function getPageQueryParams(queryString) {
  // 如果没有查询字符串，说明没有查询参数，直接返回一个空对象
  if (!queryString) {
    return {};
  }
  var queryParams = {};
  // 将查询字符串按 '&' 分割成多个键值对
  var pairs = queryString.split('&');
  pairs.forEach(function (pair) {
    // 对每一个键值对按 '=' 分开，分别得到键和值
    var _pair$split3 = pair.split('='),
      _pair$split4 = _slicedToArray(_pair$split3, 2),
      key = _pair$split4[0],
      value = _pair$split4[1];
    // 对键和值进行URL解码
    var decodedKey = decodeURIComponent(key);
    var decodedValue = decodeURIComponent(value);

    // 处理重复参数：如果某个键已经存在于 queryParams 中
    if (queryParams[decodedKey]) {
      // 检查它是不是数组
      if (Array.isArray(queryParams[decodedKey])) {
        // 如果是数组，直接把新值 push 进去
        queryParams[decodedKey].push(decodedValue);
      } else {
        // 如果不是数组，把它变成数组，再把新值 push 进去
        queryParams[decodedKey] = [queryParams[decodedKey], decodedValue];
      }
    } else {
      // 如果是新键，直接赋值
      queryParams[decodedKey] = decodedValue;
    }
  });
  return queryParams;
}
/**
 * 更新URL中的参数 -> 得到新的url
 */
export function getUpdateUrl(href, params) {
  if (!window) {
    return '';
  }
  var searchStr = window.location.href;
  var oldParams = getUrlParams(searchStr);
  var newParams = _objectSpread(_objectSpread({}, oldParams), params);
  // 问号前面的
  var url = searchStr.substring(0, searchStr.indexOf('?'));
  return setUrlParams({
    pathname: url,
    query: newParams
  });
}

/**
 * param 将要转为URL参数字符串的对象
 * prefix URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * return URL参数字符串
 */
export function urlEncode(param, prefix) {
  var encode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (param == null) return '';
  var paramStr = '';
  var t = _typeof(param);
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += "&".concat(prefix, "=").concat(encode ? encodeURIComponent(param) : param);
  } else {
    Object.keys(param).forEach(function (key) {
      key = prefix == null ? key : prefix + (param instanceof Array ? "[".concat(key, "]") : ".".concat(key));
      paramStr += urlEncode(param[key], key, encode);
    });
  }
  return paramStr;
}

/**
 * 将数据中的''转换成指定的字符串
 * @param obj 需要转换的对象
 * @param str 需要转换的字符串，默认是无
 */
export function buildNullStr(obj) {
  var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '无';
  var newObj = obj;
  Object.keys(obj).forEach(function (key) {
    if (obj[key] === '') {
      newObj[key] = str;
    }
  });
  return newObj;
}

/**
 * 获取最近几年的年份
 * @param num 几年？默认三年（向上取）
 */
export function getYearOpt() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  // 新的年份数据
  var newYearList = [];
  // 获得今年的年份
  var year = new Date().getFullYear();
  for (var i = 0; i < num; i += 1) {
    var yearObj = {
      id: year + i,
      text: year + i
    };
    newYearList.push(yearObj);
  }
  return newYearList;
}
/**
 * 获取最近几年的年份
 * @param num 几年？默认三年（向下取）
 */
export function getYearOpts() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  // 新的年份数据
  var newYearList = [];
  // 获得今年的年份
  var year = new Date().getFullYear();
  for (var i = 0; i < num; i += 1) {
    var yearObj = {
      id: year - i,
      text: year - i
    };
    newYearList.push(yearObj);
  }
  return newYearList;
}
/**
 * 从optList中筛选出目标对象
 * @param s 需要筛选的目标字符串
 * @param optList 目标数组
 * @param key 数据的下标
 */
export var getListId = function getListId(s, optList, key) {
  if (optList.length === 0 || !s) return null;
  var classList = optList.filter(function (item) {
    return item.text === s;
  });
  if (classList.length > 0) {
    return classList[0][key];
  }
  return null;
};
export var urlToList = function urlToList(url) {
  if (!url || url === '/') {
    return ['/'];
  }
  var urlList = url.split('/').filter(function (i) {
    return i;
  });
  return urlList.map(function (urlItem, index) {
    return "/".concat(urlList.slice(0, index + 1).join('/'));
  });
};

/**
 * 导入cdn的方法
 * @param url 需要导入的文件
 * @param name 名称
 */
export var importCDN = function importCDN(url, name) {
  return new Promise(function (resolve) {
    var dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = function () {
      resolve(window[name]);
    };
    if (document.head !== null) {
      document.head.appendChild(dom);
    }
  });
};

/**
 * 常用颜色
 */
export var zlColor = ['#5470c6', '#fd6f6f', '#7aad62', '#7ed3f4', '#91c7ae', '#ff915a', '#a868c5', '#fa541c', '#ffa940', '#ffc53d', '#d4b106', '#7cb305', '#08979c', '#1d39c4', '#eb2f96', '#ffdc60'];

/**
 * 将对象的key变成数字
 */
export var objToNum = function objToNum(obj) {
  var newObj = {};
  Object.keys(obj).forEach(function (key) {
    newObj[Number(key)] = obj[key];
  });
  return newObj;
};

/**
 * 等待~
 * @param ms 毫秒
 */
export var zlWait = function zlWait(ms) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(ms);
    }, ms);
  });
};

/**
 * 默认的表格数据
 */
export var defaultTableData = {
  current: 0,
  pages: 0,
  records: [],
  list: [],
  size: 0,
  total: 0
};

/**
 * 给vuex进行刷新的方法
 */
export var refreshState = function refreshState(state, payload) {
  Object.keys(payload).forEach(function (key) {
    if (Array.isArray(payload[key])) {
      state[key] = ArrayUtil.clone(payload[key]);
    } else if (_typeof(payload[key]) === 'object') {
      Object.keys(payload[key]).forEach(function (key2) {
        state[key][key2] = payload[key][key2];
      });
    } else {
      state[key] = payload[key];
    }
  });
};

/**
 * 删除对象里面的时间字段
 */
export var deleteTime = function deleteTime(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var defKeys = ['createTime', 'updateTime', 'createDate', 'updateDate'].concat(_toConsumableArray(keys));
  var newObj = _objectSpread({}, obj);
  defKeys.forEach(function (key) {
    if (newObj[key]) {
      delete newObj[key];
    }
  });
  return newObj;
};

// 枚举转option的函数
var enumToOptions = function enumToOptions(enumObj) {
  var keys = Object.keys(enumObj);
  return keys.map(function (key) {
    return _objectSpread(_objectSpread({}, enumObj[key]), {}, {
      label: enumObj[key].text,
      value: key
    });
  });
};

// 比较两个对象是否相同
var isSameObj = function isSameObj(obj1, obj2) {
  var keys1 = Object.keys(obj1);
  var keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (var i = 0; i < keys1.length; i++) {
    if (obj1[keys1[i]] !== obj2[keys2[i]]) {
      return false;
    }
  }
  return true;
};
export default {
  buildMoneyStr: buildMoneyStr,
  buildPageConfig: buildPageConfig,
  isImageFile: isImageFile,
  getUrlParams: getUrlParams,
  refreshUrlState: refreshUrlState,
  setUrlParams: setUrlParams,
  urlEncode: urlEncode,
  buildNullStr: buildNullStr,
  getYearOpt: getYearOpt,
  getYearOpts: getYearOpts,
  getListId: getListId,
  urlToList: urlToList,
  isLastPageData: isLastPageData,
  zlColor: zlColor,
  zlWait: zlWait,
  importCDN: importCDN,
  defaultTableData: defaultTableData,
  getUpdateUrl: getUpdateUrl,
  refreshState: refreshState,
  deleteTime: deleteTime,
  enumToOptions: enumToOptions
};