---
nav:
  title: UI 组件
  order: 1
toc: content
group:
  title: 展示
  order: 0
---

# AhCardListPage 卡片列表页面

AhCardListPage 是用于展示卡片列表的页面容器组件，支持无限滚动加载、自定义卡片渲染、搜索筛选等功能。

表格页面请见 [AhPageContent](/uis/ah-page)。

## 何时使用

- 需要展示图文混排、复杂布局的卡片列表
- 需要搜索、筛选功能的列表页面
- 需要无限滚动加载的卡片列表
- 需要自定义页面布局和搜索区域的场景

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| searchForm | 搜索表单配置 | `ReactNode` | - |
| defParams | 默认参数 | `object` | `{ pageSize: 20, pageNum: 1 }` |
| request | 数据请求方法 | `(params) => Promise<{ records: any[], total: number }>` | - |
| itemRender | 单个卡片渲染方法 | `(item: T, index: number) => ReactNode` | - |
| itemsRender | 批量卡片渲染方法 | `(items: T[]) => ReactNode` | - |
| searchLayout | 搜索区域布局 | `'div' \| 'card' \| 'plugin'` | `'div'` |
| containerHeight | 容器高度 | `number` | `window.innerHeight` |
| backgroundColor | 背景颜色 | `string` | `'#eff2f5'` |
| showHeader | 是否显示头部 | `boolean` | `true` |
| showSearchInput | 是否显示搜索输入框 | `boolean` | `true` |
| pageRef | 页面组件引用 | `MutableRefObject<IZlCardListPageFunc<T, F>>` | - |
| onParamsChange | 参数变化回调 | `(params: F) => void` | - |
| containerStyle | 内部容器样式 | `CSSProperties` | - |
| noMoreRender | 没有更多数据时的渲染内容 | `ReactNode` | - |
| style | 容器样式 | `CSSProperties` | - |
| debounceTime | 防抖时间 | `number` | `400/500` |

## Ref 方法

通过 `pageRef.current` 可以调用以下方法：

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| refresh | 刷新列表数据（返回 Promise） | `() => Promise<ITablePage<T>>` |
| asyncRefresh | 异步刷新列表数据 | `() => void` |
| updateParams | 更新查询参数 | `(params: F) => void` |
| getListData | 获取当前列表全部数据 | `() => T[]` |
| updateData | 更新整个列表数据（需先使用 getListData 获取数据） | `(data: T[]) => void` |
| updateOneData | 根据主键更新单条数据 | `(data: T) => void` |

## 代码演示

### 基础用法

<code src="./demo/AhCardListPageDemo.tsx"></code>

### 嵌入式布局

当页面被嵌入到其他容器中时，需要将 `searchLayout` 设置为 `'plugin'`。

<code src="./demo/AhCardListPageDemo2.tsx"></code>

## FAQ

**Q: 如何控制搜索区域的布局？**  
A: 通过 `searchLayout` 属性可以设置搜索区域的布局，支持 `'div'`、`'card'` 和 `'plugin'` 三种模式。

**Q: 如何自定义卡片渲染？**  
A: 可以使用 `itemRender` 或 `itemsRender` 属性自定义渲染。批量场景建议优先使用 `itemsRender`。

**Q: 卡片列表和表格页面如何选择？**  
A: 如果需要展示图文混排、复杂布局的内容，建议使用 `AhCardListPage`；如果是结构化的数据展示，建议使用 [AhPageContent](/uis/ah-page)。

**Q: 如何处理卡片列表的无限加载？**  
A: `AhCardListPage` 内置了无限滚动加载功能，只需要提供正确的 `request` 方法返回数据即可。可以通过 `noMoreRender` 属性自定义加载完成时的展示内容。

**Q: 如何实现自定义的搜索表单？**  
A: 可以通过以下两种方式：
1. 使用 `searchForm` 属性配置表单项
2. 使用 `searchRender` 或 `searchContentRender` 属性完全自定义搜索区域

**Q: 如何刷新页面数据？**  
A: 可以通过 `pageRef.current.refresh()` 或 `pageRef.current.asyncRefresh()` 方法刷新数据。

**Q: 如何更新搜索参数？**  
A: 可以通过 `pageRef.current.updateParams()` 方法更新搜索参数。

**Q: 如何动态更新单条数据？**  
A: 可以使用 `pageRef.current.updateOneData(newData)` 方法，它会根据 `rowKey` 自动查找并更新对应的数据项。

**Q: 如何优化页面的性能？**  
A: 可以通过以下几种方式：
1. 使用 `debounceTime` 控制搜索防抖时间
2. 合理设置 `pageSize` 分页大小
3. 使用 `itemsRender` 代替 `itemRender` 进行批量渲染
4. 使用 `asyncRefresh` 代替 `refresh` 进行异步刷新
