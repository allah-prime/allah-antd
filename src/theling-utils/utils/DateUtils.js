function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
export var UNITS = {
  年: 31557600000,
  月: 2629800000,
  天: 86400000,
  小时: 3600000,
  分钟: 60000,
  秒: 1000
};
var DateUtils = {
  /**
   * 语义化时间
   * @param {Object} milliseconds
   * @param {Object} date
   */
  latelyTime: function latelyTime(milliseconds, date) {
    //判断时间差是多久前
    var time = date.getTime();
    //获取事件差后的时间
    var newDate = new Date(time - milliseconds);
    var hour = newDate.getHours() < 10 ? "0".concat(newDate.getHours()) : newDate.getHours();
    var minute = newDate.getMinutes() < 10 ? "0".concat(newDate.getMinutes()) : newDate.getMinutes();
    //今天还是昨天
    if (newDate.getDay() === date.getDay()) {
      if (milliseconds > UNITS['小时']) {
        return "".concat(Math.floor(milliseconds / UNITS['小时']), "\u5C0F\u65F6\u524D");
      }
      if (milliseconds > UNITS['分钟']) {
        return "".concat(Math.floor(milliseconds / UNITS['分钟']), "\u5206\u949F\u524D");
      }
      return '刚刚';
    }
    return "\u6628\u5929".concat(hour, ":").concat(minute);
  },
  /**
   * 显示多久以前,传递一个时间字符串
   * @param {Number | String} dataNumber 时间错
   */
  formatDate: function formatDate(dataNumber) {
    // 如果dataNumber不存在
    if (!dataNumber) {
      return '----';
    }
    // 判断下是字符串还是时间戳
    if (typeof dataNumber === 'string') {
      // 如果是时间字符串，就转换成时间戳
      if (dataNumber.includes('-')) {
        dataNumber = new Date(dataNumber).getTime();
      }
    }
    //获取当前的年份
    var today = new Date();
    var date = new Date(Number(dataNumber));
    var diff = Date.now() - date.getTime();
    //如果事件差小于一天
    if (diff < UNITS['天']) {
      return this.latelyTime(diff, today);
    }
    // 获取下今年的年份
    var year = date.getFullYear();
    var dateYear = today.getFullYear();
    //判断年
    var month = date.getMonth() + 1 < 10 ? "0".concat(date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0".concat(date.getDate()) : date.getDate();
    var hour = date.getHours() < 10 ? "0".concat(date.getHours()) : date.getHours();
    var minute = date.getMinutes() < 10 ? "0".concat(date.getMinutes()) : date.getMinutes();
    // 秒
    // const second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    // 年份的前两位
    // const year = today.getFullYear().toString().substring(2,2);
    //如果是同一年,就不显示年份
    if (date.getFullYear() === dateYear) {
      return "".concat(month, "-").concat(currentDate, " ").concat(hour, ":").concat(minute);
    }
    return "".concat(year, "-").concat(month, "-").concat(currentDate, " ").concat(hour, ":").concat(minute);
  },
  /**
   * 计算时间差 得到显示的字符串，会根据时间差的大小，自动转换为天、小时、分钟、秒
   * @param endDay 结束时间
   * @param type 显示的级别，1 天，2 小时，3 分钟，4 秒
   * @param defStr 默认显示的字符串
   */
  diffTimeStr2: function diffTimeStr2(endDay) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var defStr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '已结束';
    var diffDay = dayjs.duration(endDay.unix() * 1000 - dayjs().unix() * 1000);
    var day = diffDay.days(); //天
    var hours = diffDay.hours(); //小时
    var minutes = diffDay.minutes(); //分钟
    var seconds = diffDay.seconds(); //秒
    var diffStr = '';
    // 如果天数大于0，就显示天数
    if (day > 0 && type >= 1) {
      diffStr = "".concat(day, "\u5929");
    }
    // 如果小时大于0，就显示小时
    if (hours > 0 && type >= 2) {
      diffStr = "".concat(diffStr).concat(hours, "\u5C0F\u65F6");
    }
    // 如果分钟大于0，就显示分钟
    if (minutes > 0 && type >= 3) {
      diffStr = "".concat(diffStr).concat(minutes, "\u5206\u949F");
    }
    // 如果秒大于0，就显示秒
    if (seconds > 0 && type >= 4) {
      diffStr = "".concat(diffStr).concat(seconds, "\u79D2");
    }
    if (diffStr) {
      return diffStr;
    }
    return defStr;
  },
  /**
   * 计算时间差
   * @param endDay 结束时间
   * @param type 类型
   */
  diffTimeObj: function diffTimeObj(endDay, type) {
    var diffObj = {};
    var diff = endDay.diff(dayjs(), type, true); // 计算时间差
    diffObj.isEnd = diff <= 0; // 判断是否到期

    // 根据类型返回相应的时间差值
    switch (type) {
      case 'day':
        diffObj.value = Math.floor(diff); // 天
        diffObj.string = "".concat(Math.floor(diff), "\u5929");
        break;
      case 'hours':
        diffObj.value = Math.floor(diff * 24); // 小时
        diffObj.string = "".concat(Math.floor(diff * 24), "\u5C0F\u65F6");
        break;
      case 'minutes':
        diffObj.value = Math.floor(diff * 24 * 60); // 分钟
        diffObj.string = "".concat(Math.floor(diff * 24 * 60), "\u5206\u949F");
        break;
      case 'seconds':
        diffObj.value = Math.floor(diff * 24 * 60 * 60); // 秒
        diffObj.string = "".concat(Math.floor(diff * 24 * 60 * 60), "\u79D2");
        break;
      default:
        break;
    }
    return diffObj;
  },
  /**
   * 生成开始时间和结束时间字符串
   */
  getStartEndTimeStr: function getStartEndTimeStr(date) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
    var res = {
      startDay: undefined,
      endDay: undefined
    };
    if (!date) {
      return res;
    }
    if (date[0]) {
      res.startDay = dayjs(date[0]).format(type === 'auto' ? templateObj.start : templateObj[type]);
    }
    if (date[1]) {
      res.endDay = dayjs(date[1]).format(type === 'auto' ? templateObj.end : templateObj[type]);
    }
    return res;
  },
  /**
   * 生成开始时间和结束时间时间戳
   */
  getStartEndTimeUnix: function getStartEndTimeUnix(date) {
    var res = {
      startDay: undefined,
      endDay: undefined
    };
    if (!date) {
      return res;
    }
    if (date[0]) {
      res.startDay = dayjs(date[0]).unix() * 1000;
    }
    if (date[1]) {
      res.endDay = dayjs(date[1]).unix() * 1000;
    }
    return res;
  },
  /**
   * 根据当前的时间，来生成是凌晨、早上、中午、下午、晚上，返回对应的字符串
   */
  getDayTimeStr: function getDayTimeStr() {
    var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : dayjs();
    var hour = date.hour();
    if (hour >= 0 && hour < 6) {
      return '凌晨';
    } else if (hour >= 6 && hour < 12) {
      return '上午';
    } else if (hour >= 12 && hour < 14) {
      return '中午';
    } else if (hour >= 14 && hour < 18) {
      return '下午';
    } else if (hour >= 18 && hour < 24) {
      return '晚上';
    }
    return '';
  },
  /**
   * 安全格式化日期
   *
   * @param date - 要格式化的日期，可以是字符串、数字、Date 对象或 dayjs 对象
   * @param format - 输出的日期格式，默认为 "YYYY-MM-DD"
   * @returns 格式化后的日期字符串；如果输入无效，则返回 "-"
   *
   * @example
   * safeFormat("2025-09-20") // "2025-09-20"
   * safeFormat("2025-13-40") // "-"
   * safeFormat(new Date(), "YYYY/MM/DD HH:mm") // "2025/09/20 16:30"
   */
  safeFormat: function safeFormat(date) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD';
    if (date === null || date === undefined || date === '') {
      return '-';
    }
    var d = dayjs(date);
    return d.isValid() ? d.format(format) : '-';
  },
  /**
   * 安全格式化时间
   */
  safeFormatTime: function safeFormatTime(date) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD HH:mm:ss';
    return DateUtils.safeFormat(date, format);
  },
  /**
   * 格式化日期范围显示
   * 将开始时间和结束时间格式化为范围显示
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @returns 格式化后的日期范围字符串
   */
  formatDateRange: function formatDateRange(startTime, endTime) {
    var start = DateUtils.safeFormat(startTime);
    var end = DateUtils.safeFormat(endTime);
    if (start === '-' && end === '-') {
      return '-';
    } else if (start === '-') {
      return "\u81F3 ".concat(end);
    } else if (end === '-') {
      return "".concat(start, " \u81F3 -");
    }
    return "".concat(start, " - ").concat(end);
  },
  /**
   * 将中文日期字符串转换为 dayjs 对象
   * @param dateStr 中文日期字符串，例如 "2025年9月20日"
   * @returns dayjs 对象
   */
  parseChineseDate: function parseChineseDate(dateStr) {
    var dateRegex = /^(\d{4})年(\d{1,2})月(\d{1,2})日$/;
    var match = dateStr.match(dateRegex);
    if (!match) {
      return null;
    }
    var _match = _slicedToArray(match, 4),
      year = _match[1],
      month = _match[2],
      day = _match[3];
    return dayjs("".concat(year, "-").concat(month, "-").concat(day));
  },
  /**
   * 将日期转成拆开的时间对象（含普通与纯中文格式）
   */
  parseDateToTimeObj: function parseDateToTimeObj(date) {
    var dayjsDate = dayjs(date);
    var year = dayjsDate.year();
    var month = dayjsDate.month() + 1;
    var day = dayjsDate.date();
    var weekday = dayjsDate.day();
    var hours = dayjsDate.hour();
    var minutes = dayjsDate.minute();
    var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    // ------- 中文数字转换 -------
    var numToChinese = function numToChinese(num) {
      var units = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      if (num < 10) return units[num];
      if (num < 20) return "\u5341".concat(num === 10 ? '' : units[num - 10]);
      if (num < 100) {
        return "".concat(units[Math.floor(num / 10)], "\u5341").concat(num % 10 === 0 ? '' : units[num % 10]);
      }
      return num.toString(); // 100 以上不处理
    };
    var yearChinese = year.toString().split('').map(function (n) {
      return numToChinese(Number(n));
    }).join('');
    var monthChinese = numToChinese(month);
    var dayChinese = numToChinese(day);
    return {
      // ========== 普通格式 ==========
      year: year,
      month: month,
      day: day,
      weekday: weekday,
      hours: hours,
      minutes: minutes,
      time: dayjsDate.format('HH:mm'),
      yearStr: "".concat(year, "\u5E74"),
      monthStr: "".concat(month, "\u6708"),
      dayStr: "".concat(day, "\u65E5"),
      weekdayStr: weekdays[weekday],
      dateStr: "".concat(year, "\u5E74").concat(month, "\u6708").concat(day, "\u65E5"),
      fullDateStr: "".concat(year, "\u5E74").concat(month, "\u6708").concat(day, "\u65E5 ").concat(weekdays[weekday]),
      timeStr: dayjsDate.format('HH:mm'),
      // ========== 纯中文格式 ==========
      yearChinese: "".concat(yearChinese, "\u5E74"),
      monthChinese: "".concat(monthChinese, "\u6708"),
      dayChinese: "".concat(dayChinese, "\u65E5"),
      dateChinese: "".concat(yearChinese, "\u5E74").concat(monthChinese, "\u6708").concat(dayChinese, "\u65E5"),
      fullDateChinese: "".concat(yearChinese, "\u5E74").concat(monthChinese, "\u6708").concat(dayChinese, "\u65E5 ").concat(weekdays[weekday]),
      timeChinese: "".concat(numToChinese(hours), "\u65F6").concat(numToChinese(minutes), "\u5206")
    };
  }
};
export var templateObj = {
  day: 'YYYY-MM-DD',
  time: 'YYYY-MM-DD HH:mm:ss',
  start: 'YYYY-MM-DD 00:00:00',
  end: 'YYYY-MM-DD 23:59:59'
};
export default DateUtils;