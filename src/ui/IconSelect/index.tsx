import React, { useEffect } from 'react';
import { Button, Input, Popover, Tooltip } from 'antd';
import './index.less';
import IconFont from './IconFont';

type IIconItem = {
  icon_id: string;
  name: string;
  font_class: string;
  unicode: string;
  unicode_decimal: number;
};

const IconSelect: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  iconList: IIconItem[];
}> = ({ value, onChange, iconList = [] }) => {
  // 选择的icon对象
  const [selectedIconObj, setSelectedIconObj] = React.useState<IIconItem>();

  useEffect(() => {
    // 从选项中过滤出当前选择的icon
    const selectedIconObj = iconList?.find(item => `icon-${item.font_class}` === value);
    setSelectedIconObj(selectedIconObj);
  }, [value]);

  console.log('selectedIconObj', selectedIconObj);

  const iconFontDom = (fontSize: number) => {
    if (!selectedIconObj?.font_class) {
      return null;
    }
    return (
      <IconFont
        style={{
          fontSize
        }}
        type={`icon-${selectedIconObj?.font_class}` || ''}
      />
    );
  };

  // icon数组
  const [showIconList, setShowIconList] = React.useState<IIconItem[]>(iconList);

  return (
    <div>
      <Popover
        placement="bottomLeft"
        content={
          <div>
            <Input.Search
              placeholder="输入关键词回车进行搜索"
              onChange={v => {
                setShowIconList(
                  iconList.filter(item => {
                    return (
                      item.name.includes(v.target.value) || item.font_class.includes(v.target.value)
                    );
                  }) || []
                );
              }}
            />
            <div
              style={{
                width: 420,
                height: 300,
                overflowY: 'auto'
              }}
            >
              {showIconList.map(item => {
                const iconName = `icon-${item.font_class}`;
                return (
                  <Tooltip key={iconName} title={item.name}>
                    <IconFont
                      onClick={() => {
                        setSelectedIconObj(item);
                        onChange?.(iconName);
                      }}
                      style={{
                        fontSize: 40
                      }}
                      type={iconName}
                      className={`ah_icon_select ${selectedIconObj?.font_class === item.font_class ? 'ah_icon_select_active' : ''}`}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>
        }
        trigger="click"
      >
        <Button
          size="small"
          style={{
            height: 32
          }}
          icon={
            <Popover placement="topLeft" content={iconFontDom(48)}>
              {iconFontDom(22)}
            </Popover>
          }
        >
          {selectedIconObj?.name || '请选择图标'}
          {selectedIconObj?.font_class && (
            <span style={{ marginLeft: 2 }}>{selectedIconObj?.font_class}</span>
          )}
        </Button>
      </Popover>
    </div>
  );
};

export default IconSelect;
