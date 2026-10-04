import { PlusOutlined } from '@ant-design/icons';
import { Popover, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import './index.less';
import TagManage from './TagManage';
import { ITagItem, ITagManageCommProps } from '../../interface/tag';

export interface ITagOptionsProps extends ITagManageCommProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 自动获取数据
   */
  autoRequest?: boolean;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 是否显示创建标签按钮 - 默认显示
   */
  showAdd?: boolean;
  /**
   * 是否选择标签颜色
   */
  isTagColor?: boolean;
}

/**
 * @description：生产新的门店标签
 * @author：tangqian
 * @date：2021/5/26
 */
const TagOptions: React.FC<ITagOptionsProps> = props => {
  const { disabled, autoRequest, style, ...tagProps } = props;
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState<ITagItem[]>([]);

  const handleVisibleChange = (newVisible: boolean) => {
    if (!disabled) {
      setVisible(newVisible);
    }
  };

  return (
    <div style={style}>
      <Popover
        classNames={{ root: 'theling-tag-popover' }}
        content={
          <TagManage
            {...tagProps}
            visible={visible}
            setLoading={setLoading}
            updateNewList={setItemList}
            initFinish={() => setVisible(false)}
          />
        }
        trigger="click"
        placement="bottomLeft"
        autoAdjustOverflow
        open={visible}
        onOpenChange={handleVisibleChange}
      >
        <Tag className="theling_tag_site-tag-plus">
          <PlusOutlined /> 新标签
        </Tag>
      </Popover>
      {loading && <span>加载中...&nbsp;</span>}
      {itemList.map(item => {
        const isLongTag = (item.label as string).length > 10;
        const tagElem = (
          <Tag className="theling_tag_site-tag-plus" key={item.value} color={item.color}>
            <span>{isLongTag ? `${(item.label as string).slice(0, 20)}` : item.label}</span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip className="theling_tag_site-tag-plus" title={item.label} key={item.value}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
    </div>
  );
};
export default TagOptions;
