function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * 将 SSE 文本数据格式化为对象或字符串
 *
 * 输入示例：
 *   "data: {\"type\": \"tips\", \"content\": \"正在思考\"}"
 * 或多行：
 *   "data: {\"a\":1\n"
 *    + "data: \"b\"}"
 *
 * 处理规则：
 * - 提取每一行以 `data:` 开头的内容并拼接（按规范用换行连接）
 * - 若结果看起来是对象 JSON（以 `{` 开头并以 `}` 结尾），则解析为对象
 * - 返回数组：每个 `data:` 行或每个对象片段为一个元素
 */
export var sseDefaultFormat = function sseDefaultFormat(data) {
  if (data === null) return [];
  if (typeof data !== 'string') return Array.isArray(data) ? data : [data];
  var trimmed = data.trim();
  if (!trimmed) return [];
  var lines = trimmed.split(/\r?\n/);
  var dataLines = lines.filter(function (line) {
    return /^"?data:\s*/i.test(line);
  }).map(function (line) {
    return line.replace(/^"?data:\s*/i, '');
  });
  if (dataLines.length > 0) {
    var _result = [];
    var _iterator = _createForOfIteratorHelper(dataLines),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var payload = _step.value;
        var p = payload.trim();
        if (!p) continue;
        if (p.startsWith('"') && p.endsWith('"')) {
          p = p.slice(1, -1);
        } else if (p.endsWith('"') && p.startsWith('{')) {
          p = p.slice(0, -1);
        }
        if (p.startsWith('{') && p.endsWith('}')) {
          _result.push(JSON.parse(p));
        } else {
          _result.push(p);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return _result;
  }
  var result = [];
  var depth = 0;
  var start = -1;
  var inString = false;
  var escape = false;
  for (var i = 0; i < trimmed.length; i++) {
    var ch = trimmed[i];
    if (inString) {
      if (!escape && ch === '"') inString = false;
      escape = !escape && ch === '\\';
    } else if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        var objStr = trimmed.slice(start, i + 1);
        result.push(JSON.parse(objStr));
        start = -1;
      }
    }
  }
  if (result.length > 0) return result;
  var tokens = trimmed.split(/\s+/).filter(Boolean);
  return tokens;
};