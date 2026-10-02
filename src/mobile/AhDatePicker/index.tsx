import React, { useEffect } from 'react';
import { DatePicker, Picker } from 'antd-mobile';
import dayjs from 'dayjs';
import AhFromContent from '../AhFromContent';
import { IZlFormItemProps } from '../../theling-utils';

export type IAhDatePickerProps = IZlFormItemProps<string | undefined> & {
  /**
   * 设置时间选择器的时间格式
   * - date: 返回 'YYYY-MM-DD' 格式
   * - time: 返回 'HH:mm' 格式
   * - datetime: 返回 'YYYY-MM-DD HH:mm' 格式
   * - second: 返回 'HH:mm:ss' 格式
   */
  mode?: 'date' | 'time' | 'datetime' | 'second';
  /**
   * 输入值，支持多种格式：Date对象、时间戳、格式化字符串
   */
  value?: Date | string | number | undefined;
};

const formatType = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  second: 'HH:mm:ss'
};

// 生成时分秒选项
const generateTimeOptions = (mode: 'time' | 'second') => {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i.toString().padStart(2, '0')
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i.toString().padStart(2, '0')
  }));

  const seconds = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i.toString().padStart(2, '0')
  }));

  if (mode === 'time') {
    return [hours, minutes];
  }
  return [hours, minutes, seconds];
};

const AhDatePicker: React.FC<IAhDatePickerProps> = props => {
  const { onChange, label, rightDom, value, mode = 'date', ...rest } = props;

  const [visible, setVisible] = React.useState(false);
  const [dateValue, setDateValue] = React.useState<Date | undefined>();
  const [timeValue, setTimeValue] = React.useState<(string | number | null)[]>([]);

  useEffect(() => {
    // 如果默认值是字符串，就用dayjs转换一下
    let newDate: Date | undefined = undefined;

    if (typeof value === 'string') {
      // 如果是时间模式且传入的是纯时间字符串（如 '18:30'）
      if ((mode === 'time' || mode === 'second') && /^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
        // 构建完整的日期时间字符串
        const today = dayjs().format('YYYY-MM-DD');
        const fullTimeStr = `${today} ${value}`;
        newDate = dayjs(fullTimeStr).toDate();
      } else {
        // 其他情况直接用 dayjs 解析
        const parsed = dayjs(value);
        if (parsed.isValid()) {
          newDate = parsed.toDate();
        }
      }
    } else if (typeof value === 'number') {
      const parsed = dayjs(value);
      if (parsed.isValid()) {
        newDate = parsed.toDate();
      }
    } else if ((value as any) instanceof Date) {
      newDate = value;
    }

    setDateValue(newDate);

    // 如果是时间模式，设置时间值
    if ((mode === 'time' || mode === 'second') && newDate) {
      const timeStr = dayjs(newDate).format(mode === 'time' ? 'HH:mm' : 'HH:mm:ss');
      const timeParts = timeStr.split(':');
      setTimeValue(timeParts);
    } else if ((mode === 'time' || mode === 'second') && !newDate) {
      // 如果没有有效的日期但是有时间值，清空时间选择器的值
      setTimeValue([]);
    }
  }, [value, mode]);

  const title = label || rest.title;

  const onValueChange = (v: Date) => {
    setDateValue(v);
    setVisible(false);

    // 根据 mode 返回格式化后的字符串
    const formattedValue = dayjs(v).format(formatType[mode as keyof typeof formatType]);
    onChange?.(formattedValue);
  };

  const onTimeValueChange = (val: (string | number | null)[]) => {
    // 转换为字符串数组，过滤掉null值
    const filteredVal = val
      .map(v => v?.toString())
      .filter((v): v is string => v !== undefined && v !== null);

    setTimeValue(val);
    setVisible(false);

    // 构建时间字符串
    const timeStr = filteredVal.join(':');

    // 创建一个今天的日期，然后设置时间
    const today = dayjs().format('YYYY-MM-DD');
    const fullTimeStr = `${today} ${timeStr}`;
    const newDate = dayjs(fullTimeStr).toDate();

    setDateValue(newDate);

    // 直接返回时间字符串，不包含日期部分
    onChange?.(timeStr);
  };

  const displayValue = () => {
    // 如果是详情模式，就显示未填写
    if (rest.details && !dateValue) return '未填写';

    if (!dateValue) return '';

    // 检查日期是否有效
    const dayjsDate = dayjs(dateValue);
    if (!dayjsDate.isValid()) return '';

    if (mode === 'time' || mode === 'second') {
      return dayjsDate.format(formatType[mode]);
    }

    return dayjsDate.format(formatType[mode as keyof typeof formatType]);
  };

  // 如果是详情模式，就返回一个Input组件
  if (rest.details) {
    return (
      <AhFromContent
        disabled={rest.disabled}
        details={rest.details}
        layout={props.layout}
        setVisible={setVisible}
        placeholder={rest.placeholder || '请选择'}
        showValue
        valueRender={displayValue()}
      />
    );
  }

  // 如果是纯时间模式，使用自定义的时间选择器
  if (mode === 'time' || mode === 'second') {
    const timeOptions = generateTimeOptions(mode);

    return (
      <>
        <div style={{ width: '100%' }}>
          <AhFromContent
            disabled={rest.disabled}
            layout={props.layout}
            rightDom={rightDom}
            setVisible={setVisible}
            placeholder={rest.placeholder || '请选择'}
            showValue={Boolean(dateValue)}
            valueRender={displayValue()}
          />
        </div>
        <Picker
          title={title}
          visible={visible}
          value={timeValue}
          onClose={() => setVisible(false)}
          onConfirm={onTimeValueChange}
          columns={timeOptions}
          {...rest}
        />
      </>
    );
  }

  // 日期和日期时间模式使用原来的DatePicker
  return (
    <>
      <div style={{ width: '100%' }}>
        <AhFromContent
          disabled={rest.disabled}
          layout={props.layout}
          rightDom={rightDom}
          setVisible={setVisible}
          placeholder={rest.placeholder || '请选择'}
          showValue={Boolean(dateValue)}
          valueRender={displayValue()}
        />
      </div>
      <DatePicker
        title={title}
        visible={visible}
        value={dateValue}
        onClose={() => setVisible(false)}
        onConfirm={onValueChange}
        precision={mode === 'date' ? 'day' : mode === 'datetime' ? 'minute' : 'minute'}
        {...rest}
      />
    </>
  );
};

export default AhDatePicker;
