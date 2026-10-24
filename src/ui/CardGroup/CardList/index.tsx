import { PlusOutlined } from '@ant-design/icons';
import type { ColProps } from 'antd';
import { Card, Col, Row, theme } from 'antd';
import type { PropsWithChildren } from 'react';
import React from 'react';

export type ICardListProps<T> = {
  /**
   * 最外层div的样式
   */
  style?: React.CSSProperties;
  /**
   * 渲染的数据
   */
  data: T[];
  /**
   * 新增的点击事件
   */
  addClick?: () => void;
  /**
   * 新增图标的渲染
   */
  addIcon?: React.ReactNode;
  /**
   * 卡片的渲染
   */
  itemRender: (item: T, index: number) => React.ReactNode;
  /**
   * 卡片的key，默认为id
   */
  itemKey?: string;
  /**
   * 栅格配置 - 默认值：xs={24} md={12} lg={8} xxl={6}
   */
  colProps?: ColProps;
  /**
   * 卡片的高度
   */
  height?: number;
  /**
   * 卡片的间距
   */
  gutter?: [number, number];
  /**
   * 是否显示边框
   */
  bordered?: boolean;
  /**
   * 空值渲染
   */
  emptyRender?: React.ReactNode | (() => React.ReactNode);
};

const CardList = <T extends {}>({
  style,
  data = [],
  addClick,
  addIcon,
  itemRender,
  itemKey = "id",
  colProps = {},
  height = 150,
  gutter = [8, 8],
  bordered = false,
  emptyRender
}: PropsWithChildren<ICardListProps<T>>): React.ReactElement => {
  const { token } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    ...(bordered && {
      border: `1px solid ${token.colorBorder}`,
      borderRadius: token.borderRadius,
      padding: token.padding
    }),
    ...style
  };
  return (
    <div style={containerStyle}>
      <Row gutter={gutter}>
        {addClick && (
          <Col key={1} xs={24} md={12} lg={8} xxl={6} {...colProps}>
            <Card
              styles={{
                body: {
                  // 垂直水平居中
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              hoverable
              style={{
                height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onClick={addClick}
            >
              {addIcon || (
                <>
                  <PlusOutlined /> &nbsp;&nbsp;新增
                </>
              )}
            </Card>
          </Col>
        )}
        {data.map((item, index) => (
          <Col
            xs={24}
            md={12}
            lg={8}
            xxl={6}
            key={(item as any)[itemKey]}
            {...colProps}
          >
            {itemRender(item, index)}
          </Col>
        ))}
      </Row>
      {emptyRender && data.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {typeof emptyRender === 'function' ? emptyRender() : emptyRender}
        </div>
      )}
    </div>
  );
};

export default CardList;
