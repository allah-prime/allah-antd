function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import { validateRulesItem } from "./ruleUtils";

/**
 * 表单规则校验方法
 * @param rules 规则组 - 包含多个规则项的数组
 * @param data 数据 - 需要校验的表单数据对象
 * @returns 返回符合条件的事件名称数组
 * @deprecated 应该使用 validateActions 方法
 */
export function validateRules(rules, data) {
  if (!Array.isArray(rules)) return [];
  var eventList = new Set();
  var _iterator = _createForOfIteratorHelper(rules),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
        conditions = _step$value.all,
        event = _step$value.event;
      if (!Array.isArray(conditions) || conditions.length === 0) continue;
      var result = true;
      var orBuffer = false;
      var inOr = false;
      for (var i = 0; i < conditions.length; i++) {
        var _conditions$connect, _conditions;
        var _item = conditions[i];
        var valid = validateRulesItem(_item, data);
        var nextConnect = (_conditions$connect = (_conditions = conditions[i + 1]) === null || _conditions === void 0 ? void 0 : _conditions.connect) !== null && _conditions$connect !== void 0 ? _conditions$connect : 'and';
        if (_item.connect === 'or' || nextConnect === 'or') {
          inOr = true;
          orBuffer || (orBuffer = valid);
        }
        if (nextConnect !== 'or') {
          if (inOr) {
            orBuffer || (orBuffer = valid);
            if (!orBuffer) {
              result = false;
              break;
            }
            orBuffer = false;
            inOr = false;
          } else if (!valid) {
            result = false;
            break;
          }
        }
      }
      if (result) eventList.add(event);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return _toConsumableArray(eventList);
}
/**
 * 表单动作校验方法
 * @param rules 规则组
 * @param data 数据
 */
