import React from 'react';
import { Space } from 'antd';
import SelectSearch from '../index';
import type { IOptions7 } from '@allahjs/utils';

const ALL_OPTIONS: IOptions7<string>[] = [
  { label: 'Apple', value: 'apple', key: 'apple' },
  { label: 'Banana', value: 'banana', key: 'banana' },
  { label: 'Cherry', value: 'cherry', key: 'cherry' },
  { label: 'Grape', value: 'grape', key: 'grape' },
  { label: 'Mango', value: 'mango', key: 'mango' },
  { label: 'Orange', value: 'orange', key: 'orange' }
];

const fetchOptions = (search: string) =>
  new Promise<IOptions7<string>[]>(resolve => {
    setTimeout(() => {
      resolve(
        ALL_OPTIONS.filter(
          item =>
            item.label.toLowerCase().includes(search.toLowerCase()) ||
            item.value.includes(search.toLowerCase())
        )
      );
    }, 600);
  });

/**
 * 模拟按 ID 反查接口（编辑已有记录时只拿得到 ID）
 */
const fetchByValue = (values: string[]) =>
  new Promise<IOptions7<string>[]>(resolve => {
    setTimeout(() => {
      resolve(values.map(v => ALL_OPTIONS.find(item => item.value === v)).filter(Boolean) as IOptions7<string>[]);
    }, 600);
  });

/**
 * 默认值回显示例：
 * - 左：静态 options 兜底 —— 已知 label 时直接把 { label, value } 传进 options
 * - 右：fetchByValue 反查 —— 只有 ID 时组件自动按 value 反查 label
 */
const DefaultDemo: React.FC = () => {
  const [value1, setValue1] = React.useState<string>('apple');
  const [value2, setValue2] = React.useState<string>('mango');

  return (
    <Space direction="vertical">
      <SelectSearch
        options={[{ label: 'Apple', value: 'apple', key: 'apple' }]}
        fetchOptions={fetchOptions}
        value={value1}
        onChange={val => setValue1(val as string)}
        placeholder="静态 options 兜底：默认 apple"
      />
      <SelectSearch
        options={[]}
        fetchOptions={fetchOptions}
        fetchByValue={fetchByValue}
        value={value2}
        onChange={val => setValue2(val as string)}
        placeholder="fetchByValue 反查：默认 mango"
      />
    </Space>
  );
};

export default DefaultDemo;
