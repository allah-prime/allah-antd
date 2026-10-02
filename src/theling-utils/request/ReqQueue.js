function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import zlhash from "../utils/zlhash";
// 请求队列，最多存储30个请求，超过30个请求，最早的请求将被删除
var ReqQueue = /*#__PURE__*/function () {
  function ReqQueue(p) {
    _classCallCheck(this, ReqQueue);
    if (!ReqQueue.instance) {
      ReqQueue.instance = this;
      ReqQueue.maxQueueLength = p.maxQueueLength || 30;
      ReqQueue.cacheMethod = p.cacheMethod || function () {};
    }
    return ReqQueue.instance;
  }
  _createClass(ReqQueue, null, [{
    key: "init",
    value: function init(p) {
      return this.getInstance(p);
    }
  }, {
    key: "getInstance",
    value: function getInstance(p) {
      if (!this.instance) {
        if (window) {
          window.zlReqQueue = this.reqQueue;
        }
        return this.instance = new ReqQueue(p);
      }
      return this.instance;
    }

    /**
     * 获取下日志队列
     */
  }, {
    key: "getReqQueue",
    value: function getReqQueue() {
      return this.reqQueue;
    }

    /**
     * 添加或者更新一条记录
     * @param data
     * @param key
     */
  }, {
    key: "addReqQueue",
    value: function addReqQueue(data, key) {
      if (!key) {
        key = zlhash.getUuid();
      }
      var keys = Object.keys(this.reqQueue);
      if (keys.length >= this.maxQueueLength) {
        // 移除keys里面的第一个
        delete this.reqQueue[keys[0]];
      }
      // 获取下当前的时间戳
      var now = new Date().getTime();
      if (!this.reqQueue[key]) {
        this.reqQueue[key] = {};
      }
      this.reqQueue[key][now] = data;
      this.cacheMethod(this.reqQueue);
    }
  }]);
  return ReqQueue;
}();
_defineProperty(ReqQueue, "instance", void 0);
_defineProperty(ReqQueue, "reqQueue", {});
_defineProperty(ReqQueue, "maxQueueLength", 30);
_defineProperty(ReqQueue, "cacheMethod", function () {});
export { ReqQueue as default };