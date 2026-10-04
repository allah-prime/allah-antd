import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { ISelectTreeProps } from '../interface/component';

/**
 * 说明：异步加载的树选择组件
 * @author zhaoyantong（miaoduidui完善的）
 * @date 2021/9/18
 */
const SelectTree: React.FC<ISelectTreeProps> = ({
  currentMapData,
  asyncTreeData,
  treePcode,
  serviceProvince,
  acCount,
  dateVisit,
  queries,
  defLabel
}) => {
  const [valueData, setValueData] = useState('(000000)全国');
  let [treeData, setTreeData] = useState([] as any[]);
  // 切换筛选类型
  const changeArea = (value: any) => {
    currentMapData(value);
    serviceProvince?.(value);
    setValueData(value);
    acCount?.(value);
    dateVisit?.(value);
    queries?.(value);
  };
  // 异步树加载
  const onLoadData = async ({ id }: any) => {
    const newTreeData = await asyncTreeData(id);
    newTreeData.forEach((it: any) => {
      treeData.push({
        id: it.code,
        pId: it.pcode,
        value: it.ac,
        title: `(${it.ac || it.code})${it.name}`,
        ac: it.ac,
        isLeaf: it.nodeType === '0'
      });
    });
    setTreeData([...treeData]);
  };

  useEffect(() => {
    asyncTreeData(treePcode).then(async res => {
      if (res.length === 0) {
        return;
      }
      treeData = [];
      treeData.push({
        id: res[0].code,
        pId: res[0].pcode,
        value: res[0].ac,
        title: `(${res[0].ac || res[0].code})${res[0].name}`,
        ac: res[0].ac,
        isLeaf: res[0].nodeType === '0'
      });
      setTreeData([...treeData]);
    });
  }, []);
  return (
    <>
      <span style={{ marginRight: 10, fontSize: 14, fontWeight: 400 }}>{defLabel || '区域'}</span>
      {treeData.length ? (
        <TreeSelect
          variant="borderless"
          treeDataSimpleMode
          style={{
            width: 280,
            maxWidth: 320,
            backgroundColor: '#f5f5f5',
            fontWeight: 400
          }}
          value={valueData}
          styles={{ popup: { root: { maxHeight: 400, overflow: 'auto' } } }}
          onChange={changeArea}
          loadData={onLoadData as any}
          treeData={treeData}
        />
      ) : (
        '加载中...'
      )}
    </>
  );
};

export default SelectTree;
