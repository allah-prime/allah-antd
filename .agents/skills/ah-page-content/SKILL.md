---
name: ah-page-content
description: '@allahjs/antd 的 AhPageContent 列表页组件用法——request 契约、声明式筛选（filterFields）、多条件排序（sortSearch.fields）、筛选视图（filterViews）、submit/syncUrl/onError，以及传统 searchForm 接法与常见坑。编写或修改列表页、筛选相关代码时使用。'
---

# AhPageContent 列表分页页组件

`@allahjs/antd` 的 `AhPageContent` = 搜索区 + 表格（内部 AhProTable）+ 底部分页条，一个组件完成一个标准列表页。

## request 契约（核心，先读这段）

```ts
request: (params: F) => Promise<ITablePage<T>>   // F extends IBaseFilter
```

- **入参 params**：组件拼好的查询参数对象。分页参数名 `pageNum` / `pageSize`（默认 1/20），关键词 `keyword`，排序 `sort`（`Record<string, boolean>`，false=降序、true=升序，**key 顺序即优先级**），外加每个筛选项的 `name=value`。日期区间是 `{ startDay: 'YYYY-MM-DD 00:00:00', endDay: 'YYYY-MM-DD 23:59:59' }` 对象。
- **空值剔除**：`undefined` / `null` / `''` / 空数组的参数不会发给 request——request 收到的都是有效筛选，业务层不用再判空。
- **返回值**：`ITablePage<T>` 六字段 `{ records, list, size, current, pages, total }`，组件实际只消费 `records` + `total`。
- **组件不解 `{code, msg, res}` 信封**：解信封、抛错误是业务层（apiGet）的职责。
- 类型来源：`import type { IBaseFilter, ITablePage } from '@allahjs/utils'`。
- **失败处理内置**：request 抛错时组件默认 `message.error('加载失败，请重试')` 并**保留上一次成功数据**（分页不丢）；传 `onError` 接管提示。失败后同参再点查询会强制重发（重试可用）。

## 两种搜索形态

布局判定：`searchLayout='div'`（默认）且**未传** `searchCollapsible` → **新布局**；`card` / `plugin` 布局或显式 `searchCollapsible={true}`（已废弃）→ 传统 SearchContent 结构。两种形态共用同一套 params/request 管线。

### 形态一：声明式筛选（推荐）

新布局 = 顶部头部栏 + 左（筛选条件）右（关键词/排序）两栏，Coding/Jira 风格。头部栏结构：`[title 功能名称][视图控件…]……[description 功能解释][headerRightRender 自定义右侧]`。三个配置各管一块：

**0. `title` / `description` / `headerRightRender` —— 头部栏（div 新布局）**

```tsx
<AhPageContent
  title="销售明细"
  description="按门店、分类、支付方式与销售时间筛选；视图可保存复用"
  headerRightRender={() => <Button size="small" onClick={onExport}>导出</Button>}
  ...
/>
```

- `title`：功能名称，显示在视图栏最左侧、视图名称左边；**无视图时也可单独显示**（三者传其一即渲染头部栏）。
- `description`：功能解释文案，显示在头部栏右侧。
- `headerRightRender`：`(() => ReactNode)`，头部栏最右侧自定义区域（放导出/设置等按钮），排在 description 之后。
- 仅 div 新布局生效；card/plugin 与旧版结构忽略。

**1. `filterFields: IAhFilterField[]` —— 声明式筛选条件（配置即表单）**

```tsx
const filterFields: IAhFilterField[] = [
  { name: 'store', label: '门店', defaultVisible: true, options: STORE_OPTIONS },
  { name: 'category', label: '分类', type: 'multiSelect', defaultVisible: true,
    options: CATEGORIES.map((v) => ({ label: v, value: v })) },
  { name: 'payType', label: '支付方式', type: 'multiSelect',
    options: [{ label: '微信支付', value: '微信支付', color: '#1aad19' }, ...] },
  { name: 'minAmount', label: '金额', type: 'input' },
  { name: 'saleTimeObj', label: '销售时间', type: 'dateRange' }
];
```

