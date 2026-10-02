export var showPicker = ['date', 'dateYear', 'dateTime', 'datetime', 'dateRange'];

// 表单的条件
export var selectRuleOptions = [{
  label: '等于',
  value: 'eq'
}, {
  label: '不等于',
  value: 'neq'
}, {
  label: '包含',
  value: 'in'
}, {
  label: '不包含',
  value: 'nin'
}];
export var digitOptions = [{
  label: '等于',
  value: 'eq'
}, {
  label: '不等于',
  value: 'neq'
}, {
  label: '大于',
  value: 'gt'
}, {
  label: '大于等于',
  value: 'gte'
}, {
  label: '小于',
  value: 'lt'
}, {
  label: '小于等于',
  value: 'lte'
}];
export var switchOptions = [{
  label: '等于',
  value: 'eq'
}, {
  label: '不等于',
  value: 'neq'
}];
export var formRuleObj = {
  checkbox: selectRuleOptions,
  select: selectRuleOptions,
  radio: selectRuleOptions,
  text: selectRuleOptions,
  textarea: selectRuleOptions,
  digit: digitOptions,
  date: digitOptions,
  dateYear: digitOptions,
  switch: switchOptions,
  customRender: selectRuleOptions
};

// 导出formRuleObj的key的类型

// 可以校验长度的类型
export var canValidateLengthType = ['text', 'textarea', 'checkbox', 'select'];

// 类型对应的校验type
export var validateType = {
  text: 'string',
  textarea: 'string',
  checkbox: 'array',
  select: 'array',
  digit: 'number'
};
export var defaultFormValue = [{
  event: 'show',
  all: [{
    connect: 'start'
  }]
}];

/**
 * 通用比较操作符处理函数
 * @param operator 操作符 - 比较操作类型
 * @param actualValue 实际值 - 需要比较的值
 * @param expectedValue 期望值 - 用于比较的目标值
 * @returns 返回比较结果，true表示符合条件，false表示不符合
 */
export var executeComparison = function executeComparison(operator, actualValue, expectedValue) {
  switch (operator) {
    case 'eq':
      return actualValue === expectedValue;
    case 'neq':
      return actualValue !== expectedValue;
    case 'gt':
      return actualValue > expectedValue;
    case 'gte':
      return actualValue >= expectedValue;
    case 'lt':
      return actualValue < expectedValue;
    case 'lte':
      return actualValue <= expectedValue;
    default:
      return false;
  }
};

