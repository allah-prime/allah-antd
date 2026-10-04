import type { IBaseFilter, ITablePage } from '@allahjs/utils';
import { defaultTableData } from '@allahjs/utils';
import type { SortOrder } from 'antd/es/table/interface';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import useAhPageConfig from './useAhPageConfig';
import { handleReqListParams } from '@allahjs/utils';
import type { IReturnProps, IUseItemTableProps } from './interface';

function useItemTable<T, F extends IBaseFilter>({
  request,
  defValue = {} as F,
  autoRequest = false,
  subHeight,
  containerHeight,
  debounceTime = 400
}: IUseItemTableProps<T, F>): IReturnProps<T, F> {
  const { searchRef, actionRef, scrollY, params, setParams } = useAhPageConfig({
    defValue,
    subHeight,
    containerHeight
  });

  const [data, setData] = useState<ITablePage<T>>(defaultTableData);

  const tableReq = async (v: F, sort?: Record<string, SortOrder>) => {
    v = handleReqListParams(v, sort);
    const res = await request({ ...params, ...v });
    const newRes = {
      ...res,
      data: res.records,
      page: res.current,
      success: true
    };
    setData(newRes);
    return newRes;
  };

  // 查询设置
  const updateParams = debounce((val: F) => {
    // 节流
    setParams((oldV: any) => ({ ...defValue, ...oldV, ...val }));
  }, debounceTime);

  const paramsStr = JSON.stringify(params);

  useEffect(() => {
    if (autoRequest) {
      if (actionRef.current) {
        actionRef.current.reload();
      } else {
        tableReq(params);
      }
    }
  }, [paramsStr]);

  const refresh = async () => {
    if (actionRef.current) {
      actionRef.current.reload();
    } else {
      tableReq(params);
    }
  };

  const asyncRefresh = () => {
    refresh();
  };

  return {
    params,
    setParams,
    tableReq,
    actionRef,
    searchRef,
    scrollY,
    refresh,
    asyncRefresh,
    updateParams,
    data
  };
}

export default useItemTable;
