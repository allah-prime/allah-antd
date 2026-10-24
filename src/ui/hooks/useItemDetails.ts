import React, { useState } from 'react';
import type { IUseItemDetailsProps } from './interface';

/**
 * 一般处理详情用到的hooks
 * <br />
 * 有弹窗的显示和隐藏，有选中的数据，有是否是详情
 * <br />
 * 这个不带请求的，如果需要请求，使用useItemDetailsModalReq
 */
function useItemDetails<T>(): IUseItemDetailsProps<T> {
  const [visible, setVisible] = React.useState(false);
  const [selectItem, setSelectItem] = React.useState<T>({} as T);
  const [isDetail, setIsDetail] = React.useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  /**
   * 打开弹窗
   * @param item 打开的数据
   * @param v 是否是详情
   */
  const openModal = (item: T, v: boolean) => {
    // 判断是否登录
    setSelectItem(item);
    setVisible(true);
    setIsDetail(v);
  };

  const setModalChange = (flag: boolean) => {
    setVisible(flag);
    setSelectItem({} as T);
    setIsDetail(true);
  };

  /**
   * 新增弹窗
   */
  const addModal = () => {
    setSelectItem({} as T);
    setVisible(true);
    setIsDetail(false);
  };

  return {
    openModal,
    visible,
    selectItem,
    isDetail,
    setModalChange,
    addModal,
    setIsDetail,
    setSelectItem,
    detailVisible,
    setDetailVisible
  };
}

export default useItemDetails;
