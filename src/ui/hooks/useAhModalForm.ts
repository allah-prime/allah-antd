import type { ProFormInstance } from '@ant-design/pro-components';
import { useRequest, useSize } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import type { IUseAhModalFormProps, IUseAhModalFormReturn } from './interface';
import { FileUpload2Fun } from '../../theling-utils';

/**
 * useAhModalForm 钩子函数
 *
 * 用于管理模态表单的状态、数据加载和提交操作的自定义Hook
 * 集成了表单数据的加载、保存、重置功能，以及模态框的显示控制
 * 支持多个请求接口，可以分别管理它们的loading状态
 *
 * @template T 表单数据类型
 * @param {IUseAhModalFormProps<T>} params 配置参数
 * @param {string | number} [params.id] 数据ID，用于获取详情数据
 * @param {Function} params.infoRequest 获取详情数据的主请求函数
 * @param {Object} [params.extraRequests] 额外的请求函数对象，用于加载次要数据
 * @param {Function} [params.onSuccess] 成功获取详情数据后的回调函数
 * @param {number} [params.defWidth=90] 默认模态框宽度
 * @param {number[]} [params.defWidthOpt=[75, 90]] 不同屏幕宽度下的模态框宽度选项
 *
 * @returns {IUseAhModalFormReturn<T>} 包含状态和方法的对象
 */
function useAhModalForm<T = any>({
  id,
  infoRequest,
  extraRequests,
  onSuccess,
  defWidth = 90,
  defWidthOpt = [75, 90]
}: IUseAhModalFormProps<T>): IUseAhModalFormReturn<T> {
  // 控制主表单加载状态
  const [loading, setLoading] = useState(false);
  // 控制额外请求的加载状态
  const [extraLoadingMap, setExtraLoadingMap] = useState<Record<string, boolean>>({});
  // 控制模态框显示状态
  const [visible, setVisible] = useState(false);
  // 定义关联的数据，用于存储表单中的关联数据列表
  const [relListObj, setRelListObj] = useState<Record<string, string[]>>({});
  // 合并后的完整数据
  const [mergedData, setMergedData] = useState<T>({} as T);
  // 表单实例引用
  const formRef = useRef<ProFormInstance>(undefined);
  // 文件上传功能引用
  const uploadRef = useRef<FileUpload2Fun>({} as FileUpload2Fun);

  // 更新合并数据的函数
  const updateMergedData = (mainData: T | undefined, extraData: Record<string, any> = {}) => {
    const newData = {
      ...(mainData || {}),
      ...Object.entries(extraData).reduce(
        (acc, [_, data]) => ({
          ...acc,
          ...data
        }),
        {}
      )
    } as T;
    setMergedData(newData);
    formRef.current?.setFieldsValue(newData);
    console.log('合并后的newData:', newData);
  };

  // 使用ahooks的useRequest加载详情数据
  const infoReq = useRequest(infoRequest, {
    manual: true,
    onSuccess: (res) => {
      // 获取数据成功后，更新合并数据
      updateMergedData(res);
      // 调用成功回调
      onSuccess?.(res);
    }
  });

  // 创建额外请求的请求实例
  const extraReqMap = {} as Record<string, any>;
  const extraDataRef = useRef<Record<string, any>>({});

  // 如果提供了额外请求，创建对应的请求实例
  if (extraRequests) {
    Object.entries(extraRequests).forEach(([key, request]) => {
      // 使用useRequest创建请求实例，并存储到extraReqMap中
      const req = useRequest(request, {
        manual: true,
        onSuccess: (extraData) => {
          // 更新额外数据引用
          extraDataRef.current = {
            ...extraDataRef.current,
            [key]: extraData
          };

          // 更新合并数据
          updateMergedData(infoReq.data, extraDataRef.current);

          // 更新额外请求的loading状态
          setExtraLoadingMap((prev) => ({
            ...prev,
            [key]: false
          }));
        }
      });
      extraReqMap[key] = req;
    });
  }

  // 获取根元素大小，用于响应式调整模态框宽度
  const size = useSize(document.getElementById('root'));

  // 根据屏幕大小计算模态框宽度
  const width = defWidth || (size?.width || 0) > 1300 ? defWidthOpt[0] : defWidthOpt[1];

  // 当ID变化或模态框显示状态变化时，加载数据或重置表单
  useEffect(() => {
    if (id) {
      // 重置额外数据
      extraDataRef.current = {};
      // 加载主请求数据
      infoReq.run(id);

      // 如果有额外请求，加载额外请求数据
      if (extraRequests) {
        Object.entries(extraRequests).forEach(([key]) => {
          // 设置对应请求的loading状态为true
          setExtraLoadingMap((prev) => ({
            ...prev,
            [key]: true
          }));

          // 执行额外请求
          if (extraReqMap[key]) {
            extraReqMap[key].run(id);
          }
        });
      }
    } else {
      // 重置所有数据
      extraDataRef.current = {};
      setMergedData({} as T);
      formRef.current?.resetFields();
    }
  }, [id, visible]);

  /**
   * 提交表单数据
   * 触发表单的提交操作
   */
  const submit = async () => {
    formRef.current?.submit();
  };

  /**
   * 重置数据
   * 重置所有状态和表单数据
   */
  const resetData = () => {
    setLoading(false);
    setExtraLoadingMap({});
    setVisible(false);
    setRelListObj({});
    extraDataRef.current = {};
    setMergedData({} as T);
    formRef?.current?.resetFields();
  };

  /**
   * 手动加载特定的额外数据
   * @param {string} key 要加载的数据键名
   */
  const loadExtraData = (key: string) => {
    if (id && extraReqMap[key]) {
      setExtraLoadingMap((prev) => ({
        ...prev,
        [key]: true
      }));
      extraReqMap[key].run(id);
    }
  };

  // 返回包含状态和方法的对象
  return {
    width, // 模态框宽度
    loading, // 主请求加载状态
    setLoading, // 设置主请求加载状态的函数
    extraLoadingMap, // 额外请求的加载状态映射
    loadExtraData, // 手动加载额外数据的函数
    formRef, // 表单实例引用
    uploadRef, // 文件上传引用
    relListObj, // 关联数据对象
    setRelListObj, // 设置关联数据的函数
    submit, // 提交表单的函数
    infoReq, // 获取详情的主请求对象
    extraReqMap, // 额外请求对象映射
    visible, // 模态框显示状态
    setVisible, // 设置模态框显示状态的函数
    resetData, // 重置数据的函数
    data: mergedData, // 当前表单数据（包含主数据和所有额外数据）
    updateData: (v: T) => {
      // 更新表单数据的函数
      infoReq.mutate(v);
      updateMergedData(v, extraDataRef.current);
    }
  };
}

export default useAhModalForm;
