---
title: AhPageContent 表格页面
toc: content
group:
  title: 通用
  order: 1
---

# AhPageContent 表格页面

AhPageContent 是用于展示表格数据的页面容器组件，支持分页、排序、搜索筛选等功能。

卡片列表请见 [AhCardListPage](/ui/ah-card-list-page)。

## 何时使用

- 需要分页展示的表格数据
- 需要搜索、筛选功能的列表页面
- 需要自定义页面布局和搜索区域的场景

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | `ProColumns[]` | - |
| searchForm | 搜索表单配置 | `ReactNode` | - |
| defParams | 默认参数（非响应式） | `object` | `{ pageSize: 20, pageNum: 1 }` |
| params | 受控参数（响应式） | `object` | - |
| setParams | 修改受控参数的方法 | `React.Dispatch<React.SetStateAction<F>>` | - |
| request | 数据请求方法 | `(params) => Promise<{ records: any[], total: number }>` | - |
| searchLayout | 搜索区域布局 | `'div' \| 'card' \| 'plugin'` | `'div'` |
| containerHeight | 容器高度 | `number` | `window.innerHeight` |
| timeSearch | 是否显示时间筛选。`true` 单字段（field/timeName）；传数组可配置多个日期区间 | `boolean \| Array<{ field: string; label?: string }>` | `true` |
| field | 时间字段名称 | `string` | `'creTimeObj'` |
| timeName | 时间字段显示名称 | `string` | `'创建时间'` |
| sortSearch | 排序筛选。div 新布局下 `true` 为「排序 · N个条件」多条排序（默认更新/创建时间）；`fields` 自定义可排序字段（`sort` 值 false 降序、true 升序，key 顺序即优先级）；仅给 `options` 时回退旧版单选下拉 | `boolean \| { name?: string; label?: string; fields?: IAhSortField[]; options?: Array<{ label: string; value: string; sort: Record<string, boolean> }> }` | - |
| searchMode | 查询触发模式：`instant` 即时触发（默认）；`submit` 条件只暂存，点「查询」统一提交 | `'instant' \| 'submit'` | `'instant'` |
| syncUrl | 筛选条件同步到 URL query（replaceState，不产生历史栈）；刷新/分享/前进后退可还原 | `boolean \| { keys?: string[] }` | `false` |
| onError | 请求失败回调；默认 `message.error` 提示并保留旧数据 | `(e: unknown) => void` | - |
| filterFields | 声明式筛选字段（配置即表单）。`type`: `select`/`multiSelect`/`input`/`dateRange`；`defaultVisible` 为外露 chip。传入后左栏由配置渲染，未传时沿用 `searchForm` | `IAhFilterField[]` | - |
| filterViews | 筛选视图管理。默认 localStorage（`storageKey` 隔离）；传 `views` 受控，配合 `onSave/onDelete/onSelect` 接后端；`false` 关闭视图栏 | `IAhFilterViewsConfig \| false` | 传 `filterFields` 时自动开启，否则需显式传入 |
| title | 功能名称（div 新布局）。显示在视图栏最左侧、视图名称的左边，右侧以分隔线隔开；无视图时单独显示 | `ReactNode` | - |
| description | 功能解释（div 新布局）。显示在视图栏右侧，位于 `headerRightRender` 之前 | `ReactNode` | - |
| headerRightRender | 自定义头部右侧渲染（div 新布局）。位于视图栏最右侧，排在 `description` 之后，可放按钮等 | `() => ReactNode` | - |
| searchCollapsible | **已废弃**：div 布局不再提供展开收起；仅显式传 `true` 时保留旧版标题 + 展开收起结构 | `boolean` | - |
| showReset | 是否显示「清除变更」（新布局，位于视图栏）/「重置」按钮（旧版结构）；一键还原到所选视图快照 | `boolean` | `true` |
| needSearch | 是否需要搜索区域 | `boolean` | `true` |
| background | 背景颜色 | `string` | `'#fff'` |
| rowSelection | 表格行选择配置 | `TableRowSelection` | - |
| footerRender | 表格底部渲染方法 | `() => ReactNode` | - |
| pageRef | 页面组件引用 | `MutableRefObject<IAhPageContentFunc<T, F>>` | - |
| onRowClick | 行点击事件 | `(record: T) => void` | - |
| subHeight | 需要减去的高度 | `number` | `160` |
| xScroll | 表格横向滚动宽度（可选覆盖；像素列宽自动累加，百分比列宽默认不设） | `number` | - |
| tableProps | 表格的额外配置，可传递给内部 AhProTable 组件 | `IAhProTableProps` | - |
| style | 容器样式 | `CSSProperties` | - |
| debounceTime | 防抖时间 | `number` | `400/500` |

