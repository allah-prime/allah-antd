import { BlockOutlined, LinkOutlined, ReloadOutlined } from '@ant-design/icons';
import { Divider, Spin, Tooltip } from 'antd';
import type { PropsWithChildren } from 'react';
import './index.less';
import { IItemListCardProps } from '../../interface/item';

const ItemListCard = <T,>({
  title,
  data = [],
  addClick,
  refresh,
  refreshLoading = false,
  relFun,
  titleIconRender,
  extra,
  children,
  disabled,
  style,
  listStyle
}: PropsWithChildren<IItemListCardProps<T>>): React.ReactElement => {
  if (disabled) {
    // 使得addClick不会被触发
    addClick = () => {};
  }

  return (
    <div className="theling_itemListCard" style={style}>
      <div className="theling_header">
        <div className="theling_title">
          <span>{title}</span>
          {/*自定义*/}
          {titleIconRender}
          {addClick &&
            !disabled && [
              <Divider key={1} orientation="vertical" />,
              <Tooltip key={2} title="关联">
                <BlockOutlined style={{ color: '#9096a0' }} onClick={addClick} />
              </Tooltip>
            ]}
          {relFun &&
            !disabled && [
              <Divider key={1} orientation="vertical" />,
              <Tooltip key={2} title="关联">
                <LinkOutlined spin={refreshLoading} style={{ color: '#9096a0' }} onClick={relFun} />
              </Tooltip>
            ]}
          {refresh && [
            <Divider key={1} orientation="vertical" />,
            <Tooltip key={2} title="刷新">
              <ReloadOutlined
                spin={refreshLoading}
                style={{ color: '#9096a0' }}
                onClick={refresh}
              />
            </Tooltip>
          ]}
        </div>
        <div className="theling_extra">{extra}</div>
      </div>
      <Spin spinning={refreshLoading}>
        {data.length === 0 ? (
          <div />
        ) : (
          // <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  />
          <div
            className="theling_content"
            style={
              listStyle || {
                maxHeight: 360,
                overflowY: 'auto',
                overflowX: 'hidden'
              }
            }
          >
            {children}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default ItemListCard;
