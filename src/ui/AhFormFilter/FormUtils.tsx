import { DeleteOutlined } from '@ant-design/icons';
import type { IOptions7, IDefSysDefinedAttributes } from '@allahjs/utils';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import type { IAhSysDefinedAttributes } from './config';
import { ProFormColumnsType } from '@ant-design/pro-components';

/**
 * 是否显示选项
 * @param item
 */
export const showOpt = (item: IAhSysDefinedAttributes): boolean => {
  if (item.dicGroupKey) {
    return false;
  }
  switch (item.attType) {
    case 'checkbox':
      return true;
    case 'select':
      return true;
    case 'radio':
      return true;
    default:
      return false;
  }
};

export type IBuildFormList = ProFormColumnsType & {
  other?: any;
  /**
   * 唯一的key
   */
  ahKey: string;
  /**
   * 表单类型的中文
   */
  valueTypeText: string;
};

/**
 * 用formList生成表单数据
 * @param formList formList数据
 * @param value 默认值
 * @param deleteClick 删除
 * @param prefix id的前缀
 */
export const buildFormList = (
  formList: IAhSysDefinedAttributes[],
  value: IDefSysDefinedAttributes<string>[] = [],
  deleteClick?: (id: string) => void,
  prefix?: string
): IBuildFormList[] =>
  formList.map(item => {
    // @ts-ignore
    const obj = value.find(v => v.attId === item.id);
    if (prefix && !item.id.startsWith(prefix)) {
      item.id = `${prefix}${item.id}`;
    }
    // @ts-ignore
    if (obj && obj.resValue) {
      if (item.attType.includes('date')) {
        // @ts-ignore
        item.defaultValue = dayjs(obj.resValue.value);
      } else {
        // @ts-ignore
        item.defaultValue = obj.resValue.value;
      }
    }
    const attType = item.attType;
    if (attType === 'checkbox') {
      item.attType = 'select';
    }
    const opt: IBuildFormList = {
      // TODO 这里需要判断是否有filedName这个字段
      // @ts-ignore
      dataIndex: item.filedName,
      ahKey: item.id,
      title: deleteClick ? (
        <span>
          {item.attLabel}
          <Tooltip title="删除">
            <DeleteOutlined style={{ marginLeft: 6 }} onClick={() => deleteClick(item.id)} />
          </Tooltip>
        </span>
      ) : (
        item.attLabel
      ),
      // @ts-ignore
      valueType: item.attType === 'text' ? undefined : item.attType,
      valueTypeText: item.attType === 'text' ? '文本' : item.attTypeText
    };
    if (item.defaultValue) {
      opt.initialValue = item.defaultValue;
    }
    if (showOpt(item)) {
      opt.valueEnum = item.options?.eum || {};
    }
    if (attType === 'checkbox') {
      opt.fieldProps = {
        mode: 'multiple'
      };
    }
    if (attType === 'select') {
      // 找出options.value数组中label最长的，然后设置popupMatchSelectWidth，不用reduce
      let max = 0;
      item.options?.value?.forEach((v: IOptions7<string>) => {
        if (v.label?.length > max) {
          max = v.label.length;
        }
      });
      // 组件可以撑开宽度了，所以不需要了
      opt.fieldProps = {
        showSearch: item.showSearch || false
        // popupMatchSelectWidth: max * 16
      };
    }
    opt.other = item;
    return opt;
  });

// 删除表单
export const removeFormItem = (
  id: string | number,
  defAttData: {
    formList: any[];
    columns: any[];
    values: any[];
    formListIds: string[];
  }
): {
  formList: any[];
  columns: any[];
  values: any[];
  formListIds: string[];
} => {
  if (!defAttData) {
    console.error('defAttData没有值诶');
    return { formList: [], columns: [], values: [], formListIds: [] };
  }
  const index = defAttData.formList.findIndex(item => item.id === id);
  // 根据index删除
  defAttData.columns.splice(index, 1);
  defAttData!.formList.splice(index, 1);
  defAttData!.formListIds.splice(index, 1);
  return {
    columns: [...defAttData.columns],
    formList: [...defAttData.formList],
    values: defAttData.values || [],
    formListIds: defAttData.formListIds ? [...defAttData.formListIds] : []
  };
};
