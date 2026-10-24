---
title: LightFilter 轻量筛选
toc: content
group:
  title: 数据录入
  order: 3
---

# LightFilter 轻量筛选

轻量筛选条。子项默认平铺，超出的条件收进「更多筛选」。[AhFormFilter 筛选表单](/ui/ah-form-filter) 和页面容器里的固定筛选区都用它。

## 何时使用

- 筛选条件不多，希望直接铺在工具栏上
- 一部分条件常显，其余收进浮层
- 需要和 ProForm 字段一起用，但不想上完整的查询表单

## 代码演示

```jsx
import React from 'react';
import { ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { LightFilter } from '@allahjs/antd';

export default () => (
  <LightFilter
    onFinish={async (values) => {
      console.log(values);
    }}
  >
    <ProFormText name="keyword" label="关键词" />
    <ProFormSelect
      name="status"
      label="状态"
      valueEnum={{
        open: '启用',
        closed: '停用',
      }}
    />
  </LightFilter>
);
```

`collapse` 为 `true` 时，未标记常显的字段进入浮层。浮层标题可用 `collapseLabel` 替换，默认是「更多筛选」。

## API

继承 ProForm 的表单属性（不含 `children` 的类型差异）以及 antd `Form` 上除 `onFinish` 以外的属性。下面是本组件额外的字段。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `collapse` | 是否把多余条件收进浮层 | `boolean` | - |
| `collapseLabel` | 浮层触发器文案 | `React.ReactNode` | `更多筛选` |
| `variant` | 字段变体 | `'outlined' \| 'filled' \| 'borderless'` | `borderless` |
| `ignoreRules` | 是否忽略校验规则 | `boolean` | - |
| `footerRender` | 浮层底部渲染 | `LightFilterFooterRender` | - |
| `placement` | 浮层位置 | `TooltipPlacement` | - |
| `popoverProps` | 传给浮层的额外属性 | `PopoverProps` | - |