## Ref 方法

通过 `pageRef.current` 可以调用以下方法：

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| refresh | 刷新列表数据 | `(resetPageIndex?: boolean) => Promise<void>` |
| asyncRefresh | 异步刷新列表数据 | `(resetPageIndex?: boolean) => void` |
| updateParams | 更新查询参数 | `(params: F) => void` |
| setParams | 设置查询参数 | `(params: F) => void` |
| getListData | 获取列表数据 | `() => Promise<ITablePage<T>>` |

## 代码演示

### 基础表格 - 头部 div 模式

组件默认使用 root 作为容器高度，可以通过 `containerHeight` 指定高度。通过 `footerRender` 可在表格底部（分页左侧）渲染操作按钮，例如「新增」。

<code src="./demo/AhPageContentDemo.tsx"></code>

### 头部 card 模式

<code src="./demo/AhPageContentDemo2.tsx"></code>

### 嵌入式布局

<code src="./demo/AhPageContentDemo3.tsx"></code>

### 空数据展示

<code src="./demo/AhPageContentDemo4.tsx"></code>

### 受控的筛选条件

<code src="./demo/AhPageContentDemo5.tsx"></code>

### 无分页表格

通过 `tableProps` 设置 `pagination: false` 可以禁用分页功能，适用于数据量较少或需要一次性展示所有数据的场景。

<code src="./demo/AhPageContentDemo6.tsx"></code>

### 横向滚动表格

当表格列较多时，组件会按列宽类型自动处理横向滚动：
- **像素 `width`**：按列宽总和计算 `scroll.x`，可横向滚动，`ellipsis` 按像素裁切
- **百分比 `width`**：默认不设 `scroll.x`，表格铺满容器后 `ellipsis` 按百分比裁切
- 需要固定滚动宽度或固定列场景，可显式传入 `xScroll`

建议配合 `ellipsis: true`；固定列可用 `fixed: 'left' | 'right'`。注意：不要覆盖为 `scroll.x = 'max-content'`，否则列省略会失效。

<code src="./demo/AhPageContentDemo7.tsx"></code>

### 筛选增强：提交制 / URL 同步 / 多日期 / 自定义排序 / 失败保留

- `searchMode="submit"`：筛选条件与关键词只暂存，点「查询」统一提交，适合慢后端批量组条件
- `syncUrl`：筛选写入 URL，刷新页面、分享链接、浏览器前进后退均可还原
- `timeSearch` 传数组配置多个日期区间；`sortSearch` 传对象自定义排序选项
- `createFilterItem<F>(name, node)` 在编译期校验表单项 name 必须属于 Filter 类型
- 视图栏「清除变更」一键还原全部筛选；「模拟请求失败」开关演示失败提示与旧数据保留

<code src="./demo/AhPageContentDemo8.tsx"></code>

### 筛选视图管理：声明式筛选条件 / 多条件排序 / 视图

div 布局默认是「视图栏 + 左右两栏」：

- 顶部视图栏：功能名称 `title`（最左）、视图下拉、「保存为新视图」、「更新当前视图」、「清除变更」（即重置，回到所选视图快照），右侧为功能解释 `description` 与自定义内容 `headerRightRender`
- 左栏：「筛选 N个条件」弹层（字段 + 值 + 删除 + 添加条件）与外露 chip，由 `filterFields` 配置循环生成
- 右栏：关键词搜索与「排序 · N个条件」弹层（多条排序，顺序即优先级）
- 左右各占一半，超出各自换行；视图默认存 localStorage，传 `filterViews.views` 则受控

<code src="./demo/AhPageContentDemo9.tsx"></code>

## FAQ

**Q: 如何控制搜索区域的布局？**  
A: 通过 `searchLayout` 属性可以设置搜索区域的布局，支持 `'div'`、`'card'` 和 `'plugin'` 三种模式。

**Q: 如何自定义表格的渲染？**  
A: 可以通过 `columns` 配置实现自定义渲染。

**Q: 如何实现表格的行选择功能？**  
A: 通过配置 `rowSelection` 属性即可实现表格的行选择功能。

**Q: 如何刷新页面数据？**  
A: 可以通过 `pageRef.current.refresh()` 或 `pageRef.current.asyncRefresh()` 方法刷新数据。

**Q: 如何更新搜索参数？**  
A: 可以通过 `pageRef.current.updateParams()` 或 `pageRef.current.setParams()` 方法更新搜索参数。

