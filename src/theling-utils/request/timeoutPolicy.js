function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/** 普通 HTTP 走默认超时；SSE 流式请求不套超时。 */
export var shouldApplyHttpTimeout = function shouldApplyHttpTimeout(reqType) {
  return reqType !== 'sse';
};

/** fetch AbortError / axios 取消，均视为超时或主动取消。 */
export var isAbortLikeError = function isAbortLikeError(error) {
  if (!error || _typeof(error) !== 'object') {
    return false;
  }
  var e = error;
  return e.code === 'ERR_CANCELED' || e.name === 'CanceledError' || e.name === 'AbortError';
};