- `type`：`select`（默认）/ `multiSelect` / `input` / `dateRange`。选项来源 `options` 或 `valueEnum`（二选一）；选项可带 `color` 色点。
- `defaultVisible: true` 的字段以 chip 外露（无值也显示）；其余字段在「筛选 N个条件」弹层里按需添加。有值的字段也会自动外露成 chip。
- 菜单类 chip 本身就是下拉触发器（点开即选，**选中立即生效**，多选带「已选 N 项」）；选项超过 `searchThreshold`（默认 8）出现搜索框。input 回车/失焦提交、dateRange 选完即交。
- `dateRange` 字段值自动转换为 `{startDay, endDay}`；`multiSelect` 值是数组、清空为剔除该参数。
- `fieldProps` 透传给底层 antd 控件。

**2. `sortSearch: { fields: IAhSortField[] }` —— 多条件排序**

```tsx
const sortFields: IAhSortField[] = [
  { field: 'amount', label: '销售金额', group: '系统字段', typeLabel: '小数输入', type: 'number' },
  { field: 'saleTime', label: '销售时间', group: '系统属性', type: 'date' }
];
<AhPageContent sortSearch={{ fields: sortFields }} ... />
```

- 右栏出现「排序 · N个条件」弹层：字段下拉（按 `group` 分组、`typeLabel` 类型提示）+ 方向分段（`type` 决定文案：date「最晚→最早」、number「大→小」、text「Z→A」，可用 `descLabel`/`ascLabel` 覆盖）+ 删除。
- 产出 `sort: Record<string, boolean>` 写进 params（多键、key 顺序即优先级），后端需支持多键排序。
- `sortSearch: true` 用默认两项（update_time/cre_time）；**仅给 `options`** 则回退旧版单选下拉（`timeSort` 虚拟字段 → `sort` 对象）。列头排序与筛选排序并存时**列排序优先**、其余键保留。

**3. `filterViews` —— 筛选视图（保存/切换/清除变更）**

- **开启条件**：传了 `filterFields`（非空）自动开启；或显式传 `filterViews`；`filterViews={false}` 显式关闭。
- 默认存 localStorage（key = `ah-page-views:` + `storageKey` ?? `location.pathname`）。**受控模式**传 `views` + `activeViewId` + `onSave/onDelete/onSelect` 接后端，不再读写本地。
- 视图 = `{ id, name, params }`，`params` 是**去分页**的筛选快照（含 keyword/sort）。视图栏操作：「保存为新视图」（弹层命名）/「更新当前视图」（dirty 时出现）/ 重命名 / 删除 / 下拉切换 /「清除变更」（= 重置，回到所选视图快照；未选视图时回到挂载快照）。切换视图会整体重置条件行、chips、旧表单与 keyword。

**最小样板**（本仓库 `src/ui/AhPage/demo/AhPageContentDemo9.tsx`）：

```tsx
<AhPageContent<Row, Filter>
  filterFields={filterFields}
  sortSearch={{ fields: sortFields }}
  defParams={{ pageNum: 1, pageSize: 10 }}
  request={request}
  columns={columns}
  containerHeight={540}
/>
```

注意：`filterFields` 模式下不要再传 `searchForm`/`timeSearch`（日期区间用 `dateRange` 字段承担）；手写 `searchForm` 仍可并存，会渲染在左栏尾部。

### 形态二：传统 searchForm（card/plugin 布局）

`searchForm` 是 **ReactNode 数组或 render-prop**（`(form) => ReactNode`），每项 `name` 即请求参数名，**即时触发、无搜索按钮**：

```tsx
searchForm={[
  <ProFormSelect key="billType" name="billType" label="单据类型" allowClear options={[...]} />,
  <ProFormText key="module" name="module" label="模块" />
]}
```

- `timeSearch`：`true` 单字段（`field` 默认 `creTimeObj`）；传数组 `[{field, label}]` 配多个日期区间。**ERP 后端不认 creTimeObj 参数，ERP 页面一律 `timeSearch={false}`**，需要日期区间就在 searchForm 里塞 `ProFormDateRangePicker`——自塞的 Dayjs 区间会被自动转成 `{startDay,endDay}`。
- 旧布局的重置按钮 `showReset`（默认开，无变更时禁用）；`createFilterItem<F>(name, node)` 可在编译期校验表单项 name ∈ F。

## 服务端接法（ERP 项目模板）

api.ts 已提供辅助：`PageData<T>`（后端 PageResult）、`pageQs(params)`（拼 query string、跳空值）、`toTablePage(data)`（补齐 `list` 字段）。

```tsx
type XFilter = IBaseFilter & { pageNum?: number; pageSize?: number; billType?: string };
const request = async (params: XFilter): Promise<ITablePage<XRow>> =>
  toTablePage(await apiGet<PageData<XRow>>(`/xxx/page?${pageQs(params)}`));
```

