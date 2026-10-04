import { asyncUtils } from '@allahjs/utils';
import { useRequest } from 'ahooks';
import React from 'react';
import type { IUseItemDetailsModalReqProps } from './interface';

function useItemDetailsModalReq<T>({ req, id }: IUseItemDetailsModalReqProps<T>): {
  /**
   * 打开弹窗
   * @param item 打开的数据
   * @param v 显示和隐藏的控制
   */
  openModal: (id?: any) => void;
  /**
   * 当前是否显示弹窗
   */
  visible: boolean;
  /**
   * 关闭弹窗
   */
  closeModal: () => void;
  /**
   * 修改弹出框的显示和隐藏
   */
  setVisible: (flag: boolean) => void;
  /**
   * 请求数据的loading
   */
  loading: boolean;
  /**
   * 刷新数据
   */
  refresh: () => void;
  /**
   * 数据
   */
  data: T;
} {
  // 详情的弹出和隐藏
  const [visible, setVisible] = React.useState(false);

  const infoReq = useRequest(req, {
    manual: true
  });

  /**
   * 打开弹窗
   */
  const openModal = (newId: string = id) => {
    // 判断是否登录
    setVisible(true);
    // 为了避免动画卡顿，需要先延迟，让弹窗弹出来
    asyncUtils.delay(100).then(() => {
      // 然后去请求数据
      infoReq.run(newId);
    });
  };

  const closeModal = () => {
    setVisible(false);
    // infoReq数据清空
    infoReq.mutate(undefined);
  };

  return {
    openModal,
    visible,
    closeModal,
    setVisible,
    loading: infoReq.loading,
    refresh: infoReq.refresh,
    data: infoReq.data || ({} as T)
  };
}

export default useItemDetailsModalReq;
