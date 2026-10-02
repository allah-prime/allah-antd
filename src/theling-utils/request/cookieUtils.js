function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Cookie操作工具类
 * 提供cookie的读取、设置、删除等功能
 */
var cookieUtils = {
  /**
   * 读取指定名称的cookie值
   * @param name cookie名称
   * @returns cookie值，如果不存在则返回null
   */
  read: function read(name) {
    var match = document.cookie.match(new RegExp("(^|;\\s*)(".concat(name, ")=([^;]*)")));
    return match ? decodeURIComponent(match[3]) : null;
  },
  /**
   * 设置cookie
   * @param name cookie名称
   * @param value cookie值
   * @param options cookie选项
   */
  set: function set(name, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var cookieString = "".concat(encodeURIComponent(name), "=").concat(encodeURIComponent(value));
    if (options.expires) {
      if (typeof options.expires === 'number') {
        // 如果是数字，表示天数
        var date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        cookieString += "; expires=".concat(date.toUTCString());
      } else {
        cookieString += "; expires=".concat(options.expires.toUTCString());
      }
    }
    if (options.path) {
      cookieString += "; path=".concat(options.path);
    }
    if (options.domain) {
      cookieString += "; domain=".concat(options.domain);
    }
    if (options.secure) {
      cookieString += '; secure';
    }
    if (options.sameSite) {
      cookieString += "; samesite=".concat(options.sameSite);
    }
    document.cookie = cookieString;
  },
  /**
   * 删除指定名称的cookie
   * @param name cookie名称
   * @param options cookie选项（path和domain需要与设置时一致）
   */
  remove: function remove(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.set(name, '', _objectSpread(_objectSpread({}, options), {}, {
      expires: new Date(0)
    }));
  },
  /**
   * 获取所有cookie
   * @returns 包含所有cookie的对象
   */
  getAll: function getAll() {
    var cookies = {};
    if (document.cookie) {
      document.cookie.split(';').forEach(function (cookie) {
        var _cookie$trim$split = cookie.trim().split('='),
          _cookie$trim$split2 = _slicedToArray(_cookie$trim$split, 2),
          name = _cookie$trim$split2[0],
          value = _cookie$trim$split2[1];
        if (name && value) {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
      });
    }
    return cookies;
  },
  /**
   * 检查cookie是否存在
   * @param name cookie名称
   * @returns 是否存在
   */
  exists: function exists(name) {
    return this.read(name) !== null;
  },
  /**
   * 清除所有cookie
   * @param options cookie选项
   */
  clearAll: function clearAll() {
    var _this = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cookies = this.getAll();
    Object.keys(cookies).forEach(function (name) {
      _this.remove(name, options);
    });
  }
};
export default cookieUtils;