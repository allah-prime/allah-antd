function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * 新增的场景下，用户在html中插入的图片是使用的server的地址，也就是用的cosKey来进行的。
 * <br />
 * 在详情显示的时候，根据网络的情况，需要将对应的接口转成外网或者内网的接口
 * <br />
 * 如果是外网，那么就需要将server的接口转成cos的接口
 * <br />
 * 如果是内网，那么就更新server的接口
 * <br />
 * 所有的富文本的img都存这种类型的：http://theling.top:9002/cloud-service/api/file/cross/signUrl?fileId=e2b42debf56066fd349afe97f775148f&token=07e30d80cccd38fb3ffc4eecb8b6918343e6b07e1666059496947
 * <br />
 * 然后根据实际的网页进行转换！！！
 * <br />
 * Notion / ANotion 附件落盘格式同样处理：
 * video[src] / audio[src] / a[data-type="file"][href]
 */

/**
 * 提取md中的图片标签
 */
var mdImageUrlRegex = /!\[(.*?)\]\((.*?)\)/gm;

/**
 * 提取图片标签中的url
 */
var mdUrlRegex = /(!\[(.*?)]\()(.*?)(\))/;

/** HTML 媒体标签：img / video / audio */
var htmlMediaTagRegex = /<(img|video|audio)\b[^>]*>/gi;
/** Notion 附件锚点 */
var htmlFileAnchorRegex = /<a\b[^>]*data-type=["']file["'][^>]*>/gi;
var srcAttrRegex = /\bsrc=['"]?([^'"\s>]+)['"]?/i;
var hrefAttrRegex = /\bhref=['"]?([^'"\s>]+)['"]?/i;

/**
 * 解析url路径得到对应的文件key或者id
 * @param url 资源的地址
 */
export var parseUrlPath = function parseUrlPath(url) {
  if (url.startsWith('http')) {
    var urlObj = new URL(url);
    // 如果pathname包含cloud-service，那么是自己的接口，fileId在params里面
    if (url.indexOf('myqcloud.com') > -1) {
      // 如果不包含cloud-service，那么是第三方的接口，那么pathname就是coskey
      // urlObj.pathname删除第一个/，然后替换掉所有的/
      var cosKey = urlObj.pathname.replace(/^\//, '');
      return {
        cosKey: cosKey,
        type: 'cos'
      };
    }
    return {
      cosKey: urlObj.searchParams.get('cosKey') || urlObj.searchParams.get('fileId') || '',
      type: 'server'
    };
  }
  return {
    cosKey: url,
    type: 'server'
  };
};

/**
 * 从 HTML 片段中收集媒体 URL（img/video/audio src + a[data-type=file] href）
 */
var collectHtmlMediaUrls = function collectHtmlMediaUrls(html) {
  var urls = [];
  var pushFromMatch = function pushFromMatch(tag, attrReg) {
    var m = tag.match(attrReg);
    if (m !== null && m !== void 0 && m[1]) {
      urls.push(m[1]);
    }
  };
  var match;
  var mediaReg = new RegExp(htmlMediaTagRegex.source, 'gi');
  while ((match = mediaReg.exec(html)) !== null) {
    pushFromMatch(match[0], srcAttrRegex);
  }
  var fileReg = new RegExp(htmlFileAnchorRegex.source, 'gi');
  while ((match = fileReg.exec(html)) !== null) {
    pushFromMatch(match[0], hrefAttrRegex);
  }
  return urls;
};

/**
 * 将内容中出现的 oldUrl 全部替换为 newUrl（仅替换 URL 字符串本身）
 */
var replaceUrlInContent = function replaceUrlInContent(content, oldUrl, newUrl) {
  if (!oldUrl || oldUrl === newUrl) {
    return content;
  }
  return content.split(oldUrl).join(newUrl);
};

/**
 * 解析富文本，得到所有的图片/附件的key
 * <br />
 * 这是在存储的时候要用到的，从html里面得到所有文件的对象，然后进行关联就好了
 * @param html 富文本
 */
export var getFileKeyListFromHtml = function getFileKeyListFromHtml(html) {
  if (!html) {
    return [];
  }
  return collectHtmlMediaUrls(html).map(function (url) {
    return parseUrlPath(url);
  });
};
export var getUrlFormMdImg = function getUrlFormMdImg(urlTag) {
  if (!urlTag) {
    return '';
  }
  var urlObj = urlTag.match(mdUrlRegex);
  if (urlObj) {
    return urlObj[3];
  }
  return '';
};
export var getAltFormMdImg = function getAltFormMdImg(urlTag) {
  if (!urlTag) {
    return '';
  }
  var urlObj = urlTag.match(mdUrlRegex);
  if (urlObj) {
    return urlObj[2] || '';
  }
  return '';
};

/**
 * 解析Markdown，得到所有图片/附件的cosKey
 * <br />
 * 含 MD 图片语法，以及嵌入的 Notion HTML 媒体片段
 */
export var getFileKeyListFromMarkdown = function getFileKeyListFromMarkdown(markdown) {
  if (!markdown) {
    return [];
  }
  var urls = [];
  var mdReg = new RegExp(mdImageUrlRegex.source, 'gm');
  var matches;
  while ((matches = mdReg.exec(markdown)) !== null) {
    urls.push(getUrlFormMdImg(matches[0]));
  }
  urls.push.apply(urls, _toConsumableArray(collectHtmlMediaUrls(markdown)));
  return urls.filter(Boolean).map(function (url) {
    return parseUrlPath(url);
  });
};

// 替换url的域名和前面的http或https
export var replaceUrlDomain = function replaceUrlDomain(url, domain) {
  if (url.indexOf('http') === 0) {
    return url.replace(/http(s)?:\/\/[^/]+/, domain);
  }
  return url;
};

// 富文本的url替换规则
var defRrlVer = function defRrlVer(src) {
  return src.includes('cloud-service/api/file/cross') || src.includes('myqcloud.com');
};

/**
 * 保存前：把 HTML 中的临时签 URL 换成 cosKey（含 img/video/audio/file 锚点）
 */
export var updateHtmlImgUrl = function updateHtmlImgUrl(html) {
  var urlVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defRrlVer;
  if (!html) return html;
  var urls = collectHtmlMediaUrls(html);
  var _iterator = _createForOfIteratorHelper(urls),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var src = _step.value;
      if (urlVer(src)) {
        var cosObj = parseUrlPath(src);
        if (cosObj.cosKey) {
          html = replaceUrlInContent(html, src, cosObj.cosKey);
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return html;
};

/**
 * 详情/编辑回显：把 HTML 中的 cosKey（非 http）换签为可访问 URL
 */
export var infoHtmlImgUrl = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(html, urlReq) {
    var urls, _iterator2, _step2, src, newUrl;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (html) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", html);
        case 2:
          urls = _toConsumableArray(new Set(collectHtmlMediaUrls(html)));
          _iterator2 = _createForOfIteratorHelper(urls);
          _context.prev = 4;
          _iterator2.s();
        case 6:
          if ((_step2 = _iterator2.n()).done) {
            _context.next = 15;
            break;
          }
          src = _step2.value;
          if (src.startsWith('http')) {
            _context.next = 13;
            break;
          }
          _context.next = 11;
          return urlReq(src);
        case 11:
          newUrl = _context.sent;
          if (newUrl) {
            html = replaceUrlInContent(html, src, newUrl);
          }
        case 13:
          _context.next = 6;
          break;
        case 15:
          _context.next = 20;
          break;
        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](4);
          _iterator2.e(_context.t0);
        case 20:
          _context.prev = 20;
          _iterator2.f();
          return _context.finish(20);
        case 23:
          return _context.abrupt("return", html);
        case 24:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 17, 20, 23]]);
  }));
  return function infoHtmlImgUrl(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var walkJsonMediaNodes = function walkJsonMediaNodes(nodes, visitor) {
  if (!(nodes !== null && nodes !== void 0 && nodes.length)) {
    return;
  }
  var _iterator3 = _createForOfIteratorHelper(nodes),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _node$content;
      var _node = _step3.value;
      if (_node.type === 'image' || _node.type === 'file') {
        visitor(_node);
      }
      if ((_node$content = _node.content) !== null && _node$content !== void 0 && _node$content.length) {
        walkJsonMediaNodes(_node.content, visitor);
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
};

/**
 * 保存前：JSON 文档中 image / file 节点的临时签 → cosKey
 */
export var updateJsonImgUrl = function updateJsonImgUrl(json) {
  var urlVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defRrlVer;
  if (!json) return json;
  walkJsonMediaNodes(json.content, function (node) {
    var _node$attrs;
    var imgUrl = (_node$attrs = node.attrs) === null || _node$attrs === void 0 ? void 0 : _node$attrs.src;
    if (imgUrl && urlVer(imgUrl)) {
      var _parseUrlPath = parseUrlPath(imgUrl),
        cosKey = _parseUrlPath.cosKey;
      if (cosKey && node.attrs) {
        node.attrs.src = cosKey;
      }
    }
  });
  return json;
};

/**
 * 详情/编辑回显：JSON 文档中 image / file 节点换签
 */
export var infoJsonImgUrl = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(json, urlReq, bucket) {
    var tasks;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (json) {
            _context3.next = 2;
            break;
          }
          return _context3.abrupt("return", json);
        case 2:
          tasks = [];
          walkJsonMediaNodes(json.content, function (node) {
            var _node$attrs2;
            var src = (_node$attrs2 = node.attrs) === null || _node$attrs2 === void 0 ? void 0 : _node$attrs2.src;
            if (!src) {
              return;
            }
            var _parseUrlPath2 = parseUrlPath(src),
              cosKey = _parseUrlPath2.cosKey;
            if (!cosKey) {
              return;
            }
            tasks.push(_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
              var newUrl;
              return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return urlReq(cosKey, bucket);
                  case 2:
                    newUrl = _context2.sent;
                    if (newUrl && node.attrs) {
                      node.attrs.src = newUrl;
                    }
                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }))());
          });
          _context3.next = 6;
          return Promise.all(tasks);
        case 6:
          return _context3.abrupt("return", json);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function infoJsonImgUrl(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * 保存前：Markdown 图片 + 嵌入的 Notion HTML 媒体 → cosKey
 */
export var updateMarkdownImgUrl = function updateMarkdownImgUrl(markdown) {
  var urlVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defRrlVer;
  if (!markdown) return markdown;
  var mdReg = new RegExp(mdImageUrlRegex.source, 'gm');
  var matches = _toConsumableArray(markdown.matchAll(mdReg));
  var _iterator4 = _createForOfIteratorHelper(matches),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var match = _step4.value;
      var mdImg = match[0];
      var alt = match[1] || '';
      var imgUrl = match[2] || getUrlFormMdImg(mdImg);
      if (imgUrl && urlVer(imgUrl)) {
        var _parseUrlPath3 = parseUrlPath(imgUrl),
          cosKey = _parseUrlPath3.cosKey;
        if (cosKey) {
          markdown = markdown.replace(mdImg, "![".concat(alt, "](").concat(cosKey, ")"));
        }
      }
    }

    // Notion 附件以 HTML 片段嵌在 Markdown 中
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return updateHtmlImgUrl(markdown, urlVer);
};

