function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import { codeMessage, defOption } from "./httpCode";
import ReqQueue from "./ReqQueue";
import { buildQueryParams } from "../utils/ObjectUtils";
import cookieUtils from "./cookieUtils";
import StringUtils from "../utils/StringUtils";
var isExit = function isExit(str) {
  if (str === '') {
    return false;
  }
  if (str === 0) {
    return true;
  }
  return str;
};

// 定义一个Promise的延迟器
export var zlDelay = function zlDelay(time) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve('');
    }, time);
  });
};

/**
 * 参数去空
 * @param params 参数
 * @param deleteField 需要删除的字段
 * @param deleteTimeField 是否删除时间字段
 */
var buildParamsNull = function buildParamsNull(params, deleteField, deleteTimeField) {
  var defKeys = [];
  if (deleteTimeField) {
    defKeys.push('createTime', 'creTime', 'updateTime', 'createDate', 'updateDate');
  }
  if (Array.isArray(deleteField)) {
    defKeys.push.apply(defKeys, _toConsumableArray(deleteField));
  }
  var newParams = {};
  if (params) {
    Object.keys(params).forEach(function (key) {
      // 如果字段在defKeys里面，那就直接跳过，不赋值了
      if (defKeys.length > 0 && defKeys.includes(key)) {
        return;
      }
      if (isExit(params[key])) {
        newParams[key] = params[key];
      }
    });
  }
  return newParams;
};

/**
 * 请求拦截
 * @param url 请求地址
 * @param options 请求配置
 * @return {{options: *, url: *}}
 */
