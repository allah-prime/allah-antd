---
nav:
  title: UI 组件
  order: 1
toc: content
group:
  title: 展示
  order: 0
---

# AhProTable

AhProTable 是基于 Ant Design Pro 的 ProTable 组件进行二次封装的高级表格组件，提供了自动分页、自定义底部渲染、刷新按钮等功能。

## 何时使用

- 需要展示表格数据并支持分页的场景
- 需要从远程接口动态获取并展示数据
- 需要自定义表格底部内容或工具栏
- 需要控制表格的圆角样式和分页显示

## API

AhProTable 继承了 ProTable 的所有属性，同时扩展了以下属性：

| 参数           | 说明                                    | 类型                                                 | 默认值 |
| -------------- | --------------------------------------- | ---------------------------------------------------- | ------ |
| columns        | 列配置能力，支持一个数组                | `ProColumns<T, ValueType>[]`                         | -      |
| autoPagination | 是否自动分页                            | `boolean`                                            | `true` |
| footerRender   | 右下角的渲染内容                        | `React.ReactNode \| null`                            | -      |
| toolbarStyle   | 顶部工具的样式                          | `React.CSSProperties`                                | -      |
| showRefresh    | 是否显示刷新按钮                        | `boolean`                                            | `true` |
| params         | 请求参数                                | `U`                                                  | -      |
| round          | 是否圆角                                | `boolean`                                            | `true` |
| pagination     | 分页配置，设置为 `false` 时不显示分页器 | `TablePaginationConfig \| false`                     | -      |
| request        | 数据请求方法                            | `(params: U) => Promise<{data: T[], total: number}>` | -      |
| actionRef      | 表格操作引用                            | `React.MutableRefObject<ActionType>`                 | -      |
| scroll         | 表格滚动配置                            | `{x?: number, y?: number}`                           | -      |
| rowSelection   | 表格行选择配置                          | `TableRowSelection`                                  | -      |

### 继承的 ProTable 属性

AhProTable 完全兼容 ProTable 的所有属性，包括但不限于：

- `rowKey`: 表格行 key 的取值
- `loading`: 是否加载中
- `dataSource`: 数据数组
- `size`: 表格大小
- `bordered`: 是否显示边框
- `tableClassName`: 表格类名
- `className`: 容器类名
- `style`: 容器样式
- `tableStyle`: 表格样式
- `toolBarRender`: 工具栏渲染函数
- `headerTitle`: 表格标题
- `search`: 搜索表单配置
- 等等...

## 代码演示

### 基本用法

<code src="./demo/BasicDemo.tsx"></code>

### 自定义底部内容

<code src="./demo/FooterDemo.tsx"></code>

### 带工具栏的表格

<code src="./demo/ToolbarDemo.tsx"></code>

### 禁用分页

<code src="./demo/NoPaginationDemo.tsx"></code>

### 无圆角样式

<code src="./demo/NoRoundDemo.tsx"></code>

### 空数据

<code src="./demo/EmptyDemo.tsx"></code>

## 注意事项

### 分页控制

- 当 `autoPagination` 为 `true` 时，组件会自动处理分页逻辑
- 当 `pagination` 设置为 `false` 时，不会显示分页器
- 分页器支持快速跳转和每页条数选择（10、20、30）

### 高度计算

组件会自动计算表格的滚动高度：

- 当有行选择时，会减去 44px 的高度
- 当没有分页器时，会增加 38px 的高度
- 可以通过 `scroll.y` 属性手动设置滚动高度

### 样式定制

- 通过 `round` 属性控制是否显示圆角
- 通过 `className` 和 `tableClassName` 自定义样式
- 底部区域会根据是否有分页器和圆角设置自动调整样式

## FAQ

**Q: 如何禁用分页功能？**  
A: 设置 `pagination={false}` 即可禁用分页器的显示。

**Q: 如何自定义分页器的配置？**  
A: 可以传入 `pagination` 对象来自定义分页器配置，支持 Ant Design Pagination 的所有属性。

**Q: 刷新按钮在哪里？**  
A: 刷新按钮位于表格右下角，可以通过 `showRefresh={false}` 隐藏。

**Q: 如何获取表格的操作方法？**  
A: 通过 `actionRef` 可以获取表格的操作方法，如 `reload()`、`reset()` 等。

**Q: 表格高度如何自适应？**  
A: 组件会根据 `scroll.y` 属性和其他因素自动计算表格高度，也可以手动设置 `scroll.y` 来控制。

**Q: 如何处理请求参数？**  
A: 通过 `params` 属性传入请求参数，组件会自动合并分页参数（pageNum、pageSize）。

**Q: 底部内容如何自定义？**  
A: 使用 `footerRender` 属性可以在表格底部右侧添加自定义内容。
