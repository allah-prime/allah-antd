import React from 'react';
import SelectSearch from '../index';
import type { IOptions7 } from '@allahjs/utils';

const ALL_OPTIONS: IOptions7<string>[] = [
  { label: 'Apple', value: 'apple', key: 'apple', description: '苹果' },
  { label: 'Banana', value: 'banana', key: 'banana', description: '香蕉' },
  { label: 'Cherry', value: 'cherry', key: 'cherry', description: '樱桃' },
  { label: 'Grape', value: 'grape', key: 'grape', description: '葡萄' },
  { label: 'Mango', value: 'mango', key: 'mango', description: '芒果' },
  { label: 'Orange', value: 'orange', key: 'orange', description: '橙子' }
];

/**
 * 模拟远程接口：按关键字过滤，延迟 600ms 返回
 */
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
 * 异步获取数据示例：面板内搜索框输入时防抖请求，展开下拉时自动加载默认列表
 */
const AsyncDemo: React.FC = () => {
  const [value, setValue] = React.useState<string>();

  return (
    <SelectSearch
      options={[]}
      fetchOptions={fetchOptions}
      debounceTimeout={500}
      value={value}
      onChange={val => setValue(val as string)}
      placeholder="输入关键字搜索水果"
      addItem={() => console.log('点击创建新的选项')}
    />
  );
};

export default AsyncDemo;
