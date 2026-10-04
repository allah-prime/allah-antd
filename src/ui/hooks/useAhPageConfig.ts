import type { ActionType } from '@ant-design/pro-components';
import { useGetState, useSize } from 'ahooks';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useRef } from 'react';
import type { IUseAhPageConfigProps } from './interface';

/**
 * 获取一个页面需要的基本配置
 */
function useAhPageConfig<T>({
  defValue = {} as T,
  subHeight = 206,
  containerHeight = window.innerHeight,
  enterAltitude
}: IUseAhPageConfigProps<T>): {
  searchRef: MutableRefObject<any>;
  actionRef: MutableRefObject<ActionType | undefined>;
  scrollY: number | string;
  params: T;
  setParams: Dispatch<SetStateAction<T>>;
  updateParams: (newParams: T) => void;
  /**
   * 获取当前最新的参数
   */
  getParams: () => T;
} {
  const [params, setParams, getParams] = useGetState<T>({ ...defValue });
  const searchRef = useRef<any>(undefined);
  const actionRef = useRef<ActionType>(undefined);
  const height = useSize(searchRef)?.height || 0;
  const scrollY = enterAltitude ? enterAltitude : containerHeight - subHeight - height;

  // 更新参数
  const updateParams = (newParams: T) => {
    setParams({ ...params, ...newParams });
  };

  return {
    searchRef,
    actionRef,
    scrollY,
    params,
    setParams,
    updateParams,
    getParams
  };
}

export default useAhPageConfig;
