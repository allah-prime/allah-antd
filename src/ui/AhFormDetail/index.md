---
title: AhFormDetail 详情表单
toc: content
group:
  title: 通用
  order: 1
---

# AhFormDetail 详情表单

基于 Ant Design Descriptions 组件封装的详情展示组件，支持类似 ProDescriptions 的功能，包括多种数据类型展示、异步数据请求等。开启 `editable` 后支持简道云式的单字段编辑：详情即表单，字段值右侧悬停显示铅笔，点击即可编辑该字段。

## 何时使用

- 需要展示结构化的详细信息时
- 需要根据配置动态渲染详情项时
- 需要支持多种数据类型（日期、金额、开关等）的格式化展示时
- 需要异步请求详情数据时
- 需要快速修改详情中的单个字段，避免弹出完整编辑表单时

## 异步请求

<code src="./demo/RequestDemo.tsx"></code>

## 行内编辑

传入 `editable` 开启编辑能力。开启后**所有可编辑字段常驻注册在表单里**，单元格通过 ProFormField 的 `read` / `edit` 双模式切换：字段值右侧悬停显示铅笔，点击后该字段切到 `edit` 模式变成编辑控件（占满单元格），同时详情顶部出现「数据编辑中」操作栏，右侧提供取消 / 确认按钮。

**已进入编辑的字段在编辑其他字段时保持编辑态**，可同时编辑多个字段；编辑后的值立即显示。数据由表单实例统一管理（`setFieldsValue` 初始化）；点击 **确认** 时原生校验全部脏字段（未触碰的字段不阻塞）并逐字段触发 `onFieldSave`（按列顺序，任一返回 `false` 则中止并保留草稿），全部成功后一次性落库退出、所有字段回到 `read` 模式；点击 **取消** 丢弃全部草稿、所有字段还原为已保存的值。`valueType` 为 `image` / `title` 及配置了 `renderFunKey` 的字段不支持编辑（保持纯展示渲染）。

<code src="./demo/EditableDemo.tsx"></code>

### 上下布局

通过 `descriptionsProps={{ layout: 'vertical' }}` 使用上下布局（label 在上、内容在下），编辑能力与左右布局完全一致。

搭配 `bordered={false}` 时为无边框风格：查看态的值渲染为与编辑态输入框同尺寸（32px 高、6px 圆角）的阴影盒，label 与内容间距 4px，查看/编辑切换视觉无缝。

<code src="./demo/VerticalDemo.tsx"></code>

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 详情项配置数组，兼容 `IFormColumns` | `IFormColumns<T>[]` | - |
| dataSource | 数据源 | `T` | - |
| request | 异步获取数据 | `() => Promise<T>` | - |
| formId | 表单组 id，配合全局 `formGroupReq` 拉取字段配置 | `string` | - |
| primaryKey | 数据唯一 id 的字段名，用于 `image` 类型渲染 | `string` | `id` |
| emptyText | 空数据时的显示文本 | `string` | `暂无数据` |
| labelWidth | label 的宽度 | `number` | `180` |
| column | 一行的 Descriptions items 数量，支持响应式对象写法 | `DescriptionsProps['column']` | `{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 3 }` |
| descriptionsProps | 透传 antd Descriptions 的配置 | `DescriptionsProps` | - |
| editable | 是否开启单字段编辑能力 | `boolean` | `false` |
| onFieldSave | 单字段保存回调，校验通过后触发；返回 `false` 或抛错则停留编辑态，不传视为保存成功（纯前端模式） | `(value, column, record) => Promise<boolean> \| boolean` | - |
| pencilRender | 自定义铅笔按钮渲染 | `(column, record) => ReactNode` | - |
| fieldControlRender | 自定义编辑控件渲染，优先级高于内置 valueType 映射 | `(column, record) => ReactNode` | - |
| onDataChange | 单字段保存成功后的数据回调 | `(newData: T) => void` | - |
| formRef | 获取组件内部的表单实例 | `React.MutableRefObject<FormInstance \| undefined>` | - |
| minHeight | 组件最小高度，用于无数据时撑开容器 | `number \| string` | - |
| placeholder | 无数据时的占位内容 | `ReactNode` | Skeleton |
| showPlaceholderBorder | 是否显示占位内容的边框 | `boolean` | `false` |

### 列宽布局

label 列由 `labelWidth` 定宽（默认 `180`），value 列均分剩余宽度（内部使用 `table-layout: fixed`，覆盖 antd v6 bordered 模式的 `auto`），保证各行的 label / value 宽度统一对齐；长文本在所在列内换行。整体宽度跟随父容器。

### 编辑态支持的 valueType

`text`、`textarea`、`select`、`radio`、`date`、`datetime`、`dateRange`、`time`、`digit`、`money`、`percent`、`switch`、`cascader`、`treeSelect`，未知类型回退为文本输入。编辑控件透传列配置的 `rules`、`verRules`、`fieldProps`、`disabled`、`valueEnum`、`options`、`request`；保存时 dayjs 值会按 `fieldProps.format`（date 默认 `YYYY-MM-DD`、datetime 默认 `YYYY-MM-DD HH:mm:ss`）转回字符串。