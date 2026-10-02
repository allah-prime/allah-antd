import { Avatar, Empty, Tag, Timeline } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import './index.less';

// 定义类型，需要包括头像，标题，创建时间，内容数组
export type IInfoLogItem = {
  /**
   * 记录的id
   */
  id: string;
  /**
   * 头像url
   */
  avatar?: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 创建时间
   */
  creTime: string;
  /**
   * 创建人
   */
  userName?: string;
  /**
   * 内容数组
   */
  content: {
    id: string;
    content: string;
  }[];
  other?: any;
};

type IProps = {
  /**
   * 数据
   */
  data: IInfoLogItem[];
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 其他属性
   */
  [key: string]: any;
};

const Index: React.FC<IProps> = ({ data = [], style }) => {
  if (data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  // 随机一个深颜色的方法

  // const getRandomColor = () => {
  //   return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  // };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 128); // 红色分量在 0 - 127 之间，保证较暗
    const g = Math.floor(Math.random() * 128); // 绿色分量在 0 - 127 之间，保证较暗
    const b = Math.floor(Math.random() * 128); // 蓝色分量在 0 - 127 之间，保证较暗
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="theling-antd-InfoLog" style={style}>
      <Timeline
        items={data.map((item) => ({
          key: item.id,
          content: (
            <div className="theling-antd-InfoLog-item">
              <div className="theling-antd-InfoLog-item-header">
                <div className="theling-antd-InfoLog-item-header-avatar">
                  {item.avatar ? (
                    <Avatar src={item.avatar} size="small" />
                  ) : (
                    <Avatar
                      style={{
                        backgroundColor: '#1890FF',
                        verticalAlign: 'middle'
                      }}
                      size="small"
                    >
                      {item.userName?.substring(0, 1) || '无'}
                    </Avatar>
                  )}
                </div>
                <div className="theling-antd-InfoLog-item-header-title">{item.title}</div>
                <div className="theling-antd-InfoLog-item-header-time">
                  {item.creTime ? dayjs(item.creTime).format('YYYY-MM-DD HH:mm') : '-'}
                </div>
              </div>
              <div>
                <div className="theling-antd-InfoLog-item-header-tag">
                  {!!item?.other?.adminArea && (
                    <div className="theling-antd-InfoLog-item-header-tag-item">
                      <Tag color="#2a337f">{item.other?.adminArea}</Tag>
                    </div>
                  )}

                  <div className="theling-antd-InfoLog-item-header-tag-item">
                    {item?.other?.userAuthList?.map((key: string) => (
                      <Tag key={key} color={getRandomColor()}>
                        {key}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
              <div className="theling-antd-InfoLog-item-content">
                {item.content.map((contentItem) => (
                  <div className="theling-antd-InfoLog-item-content-item" key={contentItem.id}>
                    {contentItem.content}
                  </div>
                ))}
              </div>
            </div>
          )
        }))}
      />
    </div>
  );
};

export default Index;
