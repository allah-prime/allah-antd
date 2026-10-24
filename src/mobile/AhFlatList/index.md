---
nav:
  title: Mobile 组件
  order: 2
toc: content
group:
  title: 展示
  order: 0
demo:
  cols: 2
---

# AhFlatList 移动端列表组件

移动端列表组件，提供无限滚动、下拉刷新、搜索等功能。

## 何时使用

- 需要在移动端展示大量数据列表时
- 需要支持下拉刷新和上拉加载更多功能时
- 需要与PC端 `AhCardListPage` 保持一致的API时
- 需要移动端优化的列表交互体验时

## 代码演示

<code src="../demos/AhFlatListDemo.tsx"></code>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| searchForm | 搜索表单配置 | `ISearchFormConfig` | - |
| request | 数据请求函数 | `(params: F) => Promise<ITablePage<T>>` | - |
| defParams | 默认查询参数 | `F` | `{ pageSize: 20, pageNum: 1 }` |
| pageRef | 组件引用 | `MutableRefObject<IAhFlatListFunc<T, F>>` | - |
| itemRender | 单个卡片渲染函数 | `(item: T, index: number) => ReactNode` | - |
| itemsRender | 批量卡片渲染函数 | `(items: T[]) => ReactNode` | - |
| showKeyword | 是否显示搜索关键词 | `boolean` | `true` |
| noMoreRender | 没有更多数据时的自定义渲染 | `ReactNode` | - |
| style | 组件样式 | `CSSProperties` | - |
| className | 组件类名 | `string` | - |
| listStyle | 列表容器样式 | `CSSProperties` | - |
| listClassName | 列表容器类名 | `string` | - |
| backgroundColor | 背景颜色 | `string` | `'#f5f5f5'` |
| rowKey | 数据主键字段名 | `string` | `'id'` |
| containerStyle | 容器样式 | `CSSProperties` | - |
| onParamsChange | 参数变化回调 | `(params: F) => void` | - |
| debounceTime | 搜索防抖时间（毫秒） | `number` | `500` |
| pullingText | 下拉刷新提示文字 | `ReactNode` | `'下拉刷新'` |
| canReleaseText | 释放刷新提示文字 | `ReactNode` | `'释放刷新'` |
| refreshingText | 刷新中提示文字 | `ReactNode` | `'正在刷新...'` |
| completeText | 刷新完成提示文字 | `ReactNode` | `'刷新完成'` |
| loadMoreText | 加载更多提示文字 | `ReactNode` | `'正在加载...'` |
| noMoreText | 没有更多数据提示文字 | `ReactNode` | `'没有更多了'` |
| showSearchInput | 是否显示搜索框 | `boolean` | `true` |
| containerHeight | 列表容器高度 | `number` | `window.innerHeight` |

### Ref 方法

通过 `pageRef.current` 可以调用以下方法：

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| refresh | 刷新列表数据 | `() => void` |
| asyncRefresh | 异步刷新列表数据 | `() => Promise<void>` |
| updateParams | 更新查询参数 | `(params: F) => void` |
| getListData | 获取当前列表全部数据 | `() => T[]` |
| updateData | 更新整个列表数据 | `(data: T[]) => void` |
| updateOneData | 更新单条数据 | `(item: T, index?: number) => void` |


## 注意事项

1. **数据格式**: `request` 函数返回的数据格式需要符合 `ITablePage<T>` 接口，包含 `records`、`total` 等字段
2. **防抖优化**: 搜索输入会自动进行防抖处理，可通过 `debounceTime` 调整防抖时间
3. **移动端适配**: 组件已针对移动端进行优化，建议在移动端环境下使用
4. **样式定制**: 可通过 `style`、`containerStyle` 等属性进行样式定制
5. **性能优化**: 大量数据时建议使用 `itemsRender` 进行批量渲染以提升性能