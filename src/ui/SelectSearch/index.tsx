import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { IOptions7 } from '../../theling-utils/@types/IZlData';
import { Divider, Input, Select, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import { ISelectSearchProps } from '../interface/component';

const SelectSearch: React.FC<ISelectSearchProps> = ({
  options,
  addItem,
  itemRender,
  onChange,
  selectProps,
  placeholder,
  value,
  mode
}) => {
  const [localOptions, setLocalOptions] = React.useState<IOptions7<string>[]>(options);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  return (
    <Select
      style={{ width: 300 }}
      placeholder={placeholder || '请选择'}
      onChange={onChange}
      value={value}
      mode={mode}
      options={itemRender ? undefined : localOptions}
      popupRender={menu => (
        <>
          {mode !== 'multiple' && (
            <>
              <Input
                prefix={<SearchOutlined />}
                variant="borderless"
                placeholder="搜索"
                onChange={e => {
                  const newOptions = options.filter(
                    item =>
                      (item.label as string).includes(e.target.value) ||
                      item.value.includes(e.target.value)
                  );
                  setLocalOptions(newOptions);
                }}
              />
              <Divider style={{ margin: '2px 0' }} />
            </>
          )}
          {menu}
          {addItem && (
            <>
              <Divider style={{ margin: '2px 0' }} />
              <Space align="center" style={{ padding: '0px 8px 0px 8px', lineHeight: '24px' }}>
                <Typography.Link onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
                  <PlusOutlined /> 创建新的选项
                </Typography.Link>
              </Space>
            </>
          )}
        </>
      )}
      {...selectProps}
    >
      {itemRender ? localOptions.map((item, index) => itemRender(item, index)) : undefined}
    </Select>
  );
};

export default SelectSearch;
