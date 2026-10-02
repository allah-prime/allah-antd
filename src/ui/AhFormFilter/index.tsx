import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm, LightFilter } from '@ant-design/pro-components';
import { zlhash } from '../../theling-utils';
import type { IOptions7 } from '../../theling-utils/@types/IZlData';
import React, { useEffect } from 'react';
import AddFilter from './AddFilter';
import AhProFormColumns from './AhProFormColumns';
import type { IAhFormFilterProps } from './type';

/**
 * @description AhFormFilter 组件，结合了 LightFilter 和 BetaSchemaForm，提供动态筛选表单功能。
 * @template T - 表单数据类型
 * @param {IAhFormFilterProps<T>} props - 组件属性
 * @param {number} [props.defNum] - 默认显示的筛选条件数量
 * @param {ProFormColumnsType<T>[]} [props.columns=[]] - 表单列配置
 * @param {string[]} [props.disabledAttr=[]] - 禁用的筛选条件 dataIndex 列表
 * @param {(values: T) => Promise<void>} [props.onFinish] - 表单提交回调
 * @param {(changedValues: any, allValues: T) => void} [props.onValuesChange] - 表单值变化回调
 * @param {boolean} [props.loading] - 加载状态
 * @param {(values: T) => void} [props.onFilter] - 值变化时的回调（与 onValuesChange 类似，但可能用于特定筛选逻辑）
 * @param {React.ReactNode} [props.beforeForms] - 插入到 LightFilter 中的自定义表单项 (置于 LightFilter 的 columns 之后)
 * @param {ProFormColumnsType<T>[]} [props.beforeColumns] - 插入到 LightFilter 中的 columns (置于 LightFilter 的 columns 之前)
 * @param {React.MutableRefObject<ProFormInstance<T> | undefined>} [props.formRef] - BetaSchemaForm 的 ref
 * @param {React.MutableRefObject<ProFormInstance<T> | undefined>} [props.befFormRef] - LightFilter 的 ref
 * @param {FormInstance<T>} [props.form] - BetaSchemaForm 的 form 实例
 * @param {FormInstance<T>} [props.befForm] - LightFilter 的 form 实例
 * @returns {React.ReactElement}
 */
const Index = <T extends Record<string, any>>({
  defNum,
  columns = [],
  disabledAttr = [],
  onFinish,
  onValuesChange,
  loading,
  onFilter,
  beforeForms,
  beforeColumns,
  formRef,
  befFormRef,
  form,
  befForm
}: IAhFormFilterProps<T>) => {
  // 显示用的数据
  const [showColumns, setShowColumns] = React.useState<ProFormColumnsType<T>[]>([]);
  // AddFilter 组件需要的选项列表
  const [options, setOptions] = React.useState<IOptions7<string>[]>([]);
  // 组件唯一ID
  const domId = React.useMemo(() => `ah-${zlhash.getUuid()}`, []);

  useEffect(() => {
    let newShowColumns: ProFormColumnsType<T>[] = [];
    if (defNum && defNum > 0 && defNum <= columns.length) {
      // 按照defNum进行截取
      newShowColumns = columns.slice(0, defNum);
    } else {
      newShowColumns = columns;
    }
    // 这些是已经显示出来的选项
    const newShowKeys = newShowColumns.map(item => item.dataIndex as string);
    const newOptList: IOptions7<string>[] = columns.map(item => ({
      label: item.title as string,
      value: item.dataIndex as string,
      key: item.dataIndex as string,
      // 检查当前项是否在显示列表中
      checked: newShowKeys.includes(item.dataIndex as string),
      // 检查当前项是否被禁用
      disabled: disabledAttr.includes(item.dataIndex as string)
    }));
    setOptions(newOptList);
    setShowColumns(newShowColumns);
  }, [columns]); // 依赖项应包含所有影响 useEffect 逻辑的变量

  /**
   * @description 处理 AddFilter 中选项变化的回调
   * @param {string[]} value - 选中的 dataIndex 列表
   */
  const onChange = (value: string[]) => {
    // 根据选中的值过滤出需要显示的 columns
    const newShowColumns = columns.filter(item => value.includes(item.dataIndex as string));
    // 更新 AddFilter 的 options 状态
    const newOptList: IOptions7<string>[] = columns.map(item => ({
      label: item.title as string,
      value: item.dataIndex as string,
      key: item.dataIndex as string,
      checked: value.includes(item.dataIndex as string),
      disabled: disabledAttr.includes(item.dataIndex as string)
    }));
    setOptions(newOptList);
    setShowColumns(newShowColumns);
  };

  if (loading) {
    return <div className="theling-antd-AhFormFilter">正在加载...</div>;
  }

  if (columns.length === 0 && (!beforeColumns || beforeColumns.length === 0) && !beforeForms) {
    return <div className="theling-antd-AhFormFilter">无配置</div>;
  }

  /**
   * @description 统一处理 LightFilter 和 BetaSchemaForm 的值变化
   * @param {Partial<T>} changedValues - 变化的值
   * @param {T} allValues - 所有值
   */
  const onFormChange = (changedValues: Partial<T>, allValues: T) => {
    onFilter?.(allValues);
    onValuesChange?.(changedValues as T, allValues);
  };

  return (
    <div className="theling-antd-AhFormFilter">
      {(beforeColumns && beforeColumns.length > 0) || beforeForms ? (
        <LightFilter
          formRef={befFormRef as any}
          onFinish={onFinish}
          form={befForm}
          onValuesChange={onFormChange}
        >
          {beforeColumns && <AhProFormColumns columns={beforeColumns} />}
          {beforeForms}
        </LightFilter>
      ) : null}
      {columns.length > 0 && (
        <>
          <BetaSchemaForm
            formRef={formRef as any}
            form={form}
            id={domId} // 使用修复后的变量名
            layoutType="LightFilter"
            onValuesChange={onFormChange}
            columns={showColumns}
            onFinish={onFinish}
          />
          {/* 仅当 columns 数量大于默认显示数量时，才显示 AddFilter */}
          {columns.length > (defNum ?? columns.length) && (
            <AddFilter id={domId} options={options} onChange={onChange} />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