**Q: 卡片列表和表格页面如何选择？**  
A: 如果需要展示图文混排、复杂布局的内容，建议使用 [AhCardListPage](/ui/ah-card-list-page)；如果是结构化的数据展示，建议使用 `AhPageContent`。

**Q: 如何实现自定义的搜索表单？**  
A: 可以通过以下两种方式：
1. 使用 `searchForm` 属性配置表单项
2. 使用 `searchRender` 或 `searchContentRender` 属性完全自定义搜索区域

**Q: 如何在表格中实现点击行的交互？**  
A: 提供了 `onRowClick` 属性，可以直接传入处理函数：
```tsx | pure
<AhPageContent
  onRowClick={(record) => {
    console.log('点击了行：', record);
  }}
/>
```

**Q: 如何控制表格的时间筛选功能？**  
A: 提供了以下属性来控制时间筛选：
- `timeSearch`：控制是否显示时间筛选
- `field`：指定时间字段名称
- `timeName`：自定义时间筛选的显示名称

**Q: 如何处理表格的高度自适应？**  
A: 可以通过以下方式：
1. 使用 `containerHeight` 指定容器高度
2. 使用 `subHeight` 调整需要减去的高度（默认值：表格模式 160，子页面模式 206）
3. 横向滚动条占位由组件自动检测并预留，无需为底部操作区额外配置 `xScroll`

**Q: 如何实现受控的筛选条件？**  
A: 可以使用 `params` 和 `setParams` 属性实现受控的筛选条件：
```tsx | pure
const [params, setParams] = useState({ pageSize: 20, pageNum: 1 });

<AhPageContent
  params={params}
  setParams={setParams}
  // ...其他配置
/>
```

**Q: 如何禁用表格的分页功能？**  
A: 可以通过 `tableProps` 属性设置 `pagination: false` 来禁用分页：
```tsx | pure
<AhPageContent
  tableProps={{
    pagination: false
  }}
  // ...其他配置
/>
```
这样表格会显示所有数据而不进行分页，适用于数据量较少的场景。

**Q: 如何优化页面的性能？**  
A: 可以通过以下几种方式：
1. 使用 `debounceTime` 控制搜索防抖
2. 合理设置 `pageSize` 分页大小
3. 使用 `asyncRefresh` 代替 `refresh` 进行异步刷新

**Q: 后端不支持 keyword/时间筛选参数怎么办？**  
A: 内置时间筛选默认发送 `creTimeObj={startDay,endDay}`，后端未实现该参数的项目建议设置 `timeSearch={false}`（ERP 项目规范即如此），需要的日期区间用 `searchForm` 自行接入——自塞的日期区间字段（Dayjs 数组）会被组件自动转换为 `{startDay,endDay}`。

**Q: 如何让用户组合多个条件后一次查询？**  
A: 设置 `searchMode="submit"`，表单项与关键词变更只暂存，点「查询」（或回车）统一提交。

**Q: 如何保留/还原用户的筛选状态？**  
A: 设置 `syncUrl`，筛选条件（含页码）写入 URL query；刷新、分享链接、前进后退都会还原。传 `{ keys: [...] }` 可只同步指定参数。

**Q: 一键清空全部筛选？**  
A: 表头默认带「重置」按钮（`showReset` 控制），会把关键词、表单、折叠区暂存值全部还原到初始状态，页码回到第 1 页。启用视图栏（`filterFields` / `filterViews`）后，该入口变为视图栏的「清除变更」，还原目标是当前所选视图的快照。

**Q: 请求失败的表现？**  
A: 默认 `message.error` 提示并保留上一次成功数据（表格不清空、分页不丢）；传 `onError` 可接管提示逻辑。

**Q: 表单项 name 拼写如何防错？**  
A: 使用 `createFilterItem<F>(name, node)` 包裹表单项，name 不在 F 类型中会直接编译报错：
```tsx | pure
import { createFilterItem } from '@allahjs/antd';

searchForm={[
  createFilterItem<MyFilter>('store', <ProFormSelect name="store" options={...} />)
]}
```

**Q: 本次升级有哪些行为变化？**  
A: 三点（均为修复性质）：
1. 空筛选值不再发送：`undefined`/`null`/空字符串/空数组的参数会被剔除后再发给后端
2. `pageRef.current.setParams()` 现在会同步通知受控父组件（`setParams` 回调），与 `updateParams` 行为对齐
3. 关键词防抖从"请求层兜底"提前到"参数层"：连续输入只触发一次参数更新（回车/清空立即触发），父组件不再每键重渲染
4. 内置排序清空后不再残留 `sort` 参数；列头排序与内置排序并存时按"列排序优先"合并而非互相覆盖
