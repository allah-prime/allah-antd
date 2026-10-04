import { SearchOutlined } from '@ant-design/icons';
import type { IOptions6, IOptions7 } from '@allahjs/utils';
import { Checkbox, Input, Radio } from 'antd';
import React, { useEffect } from 'react';
import ItemBar from '../../ItemBar';
import './index.less';
import { IListSearchProps } from '../../interface/list';
import { debounce } from 'lodash';

const Index: React.FC<IListSearchProps> = ({
  options,
  onChange,
  itemRender,
  type = 'radio',
  value,
  optionsStyle,
  showSearch = true,
  classifyValue
}) => {
  const [localOptions, setLocalOptions] = React.useState<IOptions7<string>[]>(options);

  useEffect(() => {
    if (value) {
      options.forEach(item => (item.checked = value?.includes(item.value)));
    }
    setLocalOptions([...options]);
  }, [options, value]);

  // 选中事件
  const changeCheckBox = (checked: boolean, i: number) => {
    localOptions[i].checked = checked;
    const newOptions = [...localOptions];
    setLocalOptions(newOptions);
    if (type === 'radio') {
      onChange?.([newOptions[i].value], localOptions[i], newOptions);
    } else {
      onChange?.(
        newOptions.filter(item => item.checked).map(item => item.value),
        localOptions[i],
        newOptions
      );
    }
  };

  const itemClick = (e: IOptions7<string>, i: number) => {
    // 多选模式不做处理
    if (type === 'checkbox') {
      changeCheckBox(!options[i].checked, i);
    } else {
      const keys: string[] = [];
      const newOptions: IOptions7<string>[] = [];
      localOptions.forEach((item, i2) => {
        if (i === i2) {
          item.checked = !item.checked;
        } else {
          item.checked = false;
        }
        if (item.checked) {
          keys.push(item.value);
        }
        newOptions.push(item);
      });
      setLocalOptions(newOptions);
      onChange?.(keys, e, newOptions);
    }
  };

  const checkNum = localOptions.filter(item => item.checked).length;

  const defIconRender = (item: IOptions6<string>) => {
    if (!onChange) {
      return <></>;
    }
    if (type === 'checkbox') {
      return (
        <Checkbox disabled={item.disabled} checked={item.checked} style={{ marginRight: 6 }} />
      );
    }
    return <Radio disabled={item.disabled} checked={item.checked} style={{ marginRight: 6 }} />;
  };

  // 查询设置
  const searchItem = debounce((val: string) => {
    const newOptions = options.filter(
      item => (item.label as string).includes(val) || item.value.includes(val)
    );
    setLocalOptions(newOptions);
  }, 400);

  return (
    <div>
      <div
        className="theling_search"
        style={{
          display: showSearch ? 'block' : 'none'
        }}
      >
        <Input
          prefix={<SearchOutlined />}
          variant="borderless"
          placeholder="搜索"
          onChange={e => {
            searchItem(e.target.value);
          }}
        />
      </div>
      {showSearch && onChange && (
        <div className="theling_okSelect">
          <span>已选{checkNum} 项</span>
        </div>
      )}
      <div className="theling_options" style={optionsStyle}>
        <div style={{ display: localOptions.length > 0 ? 'block' : 'none' }}>
          {localOptions.map((item, index) => {
            if (classifyValue) {
              // @ts-ignore
              item.count = `(${classifyValue[item.value] || 0})`;
              // @ts-ignore
              item.showCount = !!classifyValue;
            }
            if (itemRender) {
              return itemRender(item);
            }
            return (
              <ItemBar<IOptions6<string>>
                boxShadow={false}
                clickMatter={e => !item.disabled && itemClick(e, index)}
                key={item.value}
                item={item}
                barTitleKey="label"
                extra={item.description}
                iconRender={() => defIconRender(item)}
              />
            );
          })}
        </div>
        {localOptions.length === 0 && (
          <div style={{ padding: '7px 0 7px 10px' }}>
            <span style={{ color: '#717484' }}>
              {showSearch ? '没有找到想要的数据' : '暂无数据'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
