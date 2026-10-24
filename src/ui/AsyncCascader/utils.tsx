import type { DefaultOptionType } from 'antd/lib/cascader';
import type { IAsyncCascaderProps } from './interface';

export const asyncLoadData = (
  selectedOptions: DefaultOptionType[],
  asyncReq: IAsyncCascaderProps['asyncReq'],
  callBack: (e: any[]) => void,
  oldData: any[]
) => {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  // 如果已经有数据了，就不去获取新的数据
  if (targetOption.children) {
    targetOption.loading = false;
    return;
  }
  targetOption.loading = true;
  asyncReq(targetOption.value as any).then(res => {
    targetOption.loading = false;
    targetOption.children = res;
    callBack([...oldData]);
  });
};
/**
 * 渲染内容
 * @param text 用户选择的内容
 * @param label 模拟表单的label
 * @param placeholder 默认的占位符
 */
export const buildText = (
  text: string | undefined,
  label: string,
  placeholder: string | undefined
) => {
  // 对显示的内容进行截取
  let newText = undefined;
  if (text) {
    newText = text && text?.length > 8 ? `${text?.slice(0, 8)}...` : text;
  }
  // 如果有label，并且用户选择了值
  if (label && newText) {
    return (
      <>
        &nbsp;{label}:&nbsp;{newText}&nbsp;
      </>
    );
  }
  // 如果有label，但是用户没有选择值
  if (label && !newText) {
    return <>&nbsp;{label}&nbsp;</>;
  }
  // 如果有newText但是没有label
  if (newText) {
    return <>&nbsp;{newText}&nbsp;</>;
  }
  return <>&nbsp;{placeholder}&nbsp;</>;
};
