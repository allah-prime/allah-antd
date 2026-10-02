var _class;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { diffArrays, diffChars } from 'diff';
import ArrayUtil from "./ArrayUtil";
var DiffUtils = /*#__PURE__*/_createClass(function DiffUtils() {
  _classCallCheck(this, DiffUtils);
});
_class = DiffUtils;
/**
 * 生成对象对数据
 * @param oldObj 旧的对象
 * @param newObj 新的对象
 */
_defineProperty(DiffUtils, "buildDiffObj", function (oldObj, newObj) {
  var diffObj = {};
  var keys = Object.keys(newObj);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    // 如果两个相等
    if (oldObj[key] === newObj[key]) {
      continue;
    }
    // 都是null
    if (oldObj[key] === null && newObj[key] === null) {
      continue;
    }
    // 都是undefined
    if (oldObj[key] === undefined && newObj[key] === undefined) {
      continue;
    }
    if (typeof oldObj[key] === 'string') {
      // 如果是空字符串和null或者undefined
      if (oldObj[key] === '' && (newObj[key] === null || newObj[key] === undefined)) {
        continue;
      }
      diffObj[key] = diffChars(oldObj[key], newObj[key] || '');
    } else if (typeof newObj[key] === 'number') {
      diffObj[key] = [{
        count: 1,
        removed: true,
        value: oldObj[key]
      }, {
        count: 1,
        added: true,
        value: newObj[key]
      }];
    } else if ((oldObj[key] === undefined || oldObj[key] === null) && typeof newObj[key] === 'string') {
      diffObj[key] = diffChars('', newObj[key]);
    } else if (Array.isArray(oldObj[key]) || Array.isArray(newObj[key])) {
      // 比较两个数组是否相同
      var b = ArrayUtil.isEqual(oldObj[key], newObj[key]);
      if (b) {
        continue;
      }
      if (!(oldObj !== null && oldObj !== void 0 && oldObj[key])) {
        oldObj[key] = [];
      }
      if (typeof oldObj[key][0] === 'string' || typeof newObj[key][0] === 'string') {
        diffObj[key] = _class.buildDiffArray(oldObj[key], newObj[key]);
      } else {
        // 智能对比对象数组：基于唯一标识字段判断新增、删除、修改
        diffObj[key] = _class.buildDiffObjectArray(oldObj[key], newObj[key]);
      }
    }
  }
  return diffObj;
});
/**
 * 构建全是添加的数据
 * @param obj 操作的对象
 */
_defineProperty(DiffUtils, "buildNewDiffObj", function (obj) {
  var changeDate = {};
  Object.keys(obj).forEach(function (key) {
    if (Array.isArray(obj[key])) {
      changeDate[key] = {
        added: obj[key],
        removed: [],
        noed: []
      };
    } else {
      changeDate[key] = [{
        count: 1,
        added: true,
        value: obj[key]
      }];
    }
  });
  return changeDate;
});
_defineProperty(DiffUtils, "buildDiffArray", function (oldArray, newArray) {
  var diffList = diffArrays(oldArray, newArray);
  var diffObj = {
    added: [],
    removed: [],
    noed: [],
    change: false
  };
  diffList.forEach(function (item) {
    if (item.added) {
      if (Array.isArray(item.value)) {
        var _diffObj$added;
        (_diffObj$added = diffObj.added).push.apply(_diffObj$added, _toConsumableArray(item.value));
      } else {
        diffObj.added.push(item.value);
      }
    } else if (item.removed) {
      diffObj.change = true;
      if (Array.isArray(item.value)) {
        var _diffObj$removed;
        (_diffObj$removed = diffObj.removed).push.apply(_diffObj$removed, _toConsumableArray(item.value));
      } else {
        diffObj.removed.push(item.value);
      }
    } else {
      diffObj.change = true;
      if (Array.isArray(item.value)) {
        var _diffObj$noed;
        (_diffObj$noed = diffObj.noed).push.apply(_diffObj$noed, _toConsumableArray(item.value));
      } else {
        diffObj.noed.push(item.value);
      }
    }
  });
  return diffObj;
});
/**
 * 比较对象数组，基于唯一标识字段判断新增、删除、无变化，，老的会存在同一组数据被误判为"删除+新增"
 * @param oldArray 旧的对象数组
 * @param newArray 新的对象数组
 * @returns 包含added（新增）、removed（删除）、noed（无变化）的对象
 */
_defineProperty(DiffUtils, "buildDiffObjectArray", function (oldArray, newArray) {
  // 常见的唯一标识字段名
  var idFields = ['id', 'code', 'adminCode', 'disId', 'key', '_id'];

  // 自动识别唯一标识字段
  var idField = '';
  if (newArray.length > 0) {
    var _iterator = _createForOfIteratorHelper(idFields),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _newArray$;
        var field = _step.value;
        if (((_newArray$ = newArray[0]) === null || _newArray$ === void 0 ? void 0 : _newArray$[field]) !== undefined) {
          idField = field;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  // 如果没有找到唯一标识字段，降级为简单的 JSON 字符串比较
  if (!idField) {
    var oldStrList = oldArray.map(function (item) {
      return JSON.stringify(item);
    });
    var newStrList = newArray.map(function (item) {
      return JSON.stringify(item);
    });
    var diffList = diffArrays(oldStrList, newStrList);
    var _result = {
      added: [],
      removed: [],
      noed: []
    };
    diffList.forEach(function (item) {
      if (item.added) {
        _result.added.push(item.value.map(function (item2) {
          return JSON.parse(item2);
        }));
      } else if (item.removed) {
        _result.removed.push(item.value.map(function (item2) {
          return JSON.parse(item2);
        }));
      } else {
        _result.noed.push(item.value.map(function (item2) {
          return JSON.parse(item2);
        }));
      }
    });
    return _result;
  }

  // 基于唯一标识字段进行智能比较
  var oldMap = new Map(oldArray.map(function (item) {
    return [item[idField], item];
  }));
  var newMap = new Map(newArray.map(function (item) {
    return [item[idField], item];
  }));
  var result = {
    added: [],
    removed: [],
    noed: []
  };

  // 找出新增和无变化的记录
  newArray.forEach(function (newItem) {
    var idValue = newItem[idField];
    var oldItem = oldMap.get(idValue);
    if (!oldItem) {
      // 新增的记录
      result.added.push([newItem]);
    } else {
      // 唯一标识相同即认为无变化（忽略字段值的变化）
      result.noed.push([newItem]);
    }
  });

  // 找出删除的记录
  oldArray.forEach(function (oldItem) {
    var idValue = oldItem[idField];
    if (!newMap.has(idValue)) {
      // 删除的记录
      result.removed.push([oldItem]);
    }
  });
  return result;
});
export { DiffUtils as default };