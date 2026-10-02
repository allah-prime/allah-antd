import { ArrayUtil } from '../../theling-utils';
import type { IAntTreeNode } from '../../theling-utils/@types/IZlData';
import { Tree } from 'antd';
import type { EventDataNode } from 'antd/es/tree';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { getAllChild } from './AsyncTreeMini';
import { updateTreeData } from './index';
import type { IAsyncTreePlusProps } from './interface';

const nodeMaps = new Map<string, IAntTreeNode>();
const parentKeys = new Set<string>();
let itemKeys: string[] = [];

// 重置上面的数据
const resetData = () => {
  nodeMaps.clear();
  parentKeys.clear();
  itemKeys.length = 0;
};

/**
 * 默认的文本渲染
 * @param item
 */
export const defTextRender = (item: IAntTreeNode) => (
  <>
    <span style={{ fontWeight: 700 }}>({item.value})</span>
    {item.title}
  </>
);

/**
 * 异步树选择器
 * @constructor
 */
const AsyncTreePlus: React.FC<IAsyncTreePlusProps> = props => {
  const {
    value,
    asyncReq,
    onChange,
    titleRender = defTextRender,
    expandedKeysReq,
    treeRef,
    disableLevel,
    checkable = true,
    showLine = true
  } = props;
  const [loading, setLoading] = useState<boolean>(false);

  // （受控）展开指定的树节点
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  // （受控）选中复选框的树节点
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  // 	是否自动展开父节点
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = React.useState<IAntTreeNode[]>([]);

  const valueStr = value?.join(';');

  const initValue = () => {
    // 如果两个数据相同，就展开对应的节点
    if (ArrayUtil.isEqual(value, itemKeys)) {
      return;
    }
    autoExpandParentFunc();
  };

  useEffect(() => {
    if (!props.value || props.value?.length === 0) {
      setCheckedKeys([]);
      setExpandedKeys([]);
    } else {
      initValue();
    }
  }, [valueStr]);

  useEffect(() => {
    // 第一级的节点必须要有
    getTreeData().then(res => {
      res.forEach(item => {
        if (disableLevel && item.value.length <= disableLevel) {
          item.disabled = true;
        }
      });
      setTreeData(res);
    });
    return resetData;
  }, []);

  // 获取接口的数据
  const getTreeData = async (code?: string) => {
    const res = await asyncReq(code);
    // 如果是父节点，那么就加到父亲组里面去
    if (res.length > 0) {
      res.forEach(item => {
        if (!item.isLeaf) {
          parentKeys.add(item.key);
        }
        if (disableLevel && item.value.length <= disableLevel) {
          item.disabled = true;
        }
        nodeMaps.set(item.key, item);
      });
    }
    return res;
  };

  useImperativeHandle(treeRef, () => ({
    refresh: asyncTreeDataFunc,
    asyncRefresh: asyncTreeDataFunc,
    deleteByValue: (item: IAntTreeNode) => {
      const index = checkedKeys.indexOf(item.value);
      // 需要移除的数据
      const delKey: string = checkedKeys[index];
      const delKeys: string[] = [delKey];
      const delNode: IAntTreeNode = nodeMaps.get(delKey)!;
      // 先判断是否是父节点
      if (parentKeys.has(delKey)) {
        // 获取所有的子节点
        const childKeys = getAllChild(delNode);
        delKeys.concat(childKeys.map(item => item.key));
      }
      // 从checkedKeys移除delKeys
      const newCheckedKeys = checkedKeys.filter(item => !delKeys.includes(item as string));
      console.log('newCheckedKeys', newCheckedKeys);
      onCheck(newCheckedKeys);
    }
  }));

  /**
   * 异步获取数据
   * @param pcode 父编码
   */
  const asyncTreeDataFunc = async (pcode: string) => {
    const res = await getTreeData(pcode);
    setTreeData(oldData => updateTreeData(oldData, pcode, res));
  };
  /**
   * 自动展开节点，按照key的顺序展开
   */
  const autoExpandParentFunc = async () => {
    setLoading(true);
    // 获取下全部需要展开的数据
    let treeValues: string[] = [];
    if (expandedKeysReq) {
      // 查询value所需要展开的节点
      treeValues = await expandedKeysReq?.(value!.join(';'));
    }
    const lenMap: Record<number, string[]> = {};
    // 将value的数据按照长度来进行分组
    treeValues.forEach(v => {
      const len = v.length;
      if (lenMap[len]) {
        lenMap[len].push(v);
      } else {
        lenMap[len] = [v];
      }
    });
    // 按照长度进行排序
    const lenArr: string[] = Object.keys(lenMap).sort((a, b) => Number(a) - Number(b));
    // 按照长度进行展开
    for (let i = 0; i < lenArr.length; i++) {
      const len = lenArr[i];
      const arr: string[] = (lenMap as any)[len];
      // 调用接口，获取对应的数据，再把数据给渲染到树节点上
      for (let j = 0; j < arr.length; j++) {
        const v = arr[j];
        await asyncTreeDataFunc(v);
      }
    }
    // 展开和选择对应的节点
    setCheckedKeys(value!);
    setExpandedKeys(treeValues!);
    setLoading(false);
  };

  // 展开/收起节点时触发
  const onExpand = (
    expandedKeysValue: React.Key[],
    info: {
      node: EventDataNode<IAntTreeNode>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    }
  ) => {
    let allChildKeys: string[] = [];
    if (!info.expanded) {
      // 获取全部的子节点的key
      allChildKeys = getAllChild(info.node).map(item => item.key);
    }
    // 将子节点从展开的节点中去除
    if (allChildKeys.length > 0) {
      expandedKeysValue = expandedKeysValue.filter(item => !allChildKeys.includes(item as string));
    }
    setExpandedKeys(expandedKeysValue as string[]);
    setAutoExpandParent(false);
  };

  // 点击复选框触发
  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue);
    // 循环数据，如果数据的父节点在选中的节点中，那么这个数据就不要了
    const newCheckedKeys = checkedKeysValue.filter((item: string) => {
      const parent = nodeMaps.get(item)!.pcode;
      return !checkedKeysValue.includes(parent);
    });
    itemKeys = newCheckedKeys;
    onChange?.(newCheckedKeys);
    // 从map中获取对应的数据，然后加到新数组中，再调用onItemChange传递出去
    const newCheckedData = newCheckedKeys.map((item: string) => nodeMaps.get(item));
    props.onItemChange?.(newCheckedData);
  };

  // 点击树节点触发
  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    props.onSelect?.(selectedKeysValue, info);
  };

  return (
    <div style={props.treeStyle}>
      {loading ? (
        <span>加载中...</span>
      ) : (
        <Tree<IAntTreeNode>
          disabled={props.disabled}
          loadData={v => asyncTreeDataFunc(v.key)}
          treeData={treeData}
          showLine={showLine}
          checkable={checkable}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          titleRender={titleRender}
        />
      )}
    </div>
  );
};

export default AsyncTreePlus;
