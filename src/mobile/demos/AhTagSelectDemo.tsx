import React, { useCallback, useState } from 'react';
import MobileShell from '../MobileShell';
import AhTagSelect from '../AhTagSelect';
import { IOptions7, ITablePage, asyncUtils } from '@allahjs/utils';
import { Button, Form } from 'antd-mobile';

type IValue = IOptions7<string>;

/**
 * localStorage key for tag data
 */
const TAG_STORAGE_KEY = 'ah_tag_select_demo_data';

/**
 * 初始化标签数据
 * 优先从localStorage读取，如果没有则创建初始数据
 */
const initializeTagData = (type: string = '1'): IValue[] => {
  const cacheKey = TAG_STORAGE_KEY + type;
  try {
    const stored = localStorage.getItem(cacheKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to parse stored tag data:', error);
  }
  let initialData: any = [];
  if (type === '1') {
    // 创建初始数据 - 员工
    initialData = Array.from({ length: 80 }, (_, i) => ({
      key: `tag_${i + 1}`,
      label: `员工标签 ${i + 1}`,
      value: `tag_${i + 1}`,
      description: `这是第 ${i + 1} 个员工的说明信息`
    }));
  } else if (type === '2') {
    // 创建初始数据 - 部门
    initialData = Array.from({ length: 20 }, (_, i) => ({
      key: `tag_${i + 1}`,
      label: `部门标签 ${i + 1}`,
      value: `tag_${i + 1}`,
      description: `这是第 ${i + 1} 个部门的说明信息`
    }));
  } else if (type === '3') {
    // 食材
    initialData = [
      {
        key: 'tag_1',
        label: '猪肉',
        value: 'tag_1',
        description: '猪肉是一种重要的肉品，通常用于烹饪和recipe中。'
      },
      {
        key: 'tag_2',
        label: '牛肉',
        value: 'tag_2',
        description: '牛肉是一种重要的肉品，通常用于烹饪和recipe中。'
      },
      {
        key: 'tag_3',
        label: '羊肉',
        value: 'tag_3',
        description: '羊肉是一种重要的肉品，通常用于烹饪和recipe中。'
      }
    ];
  }

  // 保存到localStorage
  try {
    localStorage.setItem(cacheKey, JSON.stringify(initialData));
  } catch (error) {
    console.warn('Failed to save initial tag data:', error);
  }

  return initialData;
};

/**
 * 保存标签数据到localStorage
 */
const saveTagData = (data: IValue[], type?: string): void => {
  const cacheKey = TAG_STORAGE_KEY + type;
  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save tag data:', error);
  }
};

/**
 * 获取所有标签数据
 */
const getAllTags = (type?: string): IValue[] => {
  return initializeTagData(type);
};

/**
 * 添加新标签
 */
const addNewTag = (label: string, type?: string): IValue => {
  const allTags = getAllTags(type);
  const newTag: IValue = {
    key: `tag_${Date.now()}`,
    label: label.trim() || '新标签',
    value: `tag_${Date.now()}`,
    description: '用户通过新增动作创建的标签'
  };
  if (type === '3') {
    newTag.value = newTag.label;
  }

  const updatedTags = [...allTags, newTag];
  saveTagData(updatedTags);

  return newTag;
};

/**
 * AhTagSelect Demo 组件
 * 展示：受控选择、搜索、分页加载、立即新增并选中
 */
/**
 * 根据查询参数返回分页的标签选项列表
 * 数据从localStorage读取，确保数据一致性
 * @param params 查询参数，支持 `pageNum`、`pageSize`、`keyword`
 * @returns ITablePage<IValue>
 */
const request = async (params: any): Promise<ITablePage<IValue>> => {
  // 模拟网络延迟
  await asyncUtils.delay(100);

  const { pageNum = 1, pageSize = 20, keyword = '' } = params || {};

  // 从localStorage获取数据
  const allTags = getAllTags(params.type);

  const filtered = keyword
    ? allTags.filter(
        (it) => it.label.toLowerCase().includes(keyword.toLowerCase()) || it.value.includes(keyword)
      )
    : allTags;

  console.log('filtered', filtered);

  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const records = filtered.slice(start, end);
  const total = filtered.length;
  const pages = Math.ceil(total / pageSize);

  console.log('records', records);

  return {
    records,
    total,
    pageNum,
    pageSize,
    pages
  } as any;
};

/**
 * 新增一个选项并返回（同时用于"立即新增"场景）
 * 新标签会保存到localStorage，确保后续搜索能找到
 * @param params 仅使用 `keyword` 作为新增标签的文本
 * @returns IValue 新增的选项
 */
const addRequest = async (keyword: string, color?: string, type?: string): Promise<IValue> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const text = (keyword || '新标签').trim();
  return addNewTag(text, type);
};

const queryRequest = async (v: string[], type?: string): Promise<IValue[]> => {
  // 从数据找打包含v中所有元素的标签
  const allTags = getAllTags(type);
  const filtered = allTags.filter((it) =>
    v.every((vv) => it.label.includes(vv) || it.value.includes(vv))
  );
  return filtered;
};

/**
 * AhTagSelect Demo 组件
 * 展示：受控选择、搜索、分页加载、立即新增并选中
 */
export default function AhTagSelectDemo(): React.ReactElement {
  const [currentValue, setCurrentValue] = useState<string[]>([]);

  const [form] = Form.useForm();

  const handleChange = useCallback((v?: string[]) => {
    setCurrentValue(v || []);
  }, []);

  const onValuesChange = (values: any) => {
    console.log('onValuesChange', values);
  };

  const onFinish = (values: any) => {
    console.log('onFinish', values);
  };

  return (
    <div>
      <MobileShell title="AhTagSelect 示例" domId="ah-tag-select-demo">
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          layout="vertical"
          initialValues={{
            workerUser: [],
            adminUser: []
          }}
        >
          <Form.Item
            name="adminUser"
            label="管理员"
            rules={[{ required: true, message: '请选择管理员' }]}
          >
            <AhTagSelect
              getContainer={() => document.getElementById('ah-tag-select-demo')!}
              value={currentValue}
              onChange={handleChange}
              request={(p) => request({ ...p, type: '1' })}
              addRequest={addRequest}
              queryRequest={queryRequest}
            />
          </Form.Item>
          <Form.Item
            name="workerUser"
            label="工作员工"
            rules={[{ required: true, message: '请选择工作员工' }]}
          >
            <AhTagSelect
              getContainer={() => document.getElementById('ah-tag-select-demo')!}
              value={currentValue}
              onChange={handleChange}
              mode="multiple"
              request={(p) => request({ ...p, type: '1' })}
              addRequest={addRequest}
              queryRequest={queryRequest}
            />
          </Form.Item>
          <Form.Item
            name="mainIngredient"
            label="主料"
            rules={[{ required: true, message: '请选择主料' }]}
          >
            <AhTagSelect
              getContainer={() => document.getElementById('ah-tag-select-demo')!}
              value={currentValue}
              onChange={handleChange}
              request={(p) =>
                request({ ...p, type: '3' }).then((res) => {
                  res.records = res.records.map((it) => ({
                    ...it,
                    label: it.label,
                    value: it.label
                  }));
                  return res;
                })
              }
              addRequest={(keyword, color) => addRequest(keyword, color, '3')}
              queryRequest={queryRequest}
              mode="multiple"
            />
          </Form.Item>
          <Button color="primary" type="submit">
            提交
          </Button>
        </Form>
      </MobileShell>
    </div>
  );
}
