---
nav:
  title: UI 组件
  order: 1
toc: content
group:
  title: 展示
  order: 0
---

# AhPageContent 表格页面

AhPageContent 是用于展示表格数据的页面容器组件，支持分页、排序、搜索筛选等功能。

卡片列表请见 [AhCardListPage](/uis/ah-card-list-page)。

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
| timeSearch | 是否显示时间搜索 | `boolean` | `true` |
| needSearch | 是否需要搜索区域 | `boolean` | `true` |
| background | 背景颜色 | `string` | `'#fff'` |
| rowSelection | 表格行选择配置 | `TableRowSelection` | - |
| footerRender | 表格底部渲染方法 | `() => ReactNode` | - |
| pageRef | 页面组件引用 | `MutableRefObject<IZlPageContentFunc<T, F>>` | - |
| onRowClick | 行点击事件 | `(record: T) => void` | - |
| field | 时间字段名称 | `string` | `'creTimeObj'` |
| timeName | 时间字段显示名称 | `string` | `'创建时间'` |
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
A: 如果需要展示图文混排、复杂布局的内容，建议使用 [AhCardListPage](/uis/ah-card-list-page)；如果是结构化的数据展示，建议使用 `AhPageContent`。

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
1. 使用 `debounceTime` 控制搜索防抖时间
2. 合理设置 `pageSize` 分页大小
3. 使用 `asyncRefresh` 代替 `refresh` 进行异步刷新
