import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd-mobile';
import type { IAntTreeNode } from '../../theling-utils/@types/IZlData';
import { ArrayUtil } from '../../theling-utils';
import type { IAhCascaderProps, TCheckListValue } from '../interface';
import AhFromContent from '../AhFromContent';

const AhCascader: React.FC<IAhCascaderProps> = props => {
  const { onChange, label, rightDom, request, value = [], options, ...rest } = props;

  const [visible, setVisible] = useState(false);
  const [optValue, setOptValue] = useState<TCheckListValue[]>([]);
  const [treeData, setTreeData] = useState<IAntTreeNode[]>([]);

  useEffect(() => {
    if (request) {
      request().then(res => {
        setTreeData(res as IAntTreeNode[]);
      });
    } else if (options) {
      const { nodes } = ArrayUtil.dimTreeReduction2(options);
      setTreeData(nodes);
    }
  }, [options, request]);

  const valueStr = value.join(',');

  useEffect(() => {
    setOptValue(value);
  }, [valueStr]);

  const title = label || rest.title;

  const onValueChange = (v: TCheckListValue[]) => {
    setOptValue(v);
    onChange?.(v);
  };

  const formatOptions = (data: IAntTreeNode[]): any => {
    return data.map(item => ({
      label: item.label,
      value: item.value,
      children: item.children ? formatOptions(item.children) : undefined
    }));
  };

  const findLabelInTree = (nodes: IAntTreeNode[], val: TCheckListValue): string | undefined => {
    for (const node of nodes) {
      if (node.value === val) return node.label;
      if (node.children) {
        const found = findLabelInTree(node.children, val);
        if (found) return found;
      }
    }
    return undefined;
  };

  const valueRender = () => {
    if (optValue.length > 0) {
      return optValue
        .map(item => findLabelInTree(treeData, item))
        .filter(Boolean)
        .join(' / ');
    }
    return null;
  };

  return (
    <>
      <AhFromContent
        setVisible={setVisible}
        layout="horizontal"
        rightDom={rightDom}
        showValue={optValue.length > 0}
        valueRender={valueRender()}
        placeholder={rest.placeholder || '请选择'}
        disabled={rest.disabled}
      />
      <Cascader
        title={title}
        visible={visible}
        value={optValue}
        options={formatOptions(treeData)}
        onClose={() => setVisible(false)}
        onConfirm={onValueChange}
        {...rest}
      />
    </>
  );
};

export default AhCascader;
