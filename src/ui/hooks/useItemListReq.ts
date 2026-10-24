import type { ITablePage } from '@allahjs/utils';
import { defaultTableData } from '@allahjs/utils';
import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import type { IItemListReqProps, IItemListReqReturnProps } from './interface';

function useItemListReq<T, F>({
  params,
  listReq,
  keyword,
  setRefCallBack,
  refCallBack,
  onSuccess
}: IItemListReqProps<T, F>): IItemListReqReturnProps<T, F> {
  const listData = useRequest<ITablePage<T>, F[]>(v => listReq({ ...params, ...v, keyword }), {
    manual: true,
    debounceWait: 400,
    onSuccess
  });

  const mutateCallBack = (v: T, index: number, action?: 'de' | 'up') => {
    if (action === 'de') {
      listData.data!.records.splice(index, 1);
      listData.mutate(listData.data);
    } else {
      listData.data!.records[index] = v;
      // 立即变更数据
      listData.mutate(listData.data);
    }
  };

  const paramsStr = JSON.stringify(params);
  useEffect(() => {
    listData.run({ ...params, pageNum: 1 });
  }, [keyword, paramsStr]);

  useEffect(() => {
    if (refCallBack) {
      listData.refresh();
      setRefCallBack?.(false);
    }
  }, [refCallBack]);

  return {
    data: listData.data || defaultTableData,
    loading: typeof listData.loading === 'boolean' ? listData.loading : true,
    run: listData.run,
    setRefCallBack: v => setRefCallBack?.(v),
    mutateCallBack,
    resetData: () => listData.mutate(defaultTableData)
  };
}

export default useItemListReq;
