import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import './SearchContent.less';

type IProps = {
  // 是否是升序。默认不是
  value?: boolean;
  // 切换
  onChange?: (value: boolean) => void;
};

const SortIcon: React.FC<IProps> = ({ value = false, onChange }) => {
  const [asc, setAsc] = React.useState(value);

  return (
    <div style={{ height: '32px' }}>
      <Tooltip title={asc ? '降序' : '升序'}>
        {asc ? (
          <SortAscendingOutlined
            className="ah-search-sort-icon"
            onClick={() => {
              onChange?.(false);
              setAsc(false);
            }}
          />
        ) : (
          <SortDescendingOutlined
            className="ah-search-sort-icon"
            onClick={() => {
              onChange?.(true);
              setAsc(true);
            }}
          />
        )}
      </Tooltip>
    </div>
  );
};

export default SortIcon;
