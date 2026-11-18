---
title: AhFormDetail 详情与行内编辑
toc: content
group:
  title: 通用
  order: 1
---

# AhFormDetail 详情与行内编辑

基于 Ant Design Descriptions 组件封装的详情展示组件，支持类似 ProDescriptions 的功能，包括多种数据类型展示、异步数据请求等。开启 `editable` 后支持简道云式的单字段编辑：详情即表单，字段值右侧悬停显示铅笔，点击即可编辑该字段。

## 何时使用

- 需要展示结构化的详细信息时
- 需要根据配置动态渲染详情项时
- 需要支持多种数据类型（日期、金额、开关等）的格式化展示时
- 需要异步请求详情数据时
- 需要快速修改详情中的单个字段，避免弹出完整编辑表单时

## 异步请求

<code src="./demo/RequestDemo.tsx"></code>

## 图片与自定义渲染

图片列使用 `valueType: 'image'`，通过 `fieldProps` 传入附件接口。自定义展示使用 `render(value, record, index, form, { type: 'read' })`，其中 `index` 是字段在当前分组可见列中的索引，`form` 为组件使用的表单实例。

<code src="./demo/ImageRenderDemo.tsx"></code>

## 行内编辑

传入 `editable` 开启编辑能力。开启后**所有可编辑字段常驻注册在表单里**，单元格通过 ProFormField 的 `read` / `edit` 双模式切换：字段值右侧悬停显示铅笔，点击后该字段切到 `edit` 模式变成编辑控件（占满单元格），同时详情顶部出现「数据编辑中」操作栏，右侧提供取消 / 确认按钮。

已进入编辑的字段会保持编辑态，可以同时修改多个字段。点击 **确认** 时校验已修改的字段，再按列顺序调用 `onFieldSave`。全部成功后更新当前记录并退出编辑态；任一返回 `false` 或抛出异常时保留草稿，先前成功的远端更新可能已经生效。需要原子提交时，使用 `AhModalForm` 整表提交，并由后端事务处理。点击 **取消** 会丢弃当前本地草稿。`image`、`title` 或配置了 `render`、`renderFunKey` 的字段作为纯展示项。

<code src="./demo/EditableDemo.tsx"></code>

### 上下布局

通过 `descriptionsProps={{ layout: 'vertical' }}` 使用上下布局（label 在上、内容在下），编辑能力与左右布局完全一致。

搭配 `bordered={false}` 时为无边框风格：查看态的值渲染为与编辑态输入框同尺寸（32px 高、6px 圆角）的阴影盒，label 与内容间距 4px，查看/编辑切换视觉无缝。

<code src="./demo/VerticalDemo.tsx"></code>

### 在详情弹窗中编辑

搭配 `AhModal` 展示供应商详情。示例包含必填和手机号校验，确认后通过 `onDataChange` 更新外层数据。

<code src="./demo/ModalEditableDemo.tsx"></code>

### ERP 业务控件

在 `IAhFormDetailColumn.editor` 配置附件、异步树、异步级联、搜索下拉、弹窗选择和自定义受控字段。查看态可用 `editor.renderValue(value, record)` 将业务主键转换成名称。普通 `treeSelect` 和 `cascader` 可直接使用列的 `valueType`。

<code src="./demo/ErpEditorsDemo.tsx"></code>

#### 上下布局

字段名在上方，内容在下方，使用无边框风格，每行两栏。修改字段并确认后，点击「提交已确认数据」查看完整 JSON。

<code src="./demo/ErpVerticalDemo.tsx"></code>

#### 三栏布局

无边框上下布局，每行三栏，展示采购信息、附件、业务选择器和备注。各示例独立保存数据，提交结果显示在对应示例下方。

<code src="./demo/ErpThreeColumnDemo.tsx"></code>

#### 弹窗模式

点击「打开采购详情」在弹窗内使用无边框上下三栏布局。可以同时修改多个字段，确认后提交查看 JSON。关闭后重新打开会保留当前数据。

<code src="./demo/ErpModalDemo.tsx"></code>

#### 分块与混合列宽

用 `valueType: 'title'` 划分「基础信息」「采购信息」「附件」分块，标题下的字段使用同一份表单数据和确认操作。三栏布局中，字段设置 `span: 1` 和 `span: 2` 可组成 1∶2 的一行；备注和附件设置 `span: 3` 占满整行。弹窗示例也使用此布局。

<code src="./demo/ErpGroupedDemo.tsx"></code>

| editor.type | 配置与保存行为 |
| --- | --- |
| `upload` | 复用 `FileUpload`，`props` 支持附件场景、大小、数量和上传接口。图片可用 `accept: 'image/*'` 和 `listType: 'picture-card'`。确认时先校验，再上传新增文件；已有附件保留，移除结果通过 `onFieldSave` 交给业务处理。默认以记录主键关联附件，用 `getRelId(record)` 自定义。 |
| `asyncTree` | `props` 传给 `AsyncTreeModal`，保存选中节点值数组。 |
| `asyncCascader` | `props` 传给 `AsyncCascader`，沿用控件的单选或多选值。 |
| `selectSearch` | `props` 传给 `SelectSearch`，支持远程搜索和已选值反查。 |
| `modalSelect` | 用 `title` 和 `renderPicker({ value, select, close })` 配置可搜索的列表或树表；`select` 只写入草稿，`close` 关闭选择弹窗。 |
| `custom` | `renderControl({ value, onChange, disabled, record })` 接入遵循受控值契约的业务控件。 |

附件上传和字段保存是独立请求。确认前取消会丢弃选中的本地文件；若确认后上传已成功而字段保存失败，当前草稿重试会复用已上传的附件。
在示例中选择名为 `retry.txt` 的文件，可体验上传中断后重新确认。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 详情项配置数组，兼容 `IFormColumns`，可附加 `editor` | `IAhFormDetailColumn<T>[]` | - |
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

`text`、`textarea`、`password`、`select`、`radio`、`checkbox`、`date`、`datetime`、`dateRange`、`dateTimeRange`、`time`、`timeRange`、`digit`、`digitRange`、`second`、`money`、`percent`、`switch`、`rate`、`slider`、`color`、`cascader`、`treeSelect`。未知类型使用文本输入。日期和时间值按 `fieldProps.format` 转回字符串，默认格式分别为 `YYYY-MM-DD`、`YYYY-MM-DD HH:mm:ss` 和 `HH:mm:ss`。
