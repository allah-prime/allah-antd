/**
 * 状态的选项
 */
export var statusOptions = [{
  label: '正常',
  value: 1
}, {
  label: '禁用',
  value: 0
}];
/**
 * 状态的选项
 */
export var statusEnum = {
  0: {
    text: '禁用'
  },
  1: {
    text: '正常'
  }
};

/**
 * 默认的筛选
 */
export var defBaseFilter = {
  current: undefined,
  endDay: undefined,
  keyword: undefined,
  pageNum: 1,
  pageSize: 20,
  sort: undefined,
  startDay: undefined,
  time: undefined,
  creTimeArr: undefined,
  updateTimeArr: undefined
};