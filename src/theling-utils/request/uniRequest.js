function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 把 headers 转成 uni.request 需要的纯对象，剔除 undefined/null 和空串。
 * 避免 uni-h5 normalizeContentType 对 undefined 做 indexOf 时崩溃。
 */
var sanitizeUniHeaders = function sanitizeUniHeaders(headers) {
  var out = {};
  if (!headers) return out;
  // AxiosHeaders 实例支持 forEach
  if (typeof headers.forEach === 'function') {
    try {
      headers.forEach(function (val, key) {
        if (val !== undefined && val !== null && val !== '') {
          out[key] = String(val);
        }
      });
      if (Object.keys(out).length) return out;
    } catch (_unused) {
      // ignore, fallback
    }
  }
  // 普通对象
  try {
    Object.keys(headers).forEach(function (key) {
      var val = headers[key];
      if (val !== undefined && val !== null && val !== '') {
        out[key] = String(val);
      }
    });
  } catch (_unused2) {
    // ignore
  }
  return out;
};

/**
 * 兼容 SSE 的 uni.request 直接封装（保留旧签名，避免调用方兼容问题）
 */
export var getUniSseReq = function getUniSseReq(url, config, event) {
  return uni.request(_objectSpread(_objectSpread({
    url: url,
    method: 'POST',
    header: _objectSpread({
      Accept: 'text/event-stream'
    }, config.header || {}),
    data: config.data,
    enableChunked: true,
    responseType: 'arraybuffer'
  }, event), {}, {
    timeout: 0
  }));
};

/**
 * 纯 uni.request Promise wrapper。
 * 只关心 request 语义，不依赖 axios，避免 axios 内部默认 headers（含 Content-Type: undefined）
 * 或 buildURL 等隐藏路径踩到 undefined.indexOf 之类的坑。
 *
 * 输入是一个类 axios config：{ url, method, headers, data, responseType, params?, ... }
 * 输出类 axios response：{ data, status, statusText, headers, config, request }
 */
var uniRequest = function uniRequest() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new Promise(function (resolve, reject) {
    var url = config.url;
    if (!url) {
      var err = new Error('无效的请求地址');
      err.code = 'ERR_BAD_REQUEST';
      err.config = config;
      reject(err);
      return;
    }
    if (typeof uni === 'undefined' || typeof uni.request !== 'function') {
      var _err = new Error('当前环境不支持 uni.request');
      _err.code = 'ERR_NOT_SUPPORT';
      _err.config = config;
      reject(_err);
      return;
    }
    uni.request({
      method: (config.method || 'get').toString().toUpperCase(),
      url: url,
      header: sanitizeUniHeaders(config.headers),
      data: config.data,
      responseType: config.responseType,
      timeout: config.timeout,
      withCredentials: !!config.withCredentials,
      complete: function complete(response) {
        var status = response.statusCode;
        var res = {
          data: response.data,
          status: status,
          statusText: response.errMsg,
          headers: response.header,
          config: config,
          request: response
        };
        if (typeof status === 'number' && status >= 200 && status < 300) {
          resolve(res);
        } else {
          var _err2 = new Error(response.errMsg || "Request failed with status code ".concat(status));
          _err2.code = status ? 'ERR_BAD_RESPONSE' : 'ERR_NETWORK';
          _err2.config = config;
          _err2.response = res;
          reject(_err2);
        }
      },
      fail: function fail(err) {
        var e = new Error(err && err.errMsg ? err.errMsg : '网络请求失败');
        e.code = 'ERR_NETWORK';
        e.config = config;
        e.request = err;
        reject(e);
      }
    });
  });
};
export default uniRequest;