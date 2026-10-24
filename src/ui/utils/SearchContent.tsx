import { DoubleRightOutlined } from '@ant-design/icons';
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
  iconFontType = 'icon-shaixuantiaojian2',
  titleExtra,
  showExpand = true,
  showOpenHide = true,
  headerRender,
  className = 'ah-page-header-search'
}) => {
  // 筛选条件（样式开关）
  const [onOff, setOnOff] = useState<boolean>(true);
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
        <Space style={{ marginLeft: 8 }}>
          <IconFont type={iconFontType} style={{ fontSize: 15 }} />
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
              {onOff ? (
                <DoubleRightOutlined
                  className="ah-search-on"
                  onClick={() => {
                    setOnOff(false);
                  }}
                />
              ) : (
                <DoubleRightOutlined
                  className="ah-search-off"
                  style={{ transform: 'rotate(90deg)' }}
                  onClick={() => {
                    setOnOff(true);
                  }}
                />
              )}
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
