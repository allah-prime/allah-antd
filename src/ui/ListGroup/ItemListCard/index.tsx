import { LinkOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Spin, Tooltip, theme } from 'antd';
import type { PropsWithChildren } from 'react';
import type { IItemListCardProps } from '../../interface/item';
import './index.less';

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
  const { token } = theme.useToken();
  const showActions = refresh || (!disabled && (addClick || relFun));
  const divider = `1px solid ${token.colorBorderSecondary}`;

  return (
    <div
      className="ah_itemListCard"
      style={{
        backgroundColor: token.colorBgContainer,
        border: divider,
        borderRadius: token.borderRadiusLG,
        color: token.colorText,
        ...style
      }}
    >
      <Flex
        className="ah_header"
        align="center"
        justify="space-between"
        wrap
        gap={8}
        style={{ borderBottom: divider }}
      >
        <Flex className="ah_title" align="center" wrap gap={8}>
          <span>{title}</span>
          {titleIconRender}
        </Flex>
        {(showActions || extra != null) && (
          <Flex className="ah_extra" align="center" wrap gap={8}>
            {extra}
            {showActions && (
              <Flex align="center" gap={4}>
                {addClick && !disabled && (
                  <Tooltip title="添加">
                    <Button
                      type="text"
                      size="small"
                      icon={<PlusOutlined />}
                      aria-label="添加"
                      onClick={addClick}
                    />
                  </Tooltip>
                )}
                {relFun && !disabled && (
                  <Tooltip title="关联">
                    <Button
                      type="text"
                      size="small"
                      icon={<LinkOutlined />}
                      aria-label="关联"
                      onClick={relFun}
                    />
                  </Tooltip>
                )}
                {refresh && (
                  <Tooltip title="刷新">
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                      aria-label="刷新"
                      loading={refreshLoading}
                      onClick={refresh}
                    />
                  </Tooltip>
                )}
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
      <Spin spinning={refreshLoading}>
        <div
          className="ah_content"
          style={listStyle ?? { maxHeight: 360, overflowY: 'auto', overflowX: 'hidden' }}
        >
          {data.length > 0 ? (
            children
          ) : (
            <div className="ah_empty">
              {!refreshLoading && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
              )}
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
};

export default ItemListCard;
