---
title: TagSelect3
group:
  title: 数据录入
  order: 3
nav:
  title: PC 组件
  path: /ui
---

# TagSelect3 标签选择器（PC 端）

## 组件简介
TagSelect3 是一款用于桌面端的标签选择组件，支持单选、多选、关键字检索、远程分页加载以及在线新增标签功能。
它默认复用 `AhAntdConfig` 全局配置的接口，便于与后台标签体系保持一致。
## 使用场景
当需要在桌面端表单或筛选面板中提供可搜索、可分页的标签选择能力时，可以使用本组件。

## 代码演示

### 基础用法

```tsx
import React, { useState } from 'react';
import {TagSelect3, ITagItem } from '..';

/** 模拟数据库 */
const mockDB: ITagItem[] = [
  { label: '苹果', value: '1', color: '#ff4d4f' },
  { label: '香蕉', value: '2', color: '#faad14' },
  { label: '西瓜', value: '3', color: '#52c41a' },
  { label: '火龙果', value: '4', color: '#722ed1' }
];

/** 统一 Demo */
 const TagSelectDemo=()=> {
  /** -----------------------
   * 多选
   * ----------------------- */
  const [multiValue, setMultiValue] = useState<string[]>(['1', '3']);
  const [multiList, setMultiList] = useState<ITagItem[]>([]);

  /** -----------------------
   * 单选
   * ----------------------- */
  const [singleValue, setSingleValue] = useState<string[]>(['2']);
  const [singleList, setSingleList] = useState<ITagItem[]>([]);

  /** 模拟接口 */
  const request = async (keyword?: string) => {
    if (!keyword) return mockDB;
    return mockDB.filter(v => v.label.includes(keyword));
  };

  /** 多选默认值接口 */
  const multiDefValReq = async () => {
    console.log('🔥 多选 defValReq:', multiValue);
    return mockDB.filter(i => multiValue.includes(i.value));
  };

  /** 单选默认值接口 */
  const singleDefValReq = async () => {
    console.log('🔥 单选 defValReq:', singleValue);
    return mockDB.filter(i => i.value === singleValue[0]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>统一 Demo：单选 + 多选</h2>

      {/* ---------------- 多选 ---------------- */}
      <div style={{ marginTop: 30 }}>
        <h3>多选标签</h3>

        <TagSelect3
          value={multiValue}
          mode="multiple"
          request={request}
          defValReq={multiDefValReq}
          showAdd
          autoRequest
          onChange={(ids, list) => {
            setMultiValue(ids);
            setMultiList(list);
          }}
        />

        <h4 style={{ marginTop: 10 }}>外部展示（多选）：</h4>
        <pre style={{ background: '#f5f5f5', padding: 10 }}>
          {JSON.stringify(multiList, null, 2)}
        </pre>
      </div>

      {/* ---------------- 单选 ---------------- */}
      <div style={{ marginTop: 40 }}>
        <h3>单选标签</h3>

        <TagSelect3
          value={singleValue}
          mode="single"
          request={request}
          defValReq={singleDefValReq}
          showAdd={false}
          autoRequest
          onChange={(ids, list) => {
            setSingleValue(ids);
            setSingleList(list);
          }}
        />

        <h4 style={{ marginTop: 10 }}>外部展示（单选）：</h4>
        <pre style={{ background: '#f5f5f5', padding: 10 }}>
          {JSON.stringify(singleList, null, 2)}
        </pre>
      </div>
    </div>
  );
}
export default TagSelectDemo
```


## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 已选标签值数组 | `string[]` | `[]` |
| `onChange` | 选中项变化回调 | `(value?: string[]) => void` | - |
| `mode` | 选择模式，支持单选或多选 | `'single' \| 'multiple'` | `'single'` |
| `label` | 弹窗标题及占位提示文字 | `string` | `'数据'` |
| `request` | 获取标签分页数据 | `(params: IBaseFilter) => Promise<ITablePage<IOptions7<string>>>` | 读取 `AhAntdConfig.getCommReq().tagReq` |
| `addRequest` | 新增标签接口 | `(keyword: string, color?: string) => Promise<IOptions7<string>>` | 读取 `AhAntdConfig.getCommReq().tagAddReq` |
| `queryRequest` | 根据标签 id 数组获取完整标签项 | `(ids: string[]) => Promise<IOptions7<string>[]>` | 读取 `AhAntdConfig.getCommReq().selectTagsByIds` |
| `getContainer` | 指定 `Modal` 的挂载节点 | `ModalProps['getContainer']` | `undefined` |
| `itemRender` | 自定义列表项渲染 | `(item, onSelect, current) => React.ReactNode` | 内置 List 样式 |

### 数据结构

```ts
interface IOptions7<T = string> {
  key?: string;
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

interface ITablePage<T> {
  records?: T[];
  total?: number;
  pageNum?: number;
  pageSize?: number;
  pages?: number;
  current?: number;
  size?: number;
}
```

#### 注意

- 若未显式传入 `request / addRequest / queryRequest`，需提前通过 `AhAntdConfig.init` 配置 `commReq`，否则会在控制台提示缺少接口。
- `mode="multiple"` 时，列表中的复选状态支持点击 Tag 回填和在选区直接移除。
- `itemRender` 可完全接管列表展示，但需要自行处理点击后的 `onSelect` 逻辑以保证选中状态同步。

## FAQ

**Q: 没有传递 request 时组件还能用吗？**  
A: 可以，但必须预先通过 `AhAntdConfig.init` 注入 `tagReq` 等接口，否则列表无法加载数据。

**Q: 如何把组件放入 `Form.Item` 中？**  
A: 与普通受控组件相同，直接写在 `Form.Item` 里即可；受控 value/onChange 会由 antd Form 处理。需要自定义表单适配时，可结合项目中的 `useCustomFormItem`。

