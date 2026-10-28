import { DoubleRightOutlined, FilterOutlined } from '@ant-design/icons';
import { Divider, Space } from 'antd';
import React, { useState } from 'react';
import IconFont from '../IconSelect/IconFont';
import './SearchContent.less';
import { ISearchContentProps } from '../ahAntdTypes';
/**
 * 搜索用的div
 * @constructor
 */
const SearchContent: React.FC<ISearchContentProps> = ({
  searchForm,
  searchExtra,
  title = '筛选条件',
  iconFontType,
  titleExtra,
  showExpand = true,
  showOpenHide = true,
  headerRender,
  className = 'ah-page-header-search'
}) => {
  // 筛选条件（样式开关）
  const [onOff, setOnOff] = useState<boolean>(true);
  const titleIcon = iconFontType ? (
    <IconFont type={iconFontType} style={{ fontSize: 15 }} />
  ) : (
    <FilterOutlined style={{ fontSize: 15 }} />
  );
  return (
    <div className={`ah-search-header ${className}`}>
      {headerRender &&
        headerRender({
          searchForm,
          searchExtra,
          title,
          iconFontType,
          titleExtra,
          showExpand
        })}
      {showExpand && (
        <Space>
          {titleIcon}
          <span
            style={{
              fontSize: 15,
              lineHeight: '24px',
              fontWeight: '700'
            }}
          >
            {title}
          </span>
          {showOpenHide && (
            <>
              <Divider orientation="vertical" />
              <button
                type="button"
                aria-expanded={onOff}
                aria-label={onOff ? '收起筛选条件' : '展开筛选条件'}
                className={onOff ? 'ah-search-toggle ah-search-on' : 'ah-search-toggle ah-search-off'}
                style={onOff ? undefined : { transform: 'rotate(90deg)' }}
                onClick={() => {
                  setOnOff((prev) => !prev);
                }}
              >
                <DoubleRightOutlined />
              </button>
            </>
          )}
          {titleExtra}
        </Space>
      )}
      <div className="ah-search-bottom" style={{ marginTop: showExpand ? 6 : 0 }}>
        <div style={{ display: onOff ? 'block' : 'none' }}>{searchForm}</div>
        <div style={{ display: onOff ? 'block' : 'none' }}>
          <div style={{ display: 'flex' }}>{searchExtra}</div>
        </div>
      </div>
    </div>
  );
};

export default SearchContent;
