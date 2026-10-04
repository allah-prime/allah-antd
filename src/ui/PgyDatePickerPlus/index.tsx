/**
 * @author tangqian
 * @date 2019/2/20-10:58
 * @descriptions: 适用于pgy的日期选择器
 */
import { DatePicker, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React from 'react';
import './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

function fixedZero(val: any) {
  return val * 1 < 10 ? `0${val}` : val;
}

type DType = 'hours' | 'day' | 'weekday' | 'month' | '';

// 日期选择后的值
export type DDateType = [Dayjs, Dayjs];

interface IProps {
  /**
   * 时间选择器的value
   */
  rangePickerValue: DDateType;
  type: DType;
  /**
   * 时间选择的回调函数
   */
  pickerChange: (e: DDateType, type: DType) => void;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 布局
   */
  layout?: 'radio' | 'selectItem';
  /**
   * 是否开启时间展示
   */
  openDatePicker?: boolean;
}

interface IState {
  selectValue: DType;
}

/**
 * @descriptions: 全新日期选择器完成日期选择-由父组件控制picker的value、以及type
 */
class PgyDatePickerPlus extends React.Component<IProps, IState> {
  state: IState = {
    selectValue: this.props.type || ''
  };

  static defaultProps = {
    pickerChange: () => console.log('无效的方法'),
    style: { width: 256 },
    layout: 'radio',
    openDatePicker: true
  };

  /**
   * 判断是否选中
   * @param type
   * @returns {*}
   */
  isActive = (type: DType) => {
    const { rangePickerValue } = this.props;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return 'currentDate';
    }
    return '';
  };

  componentDidMount() {
    if (this.props.type) {
      this.selectDate(this.props.type);
    }
  }

  // 判断是否选择了我
  isSelect = () => {
    const { rangePickerValue } = this.props;
    // 拿到当前选中的值
    const { selectValue } = this.state;
    // 判断和选择的时间是否相同
    const value = getTimeDistance(selectValue);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return selectValue;
    }
    return '';
  };

  /**
   * 点击日期的选择
   * @param type
   */
  selectDate = (type: DType) => {
    this.setState({
      selectValue: type
    });
    this.handleRangePickerChange(getTimeDistance(type), type);
  };

  /**
   * 选择事件
   * @param rangePickerValue 选择的值
   * @param type
   */
  handleRangePickerChange = (rangePickerValue: DDateType, type: DType) => {
    if (rangePickerValue === null) return;
    const { pickerChange } = this.props;
    pickerChange(rangePickerValue, type);
  };

  render() {
    const { style, layout, openDatePicker, rangePickerValue } = this.props;

    const radio = (
      <div className="salesExtra">
        <a className={this.isActive('hours')} onClick={() => this.selectDate('hours')}>
          今日
        </a>
        <a className={this.isActive('day')} onClick={() => this.selectDate('day')}>
          本周
        </a>
        <a className={this.isActive('weekday')} onClick={() => this.selectDate('weekday')}>
          本月
        </a>
        <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
          本年
        </a>
      </div>
    );

    const selectVal: DType = this.isSelect();

    const selectItem = (
      <Select
        placeholder="日期选择"
        value={selectVal}
        onChange={this.selectDate}
        className="theling_salesExtra"
        style={{ width: 120 }}
      >
        <Option value="">全部</Option>
        <Option value="hours">今日</Option>
        <Option value="day">本周</Option>
        <Option value="weekday">本月</Option>
        <Option value="month">本年</Option>
      </Select>
    );

    return (
      <div className="theling_salesExtraWrap">
        {layout === 'radio' ? radio : selectItem}
        {openDatePicker && (
          <RangePicker
            value={rangePickerValue as any}
            onChange={(values: any) => {
              this.setState({
                selectValue: 'day'
              });
              this.handleRangePickerChange(values as DDateType, 'day');
            }}
            style={style}
          />
        )}
      </div>
    );
  }
}

export default PgyDatePickerPlus;

export function getTimeDistance(type: DType): [Dayjs, Dayjs] {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'hours') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [dayjs(now), dayjs(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'day') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [dayjs(beginTime), dayjs(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'weekday') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = dayjs(now).add(1, 'month');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      dayjs(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      dayjs(dayjs(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)
    ];
  }

  const year = now.getFullYear();
  return [dayjs(`${year}-01-01 00:00:00`), dayjs(`${year}-12-31 23:59:59`)];
}
