function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * 列表变化的数据
 */

var ArrayUtil = {
  /**
   * 更新数组,若item已存在则将其从数组中删除,若不存在则将其添加到数组
   * **/
  updateArray: function updateArray(array, item) {
    for (var i = 0, len = array.length; i < len; i++) {
      var temp = array[i];
      if (item === temp) {
        array.splice(i, 1);
        return;
      }
    }
    array.push(item);
  },
  /**
   * 将数组中指定元素移除
   * @param array
   * @param item 要移除的item
   * @param id 要对比的属性，缺省则比较地址
   * @returns {*}
   */
  remove: function remove(array, item, id) {
    if (!array) return;
    for (var i = 0, l = array.length; i < l; i++) {
      var val = array[i];
      if (item === val || val && val[id] && val[id] === item[id]) {
        array.splice(i, 1);
      }
    }
    return array;
  },
  /**
   * 判断两个数组的是否相等
   * @return boolean true 数组长度相等且对应元素相等
   * */
  isEqual: function isEqual(arr1, arr2) {
    if (!(arr1 && arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    // 对数组进行排序
    arr1.sort();
    arr2.sort();
    //转成字符串进行比较
    return arr1.toString() === arr2.toString();
  },
  /**
   * clone 数组
   * @return Array 新的数组
   * */
  clone: function clone(from) {
    if (!from) return [];
    var newArray = [];
    for (var i = 0, l = from.length; i < l; i++) {
      newArray[i] = from[i];
    }
    return newArray;
  },
  /**
   *获取两个数组的差集
   * @param arr1
   * @param arr2
   */
  subSet: function subSet(arr1, arr2) {
    var set1 = new Set(arr1);
    var set2 = new Set(arr2);
    var subset = [];
    var _iterator = _createForOfIteratorHelper(set1),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (!set2.has(item)) {
          subset.push(item);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return subset;
  },
  /**
   * 获取数组中符合要求的项目
   * @param itemList 条目数组
   * @param v 比较值
   * @param k 比较的字段
   */
  getItemByKey: function getItemByKey(itemList, v) {
    var k = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';
    var item = {};
    for (var i = 0; i < itemList.length; i++) {
      if (itemList[i][k] === v) {
        item = itemList[i];
        break;
      }
    }
    return item;
  },
  /**
   * 树形数据降维
   */
  dimTreeReduction: function dimTreeReduction(treeData, nodeKeys, nodes) {
    if (!Array.isArray(treeData)) return;
    treeData.forEach(function (item) {
      nodeKeys.push(item.key);
      nodes.push(item);
      if (Array.isArray(item.children)) {
        ArrayUtil.dimTreeReduction(item.children, nodeKeys, nodes);
      }
    });
  },
  /**
   * 树形数据降维 - 返回一个完整的数组
   */
  dimTreeReduction2: function dimTreeReduction2(treeData) {
    var nodeKeys = [];
    var nodes = [];
    ArrayUtil.dimTreeReduction(treeData, nodeKeys, nodes);
    return {
      nodes: nodes,
      nodeKeys: nodeKeys
    };
  },
  /**
   * 移除父节点
   */
  removePNode: function removePNode(nodeList) {
    // 收集全部的父亲
    var pList = nodeList.map(function (item) {
      return item.data.pCode;
    });
    // 如果我的父亲在里面，我就不需要存在了
    var newNode = [];
    nodeList.forEach(function (item) {
      if (pList.indexOf(item.data.code) != -1) {
        newNode.push(item);
      }
    });
    return newNode;
  },
  /**
   * 数组转枚举
   */
  toEnum: function toEnum(arr) {
    var enumObj = {};
    arr.forEach(function (item) {
      enumObj[item.value] = _objectSpread({
        text: item.label,
        disabled: item.disabled
      }, item);
    });
    return enumObj;
  },
  /**
   * 根据指定的字段进行去重
   * @param arr 数组
   * @param key 去重字段
   */
  uniqueBy: function uniqueBy(arr, key) {
    var keys = [];
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (keys.includes(arr[i][key])) {
        continue;
      }
      keys.push(arr[i][key]);
      newArr.push(arr[i]);
    }
    return newArr;
  },
  /**
   * 把对象里面指定的属性转换成数组
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   */
  toArrayByKeys: function toArrayByKeys(obj, keys) {
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // 如果是字符串就进行处理
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].split(';').filter(function (item) {
          return item;
        });
      } else if (!obj[key]) {
        // 如果这个数据不存在，就设置为空数组
        obj[key] = [];
      }
    }
  },
  /**
   * 把对象里面指定的属性转换成数字数组
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   */
  toNumArrayByKeys: function toNumArrayByKeys(obj, keys) {
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // 如果是字符串就进行处理
      if (typeof obj[key] === 'string') {
        var split = obj[key].split(';');
        var newArr = [];
        for (var j = 0; j < split.length; j++) {
          if (split[j]) {
            newArr.push(Number(split[j]));
          }
        }
        obj[key] = newArr;
      } else if (!obj[key]) {
        // 如果这个数据不存在，就设置为空数组
        obj[key] = [];
      }
    }
  },
  /**
   * 把对象里面指定的属性转换成字符串
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   * @param str 分隔符
   * @param joinAll 是否前后都加
   */
  toStringByKeys: function toStringByKeys(obj, keys) {
    var str = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ';';
    var joinAll = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // 如果是字符串就进行处理
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key].join(str);
      }
      //如果end为true，最后一个加分号
      if (joinAll) {
        obj[key] = str + obj[key] + str;
      }
    }
  },
  /**
   * 把对象里面指定的属性转换成字符串 - 这个方法会在前后都补充对应的符号
   * <p>
   * ["a", "b"] => ";a;b;c;"
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   */
  joinAll: function joinAll(obj, keys) {
    ArrayUtil.toStringByKeys(obj, keys, ';', true);
  },
  /**
   * 把对象里面指定的属性转换成字符串
   * <p>
   * ["a", "b"] => "a;b;c"
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   */
  join: function join(obj, keys) {
    ArrayUtil.toStringByKeys(obj, keys);
  },
  /**
   * 查找出两个数组中需要删除的，需要更新的，没有变化的
   */
  findChangeData: function findChangeData(oldData, newData, key) {
    var deleteSet = new Set();
    var insertSet = new Set();
    var noChangeSet = new Set();
    // 遍历旧的数据，如果新的数据中没有，就是需要删除的
    oldData.forEach(function (item) {
      if (newData.includes(item)) {
        noChangeSet.add(item);
      } else {
        deleteSet.add(item);
      }
    });
    // 遍历新的数据，如果旧的数据中没有，就是需要新增的
    newData.forEach(function (item) {
      if (oldData.includes(item)) {
        noChangeSet.add(item);
      } else {
        insertSet.add(item);
      }
    });
    return {
      insertList: Array.from(insertSet),
      deleteList: Array.from(deleteSet),
      noChangeList: Array.from(noChangeSet)
    };
  },
  /**
   * 将字符串或者数组转成数组
   * @param str 字符串或者数组
   * @param splitStr 分隔符
   */
  toArray: function toArray(str) {
    var splitStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ';';
    if (str === null || str === undefined) {
      return null;
    }
    var strList;
    if (Array.isArray(str)) {
      strList = str;
    } else {
      // 字符串的情况
      if (str.startsWith(splitStr)) {
        str = str.substring(1, str.length);
      }
      strList = str.split(splitStr);
    }
    return strList;
  },
  /**
   * 判断对象里面的数组是否发生了变化
   * <br />
   * 一般来说，用在资源关联里面，比如判断下现在新的资源和旧的资源是否有变化，如果没有变化，就不需要重新请求接口
   */
  isChangeArray: function isChangeArray(oldObj, newObj) {
    var keys = Object.keys(oldObj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // 比较事项是否有变化
      var b = ArrayUtil.isEqual(oldObj[key], newObj[key]);
      if (!b) {
        return true;
      }
    }
    return false;
  },
  /**
   * 数组移动位置
   * @param array 数组
   * @param from 从哪个位置
   * @param to 移动到哪个位置
   */
  arrayMove: function arrayMove(array, from, to) {
    var newArray = array.slice();
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
    return newArray;
  }
};
export default ArrayUtil;