全量数组接口（不分页）：request 里 `paginate` 后返回 `{ records, list, total, size, current, pages }`，并加 `tableProps={{ pagination: false }}`。

样板：`src/ui/AhPage/demo/AhPageContentDemo2.tsx`（最简）、`Demo3`（下拉筛选）、`Demo5`（受控）、`Demo6`（无分页）、`Demo7`（横向滚动）、`Demo8`（submit/syncUrl/失败演示）。

## 常用 Props

| Prop | 说明 |
|---|---|
| `request` / `columns` | 必填。**ProColumns**，render 签名 `(_dom, row, index)`，取值一律 `row.xxx` |
| `title` / `description` / `headerRightRender` | 头部栏（div 新布局）：功能名称（最左）/ 功能解释（右侧）/ 自定义右侧渲染 `() => ReactNode`，传其一即显示头部栏 |
| `filterFields` | 声明式筛选字段（形态一核心） |
| `sortSearch` | `true` / `{ fields }` 多条件排序 / `{ options }` 旧版单选 |
| `filterViews` | 视图管理配置；`false` 关闭；传 `filterFields` 时自动开启 |
| `searchMode` | `'instant'`（默认，即时生效）/ `'submit'`（暂存，点「查询」统一提交，回车同效） |
| `syncUrl` | 筛选写 URL（replaceState 无历史栈），刷新/分享/前进后退还原；`{ keys }` 白名单 |
| `onError` | 请求失败回调，默认 toast + 保留旧数据 |
| `defParams` | 默认参数，**只在初始化生效**（不会压回运行时状态），非响应式 |
| `params` / `setParams` | 受控参数（响应式，父组件联动筛选用） |
| `pageRef` | 命令式句柄：`refresh()` / `updateParams(v)`（合并，筛选键自动回页 1）/ `setParams(v)`（整体替换） |
| `searchForm` | 传统表单项数组或 render-prop |
| `showKeyword` | 默认 true；后端不支持 keyword 时设 false |
| `searchLayout` | `'div'`（默认，新布局）/ `'card'` / `'plugin'` |
| `searchCollapsible` | **已废弃**，仅传 `true` 回退旧版展开收起结构 |
| `tableProps` | 透传 AhProTable：`headerTitle`、`toolBarRender`、`pagination:false`、`rowSelection` |
| `debounceTime` | keyword 参数层防抖，默认 400ms |
| `children` | 渲染在容器最底部，弹窗放这里 |

## 参数语义（组件保证的约定，业务层不要重复实现）

1. keyword 每键即查但有参数层防抖（回车/清空立即触发）；父组件不会每键重渲染。
2. 任意筛选键更新且未显式给 `pageNum` → 自动回第 1 页；翻页保留筛选且页码上行同步进 `params`。
3. 空筛选值出参前剔除；受控 `params` 回灌有回声防护（稳定序列化比较，一致即跳过）。
4. 视图/重置的快照不含分页；重置保留当前 pageSize、页码回 1，并把快照里没有的旧键显式置空（AhProTable 内部按合并吸收 params，缺省键会残留）。

## 常见坑

1. **列定义混用 antd 与 Pro 规范**：ProColumns 的 render 是 `(dom, entity)`，`render: (v) => v` 会显示 DOM；取值用 `(_dom, row) => row.xxx`。
2. **信封没解**：组件直接吃 `ITablePage`，忘记走 apiGet 会把 `{code,msg,res}` 当数据。
3. **操作后不刷新**：新增/编辑/审核后调 `pageRef.current?.refresh()`。
4. **filterFields 与 searchForm/timeSearch 混用**：日期区间二选一，不要既传 `timeSearch` 又定义 `dateRange` 字段。
5. **sort 语义**：多条件排序的 `sort` 是有序对象（key 顺序即优先级），后端只支持单字段排序时不要配多行。
6. **视图 localStorage 隔离**：默认按 `location.pathname`，同路径多列表页需配 `storageKey` 区分；接后端用受控模式。
7. **strict 模式禁 any**：Filter 类型用 `IBaseFilter & { ... }` 交集声明。
8. **旧代码读 `data.rows`**：分页数据字段是 `records`。
9. `defParams` 非响应式，动态参数走 `params` prop；`updateParams` 是合并语义、`setParams` 是整体替换。
