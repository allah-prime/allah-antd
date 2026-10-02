import type { IAntTreeNode } from '../../theling-utils/@types/IZlData';
import { Tree } from 'antd';
import type { EventDataNode } from 'antd/es/tree';
import React, { useEffect } from 'react';
import { updateTreeData } from './index';
import type { IAsyncTreeMiniProps } from './interface';

/**
 * 获取当前节点的所有子节点
 */
export const getAllChild = (data: IAntTreeNode): IAntTreeNode[] => {
  let result: IAntTreeNode[] = [];
  if (data.children) {
    result = data.children;
    data.children.forEach(item => {
      result = result.concat(getAllChild(item));
    });
  }
  return result;
};

/**
 * 简洁版本的树控件
 */
const AsyncTreeMini: React.FC<IAsyncTreeMiniProps> = ({
  asyncTreeData,
  treeProps = {},
  treeSelect
}) => {
  const [treeData, setTreeData] = React.useState<IAntTreeNode[]>([]);

  const initTreeData = () => {
    asyncTreeData().then(res => {
      setTreeData(res);
    });
  };

  useEffect(() => {
    initTreeData();
  }, []);

  const asyncTreeDataFunc = async (treeNode: EventDataNode<IAntTreeNode>) => {
    const res = await asyncTreeData(treeNode.key);
    setTreeData(oldData => updateTreeData(oldData, treeNode.key, res));
  };

  if (treeData.length === 0) {
    return <span>加载中...</span>;
  }

  return (
    <Tree<IAntTreeNode>
      loadData={asyncTreeDataFunc}
      treeData={treeData}
      onSelect={(_, b) => treeSelect?.({ selected: b.selected, data: b.node })}
      {...treeProps}
    />
  );
};

export default AsyncTreeMini;