/**
 * 详情/编辑回显：Markdown 中的 cosKey 换签（含嵌入 HTML 媒体）
 */
export var infoMarkdownImgUrl = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(markdown, urlReq, bucket) {
    var mdReg, matches, _iterator5, _step5, match, mdImg, alt, imgUrl, newUrl, _parseUrlPath4, cosKey, _newUrl;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (markdown) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return", markdown);
        case 2:
          mdReg = new RegExp(mdImageUrlRegex.source, 'gm');
          matches = _toConsumableArray(markdown.matchAll(mdReg));
          _iterator5 = _createForOfIteratorHelper(matches);
          _context4.prev = 5;
          _iterator5.s();
        case 7:
          if ((_step5 = _iterator5.n()).done) {
            _context4.next = 28;
            break;
          }
          match = _step5.value;
          mdImg = match[0];
          alt = match[1] || '';
          imgUrl = match[2] || getUrlFormMdImg(mdImg); // 应对 imgUrl 判断：纯 cosKey 或可解析出 cosKey 的地址
          if (imgUrl) {
            _context4.next = 14;
            break;
          }
          return _context4.abrupt("continue", 26);
        case 14:
          if (imgUrl.startsWith('http')) {
            _context4.next = 20;
            break;
          }
          _context4.next = 17;
          return urlReq(imgUrl, bucket);
        case 17:
          newUrl = _context4.sent;
          if (newUrl) {
            markdown = markdown.replace(mdImg, "![".concat(alt, "](").concat(newUrl, ")"));
          }
          return _context4.abrupt("continue", 26);
        case 20:
          _parseUrlPath4 = parseUrlPath(imgUrl), cosKey = _parseUrlPath4.cosKey;
          if (!(cosKey && (imgUrl.includes('myqcloud.com') || imgUrl.includes('cloud-service/api/file/cross')))) {
            _context4.next = 26;
            break;
          }
          _context4.next = 24;
          return urlReq(cosKey, bucket);
        case 24:
          _newUrl = _context4.sent;
          if (_newUrl) {
            markdown = markdown.replace(mdImg, "![".concat(alt, "](").concat(_newUrl, ")"));
          }
        case 26:
          _context4.next = 7;
          break;
        case 28:
          _context4.next = 33;
          break;
        case 30:
          _context4.prev = 30;
          _context4.t0 = _context4["catch"](5);
          _iterator5.e(_context4.t0);
        case 33:
          _context4.prev = 33;
          _iterator5.f();
          return _context4.finish(33);
        case 36:
          _context4.next = 38;
          return infoHtmlImgUrl(markdown, function (key) {
            return urlReq(key, bucket);
          });
        case 38:
          markdown = _context4.sent;
          return _context4.abrupt("return", markdown);
        case 40:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[5, 30, 33, 36]]);
  }));
  return function infoMarkdownImgUrl(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * 从url中得到文件的信息
 * @param url
 */
export var getFileNameFormUrl = function getFileNameFormUrl(url) {
  var info = {
    name: '',
    suffix: ''
  };
  if (url) {
    // 得到文件名称
    var nameUrl = url.substring(url.lastIndexOf('/') + 1);
    // 删除name中?后面的内容
    var nameStr = nameUrl.split('?')[0];
    // 得到文件后缀
    var index = nameStr.lastIndexOf('.');
    // index前面的是名字，后面的是后缀
    info.name = nameStr.substring(0, index);
    info.suffix = nameStr.substring(index + 1);
  }
  return info;
};