/**
 * 对数字类型字段的校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的数字值
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export var validateRulesDigit = function validateRulesDigit(item, value) {
  return executeComparison(item.operator, value, item.value);
};

/**
 * 对年份进行比较校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的日期值，会提取年份进行比较
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export var validateRulesDateYear = function validateRulesDateYear(item, value) {
  // 将value转成Date
  var actualYear = new Date(value).getFullYear();
  var expectedYear = new Date(item.value).getFullYear();
  return executeComparison(item.operator, actualYear, expectedYear);
};

/**
 * 对日期进行比较校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的日期值，会转换为时间戳进行比较
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export var validateRulesDate = function validateRulesDate(item, value) {
  var actualDate = new Date(value).getTime();
  var expectedDate = new Date(item.value).getTime();
  return executeComparison(item.operator, actualDate, expectedDate);
};

/**
 * 对开关类型字段的校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的开关值
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export var validateRulesSwitch = function validateRulesSwitch(item, value) {
  return executeComparison(item.operator, value, item.value);
};

/**
 * 对文本类型字段（text、textarea）的校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的文本值
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export var validateRulesText = function validateRulesText(item, value) {
  // 将值转换为字符串进行比较
  var stringValue = String(value);
  var stringItemValue = String(item.value);
  switch (item.operator) {
    case 'eq':
      return stringItemValue === stringValue;
    case 'neq':
      return stringItemValue !== stringValue;
    case 'in':
      return stringItemValue.includes(stringValue);
    case 'nin':
      return !stringItemValue.includes(stringValue);
  }
  return false;
};

/**
 * 对自定义渲染类型字段的校验（使用正则表达式）
 * @param item 规则项 - 包含校验条件的规则对象，value 为正则表达式字符串
 * @param value 值 - 需要校验的文本值
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export var validateRulesCustomRender = function validateRulesCustomRender(item, value) {
  if (!value && value !== 0 && value !== false) {
    return false;
  }
  var stringValue = String(value);
  var regexPattern = String(item.value);
  try {
    var regex = new RegExp(regexPattern);
    switch (item.operator) {
      case 'eq':
        return regex.test(stringValue);
      case 'neq':
        return !regex.test(stringValue);
      case 'in':
        return regex.test(stringValue);
      case 'nin':
        return !regex.test(stringValue);
    }
  } catch (e) {
    console.error('正则表达式错误', regexPattern, e);
    return false;
  }
  return false;
};

/**
 * 对选择类型字段（select、checkbox、radio）的校验
 * @param item 规则项 - 包含校验条件的规则对象
 * @param value 值 - 需要校验的选项值数组，默认为空数组
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export var validateRulesOptions = function validateRulesOptions(item) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (value.length === 0) {
    return false;
  }
  var newValue = value;
  if (!Array.isArray(newValue)) {
    newValue = [{
      value: newValue,
      label: newValue
    }];
  }
  // 如果是对象数组就要取出value组成一个新的数组
  if (newValue[0].value) {
    newValue = newValue.map(function (v) {
      return v.value;
    });
  }

  // 将所有值转换为字符串进行比较
  var stringNewValue = newValue.map(function (v) {
    return String(v);
  });
  var stringItemValue = item.value.map(function (v) {
    return String(v);
  });
  switch (item.operator) {
    case 'eq':
      return stringItemValue.every(function (v) {
        return stringNewValue.includes(v);
      });
    case 'neq':
      return stringItemValue.some(function (v) {
        return !stringNewValue.includes(v);
      });
    case 'in':
      return stringItemValue.some(function (v) {
        return stringNewValue.includes(v);
      });
    case 'nin':
      return stringItemValue.every(function (v) {
        return !stringNewValue.includes(v);
      });
  }
  return false;
};

/**
 * 校验单个规则项
 * @param item 规则项 - 包含校验条件的规则对象
 * @param data 数据 - 需要校验的表单数据对象
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
export var validateRulesItem = function validateRulesItem(item, data) {
  // 被校验的数据
  var value = data === null || data === void 0 ? void 0 : data[item.fact];
  if (!item.type) {
    console.error('规则配置错误，缺少 type 字段', item);
  }
  switch (item.type) {
    case 'select':
      return validateRulesOptions(item, value);
    case 'checkbox':
      return validateRulesOptions(item, value);
    case 'radio':
      return validateRulesOptions(item, value);
    case 'text':
      return validateRulesText(item, value);
    case 'textarea':
      return validateRulesText(item, value);
    case 'customRender':
      return validateRulesCustomRender(item, value);
    case 'digit':
      return validateRulesDigit(item, value);
    case 'date':
      return validateRulesDate(item, value);
    case 'dateYear':
      return validateRulesDateYear(item, value);
    case 'switch':
      return validateRulesSwitch(item, value);
  }
  return false;
};

// 可以使用字典的类型
export var useDicGroupKeyList = ['checkbox', 'select', 'radio'];

// 数字的类型
export var useDigitTypeList = ['digit'];
// 年份的类型
export var useYearTypeList = ['date', 'dateYear'];
// 开关的类型
export var useSwitchTypeList = ['switch'];
// 文本的类型
export var useTextTypeList = ['text', 'textarea'];
// 自定义渲染的类型（使用正则表达式）
export var useCustomRenderTypeList = ['customRender'];

// 可以显示占位符的组件类型
export var canShowPlaceholder = ['text', 'digit', 'textarea', 'select'];