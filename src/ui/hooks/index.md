---
title: hooks 常用钩子
toc: content
group:
  title: 工具
  order: 5
---

# hooks 常用钩子

`src/ui/hooks` 导出的钩子都写在本页，不单独开路由。

## useCustomFormItem

自定义表单组件需要使用到的 hooks。

## useItemDetails

读取单条详情数据。

## useItemListReq

请求列表数据。

## useItemListSelect

用于进行资源列表管理的 hooks。参考文档站示例。

## useItemTable

用于进行表格数据管理的 hooks。参考文档站示例。

示例代码：

```jsx
const tableConfig = useItemTable<IAssistThesaurus, IThesaurusListFilter>({
  request: AssistThesaurusService.list,
  defValue: IThesaurusListDefFilter,
});
```

筛选条件：

```jsx
<PolicyItemsSearch onFilterChange={tableConfig.updateParams} />
```

表格：

```jsx
<AhProTable
  actionRef={tableConfig.actionRef}
  params={tableConfig.params}
  pagination={{ pageSize: 20 }}
  request={tableConfig.tableReq}
  scroll={{ y: tableConfig.scrollY - 25, x: 1550 }}
/>
```

`request` 是请求函数，`defValue` 是默认的过滤条件。

## useScheduleRequest

用于轮询进度查看的 hooks。参考文档站示例。

引入轮询 hooks：

```jsx
const { scheduleRequest, importLoading, setImportLoading, setImportDisabled, pollingProgress } =
  useScheduleRequest();
```

开始轮询：

```jsx
await scheduleRequest.run(res.redisKey);
```

结束轮询，可以手动结束，也可以自动结束：

```jsx
scheduleRequest.cancel();
```

## useUpdateState

用于获取系统更新状态的 hooks。

## useAhModalForm

用于表单弹窗的 hooks，配合 [AhModalForm 表单弹窗](/ui/ah-modal-form)。

支持主数据和次要数据分开加载，分别管理 loading，主数据先展示，次要数据完成后再追加。

### 特性

- 支持主数据和次要数据分开加载
- 独立管理每个请求的 loading
- 自适应弹窗宽度
- 表单数据的自动填充和重置

### 基本使用

```jsx
const modalForm = useAhModalForm({
  id: currentId,
  infoRequest: (id) => userApi.getUserInfo(id),
  onSuccess: (data) => {
    console.log('数据加载成功', data);
  },
});
```

### 多请求使用

```jsx
const modalForm = useAhModalForm({
  id: currentId,
  infoRequest: (id) => userApi.getUserInfo(id),
  extraRequests: {
    roles: (id) => userApi.getUserRoles(id),
    permissions: (id) => userApi.getUserPermissions(id),
  },
});

const { loading, extraLoadingMap } = modalForm;
modalForm.loadExtraData('permissions');
```

## useAhPageConfig

获取页面容器需要的基本配置。

- `actionRef`：表格的 actionRef
- `height`：搜索区域的高度
- `scrollY`：表格滚动高度
- `params`：搜索参数

## useItemDetailsModalReq

在列表里打开详情弹窗时使用。传入 id 和请求方法：打开时请求数据，关闭时清空数据，并返回控制显隐和刷新的方法。
