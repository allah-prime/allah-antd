import { CheckCircleTwoTone, LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { IAsyncTaskScheduleVo } from '../../theling-utils/@types/IAsyncTaskScheduleVo';
import { Popconfirm, Tooltip } from 'antd';
import React from 'react';

type IProps = {
  data: IAsyncTaskScheduleVo;
  start: () => void;
  tips: string;
  children?: React.ReactNode;
  confirmTitle?: string;
  confirmDescription?: string;
  className?: string;
  style?: React.CSSProperties;
};

export const buildTips = (data: IProps['data'], tips: IProps['tips'] = '等待任务开始') => {
  // 如果正在处理，处理状态的名字
  if (data.status === 2) {
    return `${data.statusText}(${data.current}/${data.count})`;
  }
  if (data.status) {
    return data.statusText;
  }
  return tips;
};

const iconStyle = { fontSize: 16, color: '#aaabac' };

/**
 * 构建图标元素
 * @param data 任务数据
 * @param start 开始函数
 * @param confirmTitle 确认标题
 * @param confirmDescription 确认描述
 * @param hasChildren 是否有子元素，用于决定点击区域
 */
export const buildIcon = (
  data: IProps['data'],
  start: IProps['start'],
  confirmTitle?: string,
  confirmDescription?: string,
  hasChildren?: boolean
) => {
  // 如果没有任何状态就显示开始
  if (!data.status) {
    const playIcon = <PlayCircleOutlined style={iconStyle} />;

    // 如果有 children，图标本身不需要点击事件，由外层处理
    if (hasChildren) {
      return playIcon;
    }

    // 如果有确认标题或描述，使用 Popconfirm 包装
    if (confirmTitle || confirmDescription) {
      return (
        <Popconfirm
          title={confirmTitle || '确认操作'}
          description={confirmDescription}
          onConfirm={start}
          okText="确认"
          cancelText="取消"
        >
          {playIcon}
        </Popconfirm>
      );
    }

    // 否则直接绑定点击事件
    return <PlayCircleOutlined style={iconStyle} onClick={start} />;
  }
  // 成功的图标
  if (data.status === 3) {
    return <CheckCircleTwoTone style={iconStyle} twoToneColor="#52c41a" />;
  }
  // 进行中
  return <LoadingOutlined style={{ ...iconStyle, color: '#5d8aff' }} />;
};

/**
 * 进度的图标展示
 * @param data 任务数据
 * @param start 开始函数
 * @param tips 提示文本
 * @param children 子元素
 * @param confirmTitle 确认标题
 * @param confirmDescription 确认描述
 * @param className 自定义样式类名
 * @param style 自定义内联样式
 */
const PollingProgressIcon: React.FC<IProps> = ({
  data,
  start,
  tips,
  children,
  confirmTitle,
  confirmDescription,
  className,
  style
}) => {
  const hasChildren = !!children;
  const canStart = !data.status;
  const needConfirm = !!(confirmTitle || confirmDescription);

  // 构建内容
  const content = (
    <>
      {buildIcon(data, start, confirmTitle, confirmDescription, hasChildren)}&nbsp;{children}
    </>
  );

  // 合并样式
  const mergedStyle = { ...style };
  const mergedClassName = className || '';

  // 如果有 children 且可以开始，整个区域都可以点击
  if (hasChildren && canStart) {
    const clickableStyle = { cursor: 'pointer', ...mergedStyle };

    // 如果需要确认，用 Popconfirm 包装整个内容，不使用 Tooltip
    if (needConfirm) {
      return (
        <Popconfirm
          title={confirmTitle || '确认操作'}
          description={confirmDescription}
          onConfirm={start}
          okText="确认"
          cancelText="取消"
        >
          <span className={mergedClassName} style={clickableStyle}>
            {content}
          </span>
        </Popconfirm>
      );
    }

    // 否则使用 Tooltip 并直接绑定点击事件
    return (
      <Tooltip title={buildTips(data, tips)}>
        <span className={mergedClassName} style={clickableStyle} onClick={start}>
          {content}
        </span>
      </Tooltip>
    );
  }

  // 默认情况，只有图标可以点击，始终显示 Tooltip
  return (
    <Tooltip title={buildTips(data, tips)}>
      <span className={mergedClassName} style={mergedStyle}>
        {content}
      </span>
    </Tooltip>
  );
};

export default PollingProgressIcon;