export function validateActions(rules, data) {
  var res = {
    show: false,
    hide: false,
    disable: false,
    clear: false
  };
  var _iterator2 = _createForOfIteratorHelper(rules),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var rule = _step2.value;
      var allItems = rule.all;
      if (!allItems || allItems.length === 0) continue;
      var groupResult = true;
      for (var j = 0; j < allItems.length; j++) {
        var _allItems;
        var _item2 = allItems[j];
        var result = validateRulesItem(_item2, data);
        var nextConnect = (_allItems = allItems[j + 1]) === null || _allItems === void 0 ? void 0 : _allItems.connect;
        var connect = nextConnect && nextConnect !== 'start' ? nextConnect : 'and';
        if (connect === 'or') {
          groupResult || (groupResult = result);
        } else if (!result) {
          groupResult = false;
          break;
        }
      }
      if (groupResult) {
        // 优先级处理
        if (rule.event === 'hide') {
          res.hide = true;
          res.show = false; // hide 优先于 show
        } else if (rule.event === 'clear') {
          res.clear = true;
        } else if (rule.event === 'disable') {
          res.disable = true;
        } else if (rule.event === 'show') {
          if (!res.hide) res.show = true; // 只有没 hide 才能 show
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return res;
}

/**
 * 初始化自定义属性配置
 * @param configItem 配置项 - 系统定义的属性配置对象，可为null
 * @param form 表单实例 - Antd Form 实例，用于设置表单字段值
 */
export var initAttributesConfig = function initAttributesConfig(configItem, form) {
  // 设置默认值
  if (configItem) {
    var _configItem$verRules;
    // 取出对象
    var verRulesObj = ((_configItem$verRules = configItem.verRules) === null || _configItem$verRules === void 0 ? void 0 : _configItem$verRules[0]) || {};
    // 将verRulesObj转成rules_requiredIds这种格式
    var rules2 = Object.keys(verRulesObj).reduce(function (pre, cur) {
      pre["rules_".concat(cur)] = verRulesObj[cur];
      return pre;
    }, {});
    form.setFieldsValue(_objectSpread(_objectSpread(_objectSpread({}, configItem), rules2), {}, {
      rules_required: rules2.required ? [true] : []
    }));
  }
};

/**
 * 自定义属性中的选项发生变化时的处理函数
 * @param newOpt 新选项 - 新的选项数组
 * @param configItem 配置项 - 当前的属性配置对象，可为null
 * @param setConfigItem 设置配置项函数 - 用于更新配置项的回调函数
 */
export var onAttributesConfigListOptionsChange = function onAttributesConfigListOptionsChange(newOpt, configItem, setConfigItem) {
  if (configItem) {
    var eum = {};
    newOpt.forEach(function (item) {
      eum[item.value] = item.label;
    });
    configItem.options = {
      value: newOpt,
      eum: eum
    };
    setConfigItem(configItem);
  }
};
function extracted(item, value) {
  // 判断是否符合校验
  if (item.regexp) {
    return new RegExp(item.regexp).test(String(value));
  }

  // 如果值是数组（如 checkbox），检查数组中是否包含目标值
  if (Array.isArray(value)) {
    return value.some(function (v) {
      return String(v) === String(item.value);
    });
  }

  // 统一转换为字符串进行比较，避免类型不匹配问题
  return String(value) === String(item.value);
}

/**
 * 根据用户选择的值，生成新的表单配置（改进版）
 * @param value 当前表单的数据
 * @param config 默认的配置
 * @returns 更新后的表单配置
 */
export var buildNewFormItemPropsVer = function buildNewFormItemPropsVer(_ref, config) {
  var value = _ref.value;
  var newConfig = _objectSpread({}, config);
  newConfig.request = config.request;

  // 优先处理 zlRules（新的规则系统）
  if (config.zlRules && config.zlRules.length > 0) {
    var actionResult = validateActions(config.zlRules, value || {});

    // 根据 validateActions 的结果设置表单项属性
    // hide 优先级最高
    if (actionResult.hide) {
      newConfig.show = false;
    } else if (actionResult.show) {
      newConfig.show = true;
    }

    // 设置禁用状态
    if (actionResult.disable) {
      newConfig.disabled = true;
    }

    // 处理清空动作
    if (actionResult.clear && newConfig.fieldProps) {
      // 可以在这里添加清空逻辑，比如重置字段值
      newConfig.initialValue = undefined;
    }
    return newConfig;
  }

  // 兼容旧的 dependent 系统
  var dependent = newConfig.dependent || [];

  // 默认隐藏有依赖关系的字段
  newConfig.show = dependent.length === 0;

  // 依赖校验
  var _loop = function _loop() {
    var item = dependent[i];
    var itemValue = value ? value[item.field] : undefined;
    var flag = false;
    console.log('依赖检查:', {
      field: item.field,
      expectedValue: item.value,
      actualValue: itemValue,
      formValues: value
    });

    // 如果itemValue是数组，那么就是循环判断，只要有一个符合就行
    if (Array.isArray(itemValue)) {
      flag = itemValue.some(function (v) {
        return extracted(item, v);
      });
    } else {
      flag = extracted(item, itemValue);
    }

    // 获取所依赖的值符合依赖的正则规则
    if (flag) {
      // 设置显示和隐藏
      newConfig.show = item.show;
      // 如果之前配置没有，那么就设置新的配置
      if (!newConfig.formItemProps) {
        newConfig.formItemProps = {};
      }
      newConfig.formItemProps.rules = [{
        required: item.required,
        message: item.message || "".concat(newConfig.title, "\u662F\u5FC5\u586B\u7684")
      }];
      return 1; // break
      // 找到匹配的依赖条件就退出循环
    }
  };
  for (var i = 0; i < dependent.length; i++) {
    if (_loop()) break;
  }
  return newConfig;
};

/**
 * 按照 title 类型的列对数据进行分组
 * @param columns 列配置数组
 * @returns 分组后的数据结构数组
 */
export var groupColumnsByTitle = function groupColumnsByTitle(columns) {
  var groups = [];
  var currentGroup = [];
  //  title的配置
  var currentTitleConfig;
  columns.forEach(function (column) {
    if (column.valueType === 'title') {
      // 如果遇到 title 类型，先保存之前的分组
      if (currentGroup.length > 0) {
        groups.push(_objectSpread(_objectSpread({}, currentTitleConfig), {}, {
          columns: currentGroup
        }));
      }
      // 开始新的分组
      currentTitleConfig = column;
      currentGroup = [];
    } else {
      // 普通列加入当前分组
      currentGroup.push(column);
    }
  });

  // 处理最后一个分组
  if (currentGroup.length > 0) {
    groups.push(_objectSpread(_objectSpread({}, currentTitleConfig), {}, {
      columns: currentGroup
    }));
  }
  return groups;
};