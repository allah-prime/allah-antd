import { TableDropdown } from '@ant-design/pro-components';
import { Input, Space } from 'antd';
import type { PropsWithChildren } from 'react';
import React from 'react';
import Ellipsis from '../Ellipsis';

import { ItemBarProps } from '../interface/item';

/**
 * 新数据
 */
export const NewDom = ({ marginRight }: { marginRight?: number }) => {
  return (
    <span className="theling_isNewTag" style={{ marginRight }}>
      new
    </span>
  );
};

/**
 * 事项条
 */
const ItemBar = <T extends {}>({
  item,
  icon,
  tag,
  title = '无效头部',
  extra,
  extraRender,
  extraText,
  iconRender,
  extraMenu,
  onMenuSelect,
  tagRender,
  barTitleKey,
  clickMatter,
  editable,
  onChange,
  boxShadow = true,
  onBlur,
  disabled,
  bodyStyle = {}
}: PropsWithChildren<ItemBarProps<T>>): React.ReactElement => {
  const buildStyle = () => {
    const defStyle: React.CSSProperties = {
      boxShadow: boxShadow ? '0 1px 0 0 #f2f4f6' : 'none',
      cursor: disabled ? 'not-allowed' : 'default'
    };
    if (disabled) {
      defStyle.backgroundColor = disabled ? '#f5f5f5' : 'transparent';
    }
    return {
      ...defStyle,
      ...bodyStyle
    };
  };
  return (
    <div className="theling_itemBar" style={buildStyle()}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          height: 36,
          lineHeight: '36px'
        }}
        onClick={(e) => {
          if (clickMatter) {
            clickMatter(item);
            e.stopPropagation();
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <>
            {icon || iconRender?.(item)}
            {tag || tagRender?.(item)}
          </>
        </div>
        <div style={{ width: '100%' }}>
          {editable ? (
            <Input
              value={barTitleKey ? item[barTitleKey] : title}
              variant="borderless"
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={onBlur}
            />
          ) : (
            <Ellipsis tooltip lines={1}>
              {barTitleKey ? item[barTitleKey] : title}
              {item.showCount && item.count}
            </Ellipsis>
          )}
        </div>
      </div>
      {extraRender && extraRender(item, NewDom)}
      {extra && <div className="theling_itemBarExtra">{extra}</div>}
      <Space>
        {extraText && <div className="theling_itemBarExtra">{extraText}</div>}
        {(item as any).isNew && <NewDom />}
        {extraMenu && (
          <div className="theling_itemBarExtra">
            <TableDropdown key="actionGroup" onSelect={onMenuSelect} menus={extraMenu} />
          </div>
        )}
      </Space>
    </div>
  );
};

export default ItemBar;