export var requestErrorIntercept = function requestErrorIntercept(url, options) {
  var _newOptions$method;
  // 覆盖默认值
  var newOptions = _objectSpread(_objectSpread({}, defOption), options);
  var isFile = newOptions.isFile;
  // 如果是文件，那就是说明要下载文件
  if (isFile) {
    // 设置响应类型
    newOptions.responseType = 'blob';
  }
  // 如果不是上传文件
  if (newOptions.manner !== 'file') {
    var _newOptions$params;
    var noFilterField = {};
    if (Array.isArray(newOptions.noFilterField)) {
      newOptions.noFilterField.forEach(function (item) {
        noFilterField[item] = newOptions.params[item];
      });
    }
    if (newOptions.isFilter) {
      // 去除无效的参数
      newOptions.params = buildParamsNull(newOptions.params, newOptions.deleteField, newOptions.deleteTimeField);
    }
    // 合并下
    newOptions.params = _objectSpread(_objectSpread({}, noFilterField), newOptions.params);
    var sort = (_newOptions$params = newOptions.params) === null || _newOptions$params === void 0 ? void 0 : _newOptions$params.sort;
    if (sort && _typeof(sort) === 'object' && !Array.isArray(sort)) {
      newOptions.params.sort = Object.fromEntries(Object.entries(sort).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];
        return [k.replace(/[A-Z]/g, function (m) {
          return "_".concat(m.toLowerCase());
        }), v];
      }));
    }
  }

  // 处理cookie相关逻辑
  if (typeof document !== 'undefined') {
    // 根据cookieMode决定withCredentials的设置
    var cookieMode = newOptions.cookieMode || 'header';
    if (cookieMode === 'credentials' || cookieMode === 'both') {
      // 使用withCredentials方式（需要服务器CORS支持）
      newOptions.withCredentials = true;
    } else if (newOptions.withCredentials === true) {
      // 用户明确设置了withCredentials为true
      newOptions.withCredentials = true;
    } else {
      // 默认不使用withCredentials，避免CORS问题
      newOptions.withCredentials = false;
    }

    // 处理自定义cookie
    if (newOptions.cookies && Object.keys(newOptions.cookies).length > 0) {
      if (cookieMode === 'credentials' || cookieMode === 'both') {
        // 方式1：设置到浏览器cookie（受同源策略限制）
        Object.entries(newOptions.cookies).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
            name = _ref4[0],
            value = _ref4[1];
          cookieUtils.set(name, value);
        });
      }
      if (cookieMode === 'header' || cookieMode === 'both') {
        // 方式2：通过请求头传递cookie值（推荐，避免CORS限制）
        if (!newOptions.headers) {
          newOptions.headers = {};
        }
        var cookieString = Object.entries(newOptions.cookies).map(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
            name = _ref6[0],
            value = _ref6[1];
          return "".concat(name, "=").concat(value);
        }).join('; ');
        var headerName = newOptions.cookieHeaderName || 'X-Custom-Cookie';
        newOptions.headers[headerName] = cookieString;
      }
    }

    // 处理CSRF token
    if (newOptions.autoCSRF) {
      var csrfToken = cookieUtils.read(newOptions.csrfCookieName || 'csrftoken');
      if (csrfToken) {
        if (!newOptions.headers) {
          newOptions.headers = {};
        }
        newOptions.headers[newOptions.csrfHeaderName || 'X-CSRFToken'] = csrfToken;
      }
    }
  }
  if (typeof sessionStorage !== 'undefined') {
    // 获取要添加token的url（兼容误用 ZlStorage 包装后的值）
    var tokenUrl = sessionStorage.getItem('tokenUrl') || '';
    try {
      var parsed = JSON.parse(tokenUrl);
      if ((parsed === null || parsed === void 0 ? void 0 : parsed.type) === 'string' && typeof parsed.data === 'string') {
        tokenUrl = parsed.data;
      }
    } catch (_unused) {
      // 原始字符串，忽略
    }
    // 请求的地址判断
    if (tokenUrl && url && url.search(tokenUrl) !== -1) {
      // 如果没有配置请求头，就给一个默认的对象
      if (!newOptions.headers) {
        newOptions.headers = {};
      }
      if (!newOptions.headers.Authorization) {
        var authorization = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken') || '';
        try {
          var _parsed = JSON.parse(authorization);
          if ((_parsed === null || _parsed === void 0 ? void 0 : _parsed.type) === 'string' && typeof _parsed.data === 'string') {
            authorization = _parsed.data;
          }
        } catch (_unused2) {
          // raw JWT，忽略
        }
        if (authorization) {
          newOptions.headers.Authorization = authorization;
        }
        delete newOptions.headers.authorization;
      }
    } else {
      delete newOptions.headers.usertoken;
    }
  }
  newOptions.method = (_newOptions$method = newOptions.method) === null || _newOptions$method === void 0 ? void 0 : _newOptions$method.toLowerCase();
  if (newOptions.method === 'get') {
    if (_typeof(newOptions.params) === 'object') {
      // 如果是get请求，那就把参数拼接到url上
      url = "".concat(url, "?").concat(buildQueryParams(newOptions.params));
      delete newOptions.params;
    }
  } else if (newOptions.manner === 'json') {
    newOptions.requestType = 'json';
    // json格式
    newOptions.headers = _objectSpread(_objectSpread({}, newOptions.headers), {
      'Content-Type': 'application/json;charset=utf-8'
    });
    if (!newOptions.params) {
      newOptions.params = {};
    }
    if (options.reqEnv === 'rn') {
      newOptions.body = JSON.stringify(newOptions.params);
    } else {
      newOptions.data = newOptions.params;
    }
    delete newOptions.params;
  } else if (newOptions.manner === 'form') {
    newOptions.requestType = 'form';
    if (_typeof(newOptions.params) === 'object' && Object.keys(newOptions.params).length > 0) {
      // json格式
      newOptions.headers = _objectSpread(_objectSpread({}, newOptions.headers), {
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      if (newOptions.reqEnv === 'rn') {
        newOptions.body = buildQueryParams(newOptions.params);
      } else {
        newOptions.data = buildQueryParams(newOptions.params);
      }
    }
    delete newOptions.params;
  }
  // 如果是上传的文件
  if (newOptions.manner === 'file') {
    // 完整表单
    var formData = new FormData();
    if (Array.isArray(newOptions.params)) {
      newOptions.params.forEach(function (item) {
        if (newOptions.reqEnv === 'rn') {
          formData.append('file', {
            uri: item.uri,
            type: 'application/octet-stream',
            name: item.name
          });
          formData.append('zlFileId', item.zlFileId);
        } else {
          formData.append('file', item);
        }
      });
    } else if (newOptions.reqEnv === 'rn') {
      formData.append('file', {
        uri: newOptions.params.uri,
        type: 'application/octet-stream',
        name: newOptions.params.name
      });
      formData.append('zlFileId', newOptions.params.zlFileId);
    } else {
      formData.append('file', newOptions.params);
      formData.append('zlFileId', newOptions.params.zlFileId);
    }
    newOptions.params = formData;
    newOptions.data = formData;
    newOptions.body = formData;
    // 设置请求头为：multipart/form-data;charset=utf-8
    newOptions.headers = _objectSpread(_objectSpread({}, newOptions.headers), {
      'Content-Type': 'multipart/form-data;charset=utf-8'
    });
  }
  delete newOptions.setToken;
  newOptions.url = url;
  return newOptions;
};

/** 基于 Unicode 分布使用的颜色表，用于首字取色 */
export var colorList = ['#2db7f5', '#87d068', '#108ee9', '#f50', '#e6f7ff', '#d4387e', '#ffc1a5', '#781db3', '#096de0', '#e79908', '#52c41a', '#fa8c16', '#eb2f96', '#13c2c2', '#722ed1', '#faad14', '#a0d911', '#2f54eb', '#f759ab', '#597ef7', '#9254de', '#36cfc9', '#ff7a45', '#ff85c0', '#b37feb', '#5cdbd3', '#69c0ff', '#95de64', '#ffd666', '#ff9c6e', '#85a5ff', '#adc6ff'];

/**
 * 从 colorList 中随机获取一个颜色
 * @returns 随机颜色值（十六进制字符串）
 */
export var getRandomColor = function getRandomColor() {
  var random = Math.floor(Math.random() * colorList.length);
  return colorList[random];
};

/**
 * 根据字符串首字的 Unicode 码点返回固定颜色，首字相同则颜色相同
 * @param str 用于生成颜色的字符串（如用户名、标签名）
 * @returns 对应的颜色值（十六进制字符串）
 */
export var getColorByString = function getColorByString(str) {
  if (!str || typeof str !== 'string') {
    return colorList[0];
  }
  var firstCharCode = str.charCodeAt(0);
  var index = firstCharCode % colorList.length;
  return colorList[index];
};

/**
 * 请求错误拦截——后台返回错误数据的拦截，到这里的话，相当于http状态码的校验已经通过了
 * @param data 后台传递的结果数据
 * @param url 请求的地址
 * @param newOptions 请求的配置项
 * @param callback 回调函数
 */
export var responseErrorIntercept = function responseErrorIntercept(data, newOptions, url, callback) {
  if (newOptions.cacheLog && !newOptions.isFile) {
    // 存储下日志
    ReqQueue.addReqQueue(data, newOptions.reqUuid);
  }
  // 判断是否是开发环境
  if (newOptions.showLog && !newOptions.isFile) {
    console.log("%c ".concat(new Date().toLocaleString(), "\u672C\u6B21\u8BF7\u6C42\u4FE1\u606F\uFF1A"), "color:".concat(getRandomColor()), {
      url: url,
      req: newOptions.params,
      res: data,
      opt: newOptions
    });
  }
  // 如果有自定义回调，使用自定义回调即可
  if (callback) {
    return callback(data);
  }
  var jsonData = null;
  if (typeof data === 'undefined' || data === null) {
    // 没有返回数据
    data = {
      code: 504,
      msg: codeMessage[504]
    };
  }
  // 判断是否文件下载
  if (newOptions.isFile) {
    jsonData = data;
  } else if (Number(data.code) === 0) {
    // 缓存操作
    if (newOptions.cacheData && newOptions.cacheKey && typeof sessionStorage !== 'undefined') {
      newOptions.cacheControl = newOptions.cacheControl || 30000;
      var cacheData = {
        // 30秒内不会有新请求出去
        expires: new Date().getTime() + newOptions.cacheControl,
        data: data.result
      };
      sessionStorage.setItem(newOptions.cacheKey, JSON.stringify(cacheData));
    }
    jsonData = data.result;
  } else {
    var status = data.code || data.status;
    var errorData = {
      msg: data.msg || data.errmsg || codeMessage[status],
      url: url,
      status: status,
      code: status,
      statusText: data.msg
    };
    return Promise.reject(_objectSpread(_objectSpread({}, data), errorData));
  }
  if (newOptions.resNullReplace) {
    StringUtils.replaceEmpty(jsonData, newOptions.resNullReplace);
  }
  if (newOptions.resReplaceField) {
    StringUtils.replaceFieldsEmpty(jsonData, newOptions.resReplaceField, newOptions.resNullReplace);
  }
  // 返回数据
  return jsonData;
};

/**
 * 处理请求列表的参数 - 分页和排序参数
 * @param v 参数
 * @param sort 排序
 */
export var handleReqListParams = function handleReqListParams(v, sort) {
  if (v.current) {
    v.pageNum = v.current;
  }
  if (sort && Object.keys(sort).length > 0) {
    var newSort = {};
    Object.keys(sort).forEach(function (key) {
      newSort[key] = sort[key] === 'ascend';
    });
    v.sort = newSort;
  }
  return v;
};