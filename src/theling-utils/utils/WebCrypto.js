function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 * 对称加解密工具
 *
 * 默认使用浏览器原生 Web Crypto API（AES-GCM），
 * 传第二个参数 useCryptoJS=true 则使用 crypto-js（兼容旧数据）。
 *
 * 密文自动带前缀标识，解密时自动识别：
 *   "W:..." → WebCrypto 加密
 *   "C:..." → crypto-js 加密
 *   无前缀 → 尝试 crypto-js（兼容旧数据）
 *
 * @example
 *   const cipher = await WebCrypto.encrypt("hello", "my-key");
 *   const plain  = await WebCrypto.decrypt(cipher, "my-key");
 *
 *   // 使用 crypto-js 模式（兼容旧系统）
 *   const oldCipher = await WebCrypto.encrypt("hello", "my-key", true);
 */

import CryptoJS from 'crypto-js';

// ===== 内部工具 =====

function str2buf(str) {
  return new TextEncoder().encode(str);
}
function buf2str(buf) {
  return new TextDecoder().decode(buf);
}
function buf2base64(buf) {
  var bytes = new Uint8Array(buf);
  var binary = '';
  for (var i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function base642buf(base64) {
  var binary = atob(base64);
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
var DEFAULT_ITERATIONS = 100000;
var FIXED_SALT = new Uint8Array([0x54, 0x68, 0x65, 0x6c, 0x69, 0x6e, 0x67, 0x2d, 0x57, 0x65, 0x62, 0x43, 0x72, 0x79, 0x70, 0x74]);
function deriveKey(_x) {
  return _deriveKey.apply(this, arguments);
} // ===== WebCrypto 模式 =====
function _deriveKey() {
  _deriveKey = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(secret) {
    var subtle, keyMaterial;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          subtle = crypto.subtle;
          _context.next = 3;
          return subtle.importKey('raw', str2buf(secret), 'PBKDF2', false, ['deriveKey']);
        case 3:
          keyMaterial = _context.sent;
          return _context.abrupt("return", subtle.deriveKey({
            name: 'PBKDF2',
            salt: FIXED_SALT,
            iterations: DEFAULT_ITERATIONS,
            hash: 'SHA-256'
          }, keyMaterial, {
            name: 'AES-GCM',
            length: 256
          }, false, ['encrypt', 'decrypt']));
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _deriveKey.apply(this, arguments);
}
function wcEncrypt(_x2, _x3) {
  return _wcEncrypt.apply(this, arguments);
}
function _wcEncrypt() {
  _wcEncrypt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(plainText, secret) {
    var key, iv, cipherBuf, combined;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return deriveKey(secret);
        case 2:
          key = _context2.sent;
          iv = crypto.getRandomValues(new Uint8Array(12)); // eslint-disable-next-line @typescript-eslint/no-explicit-any
          _context2.next = 6;
          return crypto.subtle.encrypt({
            name: 'AES-GCM',
            iv: iv
          }, key, str2buf(plainText));
        case 6:
          cipherBuf = _context2.sent;
          combined = new Uint8Array(12 + cipherBuf.byteLength);
          combined.set(iv);
          combined.set(new Uint8Array(cipherBuf), 12);
          return _context2.abrupt("return", 'W:' + buf2base64(combined.buffer));
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _wcEncrypt.apply(this, arguments);
}
function wcDecrypt(_x4, _x5) {
  return _wcDecrypt.apply(this, arguments);
} // ===== crypto-js 模式 =====
function _wcDecrypt() {
  _wcDecrypt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(cipherText, secret) {
    var raw, combined, iv, data, key, plainBuf;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          raw = cipherText.startsWith('W:') ? cipherText.slice(2) : cipherText;
          combined = base642buf(raw);
          iv = combined.slice(0, 12);
          data = combined.slice(12);
          _context3.next = 6;
          return deriveKey(secret);
        case 6:
          key = _context3.sent;
          _context3.next = 9;
          return crypto.subtle.decrypt({
            name: 'AES-GCM',
            iv: iv
          }, key, data);
        case 9:
          plainBuf = _context3.sent;
          return _context3.abrupt("return", buf2str(plainBuf));
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _wcDecrypt.apply(this, arguments);
}
function cjsEncrypt(plainText, secret) {
  return 'C:' + CryptoJS.AES.encrypt(plainText, secret).toString();
}
function cjsDecrypt(cipherText, secret) {
  var raw = cipherText.startsWith('C:') ? cipherText.slice(2) : cipherText;
  return CryptoJS.AES.decrypt(raw, secret).toString(CryptoJS.enc.Utf8);
}

// ===== 公开 API =====

/**
 * 加密
 * @param plainText 明文
 * @param secret 密钥
 * @param useCryptoJS 传 true 使用 crypto-js（兼容旧数据），默认 false 使用 Web Crypto API
 * @returns 密文字符串（带前缀标识加密方式）
 */
export function encrypt(_x6, _x7, _x8) {
  return _encrypt.apply(this, arguments);
}

/**
 * 解密（自动识别密文类型）
 * @param cipherText 密文
 * @param secret 密钥
 * @returns 明文
 */
function _encrypt() {
  _encrypt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(plainText, secret, useCryptoJS) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!useCryptoJS) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return", cjsEncrypt(plainText, secret));
        case 2:
          return _context4.abrupt("return", wcEncrypt(plainText, secret));
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _encrypt.apply(this, arguments);
}
export function decrypt(_x9, _x10) {
  return _decrypt.apply(this, arguments);
}

/**
 * 检查 Web Crypto API 是否可用。
 * 非安全上下文（如内网 http://192.168.x.x）下 `crypto.subtle` 为 undefined。
 */
function _decrypt() {
  _decrypt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(cipherText, secret) {
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (cipherText) {
            _context5.next = 2;
            break;
          }
          return _context5.abrupt("return", '');
        case 2:
          if (!cipherText.startsWith('W:')) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", wcDecrypt(cipherText, secret));
        case 4:
          if (!cipherText.startsWith('C:')) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", cjsDecrypt(cipherText, secret));
        case 6:
          return _context5.abrupt("return", cjsDecrypt(cipherText, secret));
        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _decrypt.apply(this, arguments);
}
export function isSupported() {
  return !!(typeof crypto !== 'undefined' && crypto.subtle);
}
function buf2hex(buf) {
  var bytes = new Uint8Array(buf);
  var hex = '';
  for (var i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}
function arrayBufferToWordArray(buffer) {
  var u8 = new Uint8Array(buffer);
  var words = [];
  for (var i = 0; i < u8.length; i += 4) {
    var _u, _u2, _u3;
    words.push((u8[i] << 24 | ((_u = u8[i + 1]) !== null && _u !== void 0 ? _u : 0) << 16 | ((_u2 = u8[i + 2]) !== null && _u2 !== void 0 ? _u2 : 0) << 8 | ((_u3 = u8[i + 3]) !== null && _u3 !== void 0 ? _u3 : 0)) >>> 0);
  }
  return CryptoJS.lib.WordArray.create(words, u8.length);
}
function viewToArrayBuffer(view) {
  var copy = new Uint8Array(view.byteLength);
  copy.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
  return copy.buffer;
}
function toArrayBuffer(_x11) {
  return _toArrayBuffer.apply(this, arguments);
}
/**
 * 计算 SHA-256（小写 hex）。
 * 安全上下文优先用浏览器 `crypto.subtle`；内网 HTTP 等环境回退 crypto-js。
 */
function _toArrayBuffer() {
  _toArrayBuffer = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(data) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!(typeof data === 'string')) {
            _context6.next = 2;
            break;
          }
          return _context6.abrupt("return", viewToArrayBuffer(new TextEncoder().encode(data)));
        case 2:
          if (!(typeof Blob !== 'undefined' && data instanceof Blob)) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return", data.arrayBuffer());
        case 4:
          if (!ArrayBuffer.isView(data)) {
            _context6.next = 6;
            break;
          }
          return _context6.abrupt("return", viewToArrayBuffer(data));
        case 6:
          return _context6.abrupt("return", data instanceof ArrayBuffer ? data : data.arrayBuffer());
        case 7:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _toArrayBuffer.apply(this, arguments);
}
export function sha256Hex(_x12) {
  return _sha256Hex.apply(this, arguments);
}
function _sha256Hex() {
  _sha256Hex = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
    var buffer, digest;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return toArrayBuffer(data);
        case 2:
          buffer = _context7.sent;
          if (!isSupported()) {
            _context7.next = 8;
            break;
          }
          _context7.next = 6;
          return crypto.subtle.digest('SHA-256', buffer);
        case 6:
          digest = _context7.sent;
          return _context7.abrupt("return", buf2hex(digest));
        case 8:
          return _context7.abrupt("return", CryptoJS.SHA256(arrayBufferToWordArray(buffer)).toString(CryptoJS.enc.Hex));
        case 9:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _sha256Hex.apply(this, arguments);
}
var WebCrypto = {
  encrypt: encrypt,
  decrypt: decrypt,
  isSupported: isSupported,
  sha256Hex: sha256Hex
};
export default WebCrypto;