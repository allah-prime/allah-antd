import { arrayUtils } from '@allahjs/utils';
import { useEffect, useState } from 'react';
import type { IUseCustomFormItemProps } from './interface';

/**
 * 自定义表单组件需要使用到的hooks
 */
function useCustomFormItem<T = any>({
  value,
  defValReq,
  onSetValues,
  valueKey = 'value',
  setLoading
}: IUseCustomFormItemProps<T>) {
  // 选择的数据
  const [items, setItems] = useState<T[]>([]);
  const [itemKeys, setItemKeys] = useState<string[]>([]);

  // form的值变化
  const valueStr = value?.join(';');

  // 表单变化监听的方法
  useEffect(() => {
    if (!value || value?.length === 0) {
      setItems([]);
      setItemKeys([]);
    } else {
      onValueChange();
    }
  }, [valueStr]);

  // 当表单的值发生变化了，就会触发这个方法
  const onValueChange = async () => {
    // 需要监听下value的变化，当value被form表单赋值的时候，需要重新请求数据
    const keys = items.map((item: any) => item[valueKey]);
    // 检查keys和value是否相等，如果不相等，就需要重新请求数据
    if (arrayUtils.isEqual(keys, value)) {
      return;
    }
    setLoading?.(true);
    // 调用初始化的方法
    const defValue = await defValReq?.(value!);
    // 赋值
    if (defValue) {
      setItems(defValue);
      setItemKeys(defValue.map((item: any) => item[valueKey]));
      onSetValues?.(defValue);
    }
    setLoading?.(false);
  };

  return {
    items,
    setItems,
    itemKeys,
    setItemKeys
  };
}

export default useCustomFormItem;
