import { DownOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import type { IOptions7 } from '@allahjs/utils';
import { Dropdown, Space, Tooltip } from 'antd';
import type { MenuInfo } from 'rc-menu/es/interface';
import React from 'react';

export type ISortItemsProps = {
  /**
   * 默认值
   */
  defValue?: Record<string, boolean>;
  /**
   * 选项
   */
  opts: IOptions7<string>[];
  /**
   * 回调
   */
  onChange: (value: Record<string, boolean>) => void;
};

/**
 * 默认排序
 */
export const defSortOpt: IOptions7<string> = {
  label: '默认排序',
  value: 'default',
  key: 'SortItemsDefault'
};

/**
 * 排序组件
 * @constructor
 */
const SortFilterAntd: React.FC<ISortItemsProps> = ({ opts = [], onChange, defValue }) => {
  // 排序的字段
  const [sortFields, setSortFields] = React.useState<IOptions7<string>>(defSortOpt);
  // 排序的方式
  const [sort, setSort] = React.useState<boolean>(true);

  const onMenuClick = (e: MenuInfo) => {
    if (e.key === 'SortItemsDefault' && defValue) {
      // 默认排序
      const key = Object.keys(defValue)[0];
      setSort(defValue[key]);
      setSortFields(defSortOpt);
      onChange(defValue);
    } else {
      // 找到key对应的数据
      const item = opts.find(i => i.key === e.key);
      if (item) {
        setSortFields(item);
        onChange({ [item.value]: sort });
      }
    }
  };

  const onSortClick = () => {
    setSort(!sort);
    onChange({ [sortFields.value]: !sort });
  };

  return (
    <div>
      <Dropdown menu={{ items: [defSortOpt, ...opts] as any, onClick: onMenuClick }}>
        <a onClick={e => e.preventDefault()}>
          <Space>
            {sortFields.label}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      <Tooltip title={sort ? '降序' : '升序'}>
        {sort ? (
          <SortAscendingOutlined
            title="降序"
            onClick={onSortClick}
            style={{ color: '#dc6b08', fontSize: 14, marginLeft: 4 }}
          />
        ) : (
          <SortDescendingOutlined
            title="升序"
            onClick={onSortClick}
            style={{ color: '#dc6b08', fontSize: 14, marginLeft: 4 }}
          />
        )}
      </Tooltip>
    </div>
  );
};

export default SortFilterAntd;
