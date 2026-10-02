import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import type { IAntTreeNode } from '../../theling-utils/@types/IZlData';
import { Cascader } from 'antd';
import lodash from 'lodash';
import React, { useEffect, useState } from 'react';
import './index.less';
import type { IAsyncCascaderProps } from './interface';
import { asyncLoadData, buildText } from './utils';

const Index: React.FC<IAsyncCascaderProps> = ({
  asyncReq,
  onChange,
  value,
  cascaderProps = {},
  label = '',
  disabled,
  type,
  multiple = true,
  placeholder,
  allowClear = true,
  ...props
}): React.ReactElement => {
  const [options, setOptions] = useState<IAntTreeNode[]>([]);

  // 用户选择后要显示的内容
  const [text, setText] = useState<string>();

  const [selectItems, setSelectItems] = useState<string[] | string[][] | undefined>(value);
  // 删除icon
  const [delIcon, setDelIcon] = useState(false);

  useEffect(() => {
    asyncReq().then((res) => {
      setOptions(res);
    });
  }, []);

  useEffect(() => {
    // 比较value是否变化
    if (Array.isArray(value) && Array.isArray(selectItems)) {
      // 如果都是数组，就比较长度
      if (value.length !== selectItems.length) {
        updatevaue();
      } else if (value.join(',') !== selectItems.join(',')) {
        updatevaue();
      } else if (value.length > 0 && text === undefined) {
        updatevaue();
      }
    } else if (value !== selectItems) {
      updatevaue();
    }
  }, [value]);

  const updatevaue = () => {
    const valueStr = Array.isArray(value) ? value?.join(',') : value;
    if (props.valueText) {
      setText(props.valueText);
      setSelectItems(value);
      return;
    }
    if (valueStr && valueStr?.length > 0) {
      if (!props.valuesReq) {
        console.error('selectDefList 没有被配置');
      }
      // 调用接口获取中文
      props.valuesReq?.(valueStr).then((res) => {
        const newText = res.map((item) => item.label || (item as any).disName).join('/');
        setSelectItems(value);
        setText(newText);
      });
    } else {
      setText('');
      setSelectItems([]);
    }
  };

  const onValueChange = (v: any[], v2: any[]) => {
    setSelectItems(v);
    if (multiple) {
      // 二维数组打平
      v2 = lodash.flattenDeep(v2);
      onChange?.(v, v2);
      setText(v2.map((item) => item.label).join('/'));
    } else {
      const changeValue = v.length >= 1 ? v[v.length - 1] : [];
      setText(v.length >= 1 ? v2[v2.length - 1]?.label : '');
      onChange?.(changeValue, v2);
    }
  };

  console.log('text', text);

  const delIconChange = () => {
    // 如果移入的时候有值，就显示
    if (text && allowClear) {
      setDelIcon(true);
    }
  };

  const buildClassName = () => {
    if (type === 'form') {
      return 'theling-antd-AsyncCascader';
    }
    if (text && text.length > 0) {
      return 'theling-antd-AsyncCascader theling-antd-AsyncCascader-active';
    }
    return 'theling-antd-AsyncCascader';
  };

  if (props.defStyle) {
    return (
      <Cascader
        value={selectItems}
        style={{ marginLeft: 12 }}
        options={options}
        loadData={(v2) => asyncLoadData(v2, asyncReq, setOptions, options)}
        onChange={onValueChange}
        changeOnSelect
        disabled={disabled}
        {...cascaderProps}
      />
    );
  }

  return (
    <Cascader
      value={selectItems}
      style={{ marginLeft: 12 }}
      options={options}
      loadData={(v2) => asyncLoadData(v2, asyncReq, setOptions, options)}
      onChange={onValueChange}
      changeOnSelect
      disabled={disabled}
      {...cascaderProps}
    >
      <div
        className={buildClassName()}
        onMouseEnter={delIconChange}
        onMouseLeave={() => setDelIcon(false)}
      >
        <span>{buildText(text, label, placeholder)}</span>
        {!disabled &&
          (delIcon ? (
            <CloseOutlined
              style={{
                display: 'inline-block',
                borderRadius: '100%',
                width: '16px',
                height: '16px',
                fontSize: 8,
                lineHeight: '16px',
                color: '#fff',
                backgroundColor: '#acacac'
              }}
              onClick={() => {
                setDelIcon(false);
                onValueChange([], ['']);
              }}
            />
          ) : (
            <DownOutlined
              style={{
                fontSize: 14,
                lineHeight: '16px',
                width: '16px',
                height: '16px'
              }}
            />
          ))}
      </div>
    </Cascader>
  );
};

export default Index;
