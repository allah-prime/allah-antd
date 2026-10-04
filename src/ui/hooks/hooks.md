# 常用hooks说明

## useCustomFormItem

自定义表单组件需要使用到的hooks

## useItemDetails

## useItemListReq

## useItemListSelect

用于进行资源列表管理的hooks。参考文档站示例

## useItemTable

用于进行表格数据管理的hooks。参考文档站示例

示例代码：

```
const tableConfig = useItemTable<IAssistThesaurus, IThesaurusListFilter>({
  request: AssistThesaurusService.list,
  defValue: IThesaurusListDefFilter,
});
```

用的话根据下面的示例调整就好了

筛选条件：

```
<PolicyItemsSearch onFilterChange={tableConfig.updateParams} />
```

表格

```
<AhProTable
  actionRef={tableConfig.actionRef}
  params={tableConfig.params}
  pagination={{pageSize: 20}}
  request={tableConfig.tableReq}
  scroll={{y: tableConfig.scrollY - 25, x: 1550}}
/>
```

request 是请求函数，defValue 是默认的过滤条件

## useScheduleRequest

用于轮训进度查看的hooks。参考文档站示例

示例

引入轮询hooks
```
const { scheduleRequest, importLoading, setImportLoading, setImportDisabled, pollingProgress } = useScheduleRequest();
```

开始轮询
```
await scheduleRequest.run(res.redisKey);
```

结束轮询，可以手动结束，也可以自动结束
```
scheduleRequest.cancel();
```

## useUpdateState

用于获取系统更新状态的hooks

## useAhModalForm

用于表单弹窗的hooks。参考文档站示例

支持主数据和次要数据的分离加载，可以分别管理它们的loading状态，使主要数据先展示，次要数据加载完成后再追加，提升用户体验。

### 特性

- 支持主数据和次要数据的分离加载
- 独立管理每个请求的loading状态
- 自适应模态框宽度
- 表单数据的自动填充和重置

### 基本使用

```jsx
const modalForm = useAhModalForm({
  id: currentId,
  infoRequest: (id) => userApi.getUserInfo(id),
  onSuccess: (data) => {
    console.log('数据加载成功', data);
  }
});
```

### 多请求使用

```jsx
const modalForm = useAhModalForm({
  id: currentId,
  // 主数据请求 - 快速加载基本信息
  infoRequest: (id) => userApi.getUserInfo(id),
  // 额外数据请求 - 慢速加载次要信息
  extraRequests: {
    roles: (id) => userApi.getUserRoles(id),
    permissions: (id) => userApi.getUserPermissions(id)
  }
});

// 使用loading状态
const { loading, extraLoadingMap } = modalForm;
// 主数据是否在加载中
console.log('主数据加载中:', loading);
// 权限数据是否在加载中
console.log('权限数据加载中:', extraLoadingMap.permissions);

// 手动触发某个额外数据的加载
modalForm.loadExtraData('permissions');
```

详细文档请查看 `.cursor/rules/sync_doc/useAhModalForm.md`

## useAhPageConfig

获取一个页面需要的基本配置

有以下方法：
1 actionRef 表单的hooks
2 height 搜索区域的高度
3 scrollY 页面表格的滚动高度
4 params 搜索参数

## useItemDetailsModalReq 详情控制

使用场景：当需要在一个列表中打开详情弹窗的时候，可以使用这个hooks

传递一个id和一个请求数据的方法，这个hooks会在打开弹窗的时候请求数据，关闭弹窗的时候清空数据

然后会返回一些用于控制弹窗显示和隐藏的方法，还有一个刷新的方法。
