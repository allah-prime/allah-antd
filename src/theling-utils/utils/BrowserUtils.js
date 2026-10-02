function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import { urlEncode } from "./ObjectUtils";
/**
 * 修改URL的参数
 * @param urlParams
 */
export var changeUrlParams = function changeUrlParams(urlParams) {
  var historyParams = urlEncode(urlParams).slice(1);
  var searchStr = window.location.href;
  // 问号前面的
  var url = searchStr.substring(0, searchStr.indexOf("?"));
  // 不刷新页面 改变url
  if (historyParams) {
    window.history.pushState(null, "", "".concat(url, "?").concat(historyParams));
  } else {
    window.history.pushState(null, "", url);
  }
};

/**
 * 将vh/vw转换成px
 * @param value
 */
export function viewportToPixels(value) {
  // 如果是px就返回
  if (value.endsWith("px")) {
    return Number(value.replace("px", ""));
  }
  var parts = value.match(/([0-9.]+)(vh|vw)/);
  if (parts) {
    var q = Number(parts[1]);
    var innerKey = ["innerHeight", "innerWidth"][["vh", "vw"].indexOf(parts[2])];
    var side = window[innerKey];
    return side * (q / 100);
  }
  return 0;
}

/**
 * 获取页面中全部的iframe，以及iframe中的iframe
 */
export var getAllIframe = function getAllIframe(iframeDocument) {
  var iframeArr = [];
  if (iframeDocument) {
    var iframeList = iframeDocument.getElementsByTagName("iframe");
    for (var i = 0; i < iframeList.length; i++) {
      var _iframeList$i$content;
      iframeArr.push(iframeList[i]);
      var childIframe = getAllIframe((_iframeList$i$content = iframeList[i].contentWindow) === null || _iframeList$i$content === void 0 ? void 0 : _iframeList$i$content.document);
      if (childIframe.length > 0) {
        iframeArr.push.apply(iframeArr, _toConsumableArray(childIframe));
      }
    }
  }
  return iframeArr;
};

/**
 * 指定元素的拖拽
 * @param dom 元素的dom
 */
export var dragDomFunc = function dragDomFunc(dom) {
  var time = 0;
  dom.onmousedown = function (event) {
    time = setTimeout(function () {
      var ev = event || window.event;
      event.stopPropagation();
      var disX = ev.clientX - dom.offsetLeft;
      var disY = ev.clientY - dom.offsetTop;
      dom.style.cursor = "move";
      document.onmousemove = function (event2) {
        var ev2 = event2 || window.event;
        dom.style.left = "".concat(ev2.clientX - disX, "px");
        dom.style.top = "".concat(ev2.clientY - disY, "px");
      };
    }, 300);
  };
  dom.onmouseup = function () {
    clearTimeout(time);
    document.onmousemove = null;
    dom.style.cursor = "default";
  };
};

/**
 * 获取当前Chrome浏览器版本
 * -1 则不是Chrome浏览器
 */
export function getChromeVersion() {
  var arr = navigator.userAgent.split(" ");
  var chromeVersion = "";
  for (var i = 0; i < arr.length; i++) {
    if (/chrome/i.test(arr[i])) chromeVersion = arr[i];
  }
  if (chromeVersion) {
    return Number(chromeVersion.split("/")[1].split(".")[0]);
  }
  return -1;
}