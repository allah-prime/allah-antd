import { useEffect, useState } from 'react';
import type { IUseItemListSelectProps } from './interface';

/**
 * 用于进行资源列表管理的hooks。可以查看theling-jyfw项目中的具体使用
 */
function useItemListSelect<T = any, K = any>({
  initFunc,
  refreshId,
  removeMap,
  addMap,
  onChange,
  valueKey = 'id',
  mode = 'multiple'
}: IUseItemListSelectProps<T, K>) {
  const [selectKeyList, setSelectKeyList] = useState<K[]>([]);
  const [selectItemList, setSelectItemList] = useState<T[]>([]);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // 刷新的时候 或者是进入页面的时候
  const initData = async () => {
    if (!initFunc) {
      return;
    }
    setRefreshLoading(true);
    let res: any[] = [];
    try {
      res = await initFunc();
      // 列表
      setSelectItemList(res);
      // 列表的key
      setSelectKeyList(res.map(item => item[valueKey]));
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => {
      setRefreshLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (refreshId) {
      initData();
    }
  }, [refreshId]);

  const delItems = (item: T) => {
    // @ts-ignore
    const index = selectKeyList.indexOf(item[valueKey]);
    selectKeyList.splice(index, 1);
    selectItemList.splice(index, 1);
    setSelectItemList([...selectItemList]);
    setSelectKeyList([...selectKeyList]);
    onChange?.(selectKeyList);
    // @ts-ignore
    removeMap?.(item[valueKey]);
  };

  const addItems = (item: T) => {
    // @ts-ignore
    if (selectKeyList.includes(item[valueKey])) {
      return;
    }
    // 如果是单选的话，就先清空
    if (mode === 'single') {
      selectItemList.splice(0, selectItemList.length);
      selectKeyList.splice(0, selectKeyList.length);
    }
    selectItemList.push(item);
    // @ts-ignore
    selectKeyList.push(item[valueKey]);
    setSelectItemList([...selectItemList]);
    setSelectKeyList([...selectKeyList]);
    onChange?.(selectKeyList);
    // @ts-ignore
    addMap?.(item[valueKey]);
  };

  // 重置数据
  const resetData = () => {
    setSelectItemList([]);
    setSelectKeyList([]);
  };

  return {
    refreshLoading,
    delItems,
    addItems,
    initData,
    selectKeyList,
    selectItemList,
    setSelectKeyList,
    setSelectItemList,
    setRefreshLoading,
    resetData
  };
}

export default useItemListSelect;
