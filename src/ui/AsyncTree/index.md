---
title: AsyncTree 异步树
toc: content
group:
  title: 数据录入
  order: 3
---

# AsyncTree 异步树

## 何时使用
用于异步动态地获取tree数据

## 使用方式

## 异步行业树

<code src="./demo/AsyncTree.tsx"></code>

##参数


| 参数 | 说明 | 类型 | 是否必传 |
| --- | --- | --- | --- |
| asyncTreeData | 获取数据的请求 |`(pcode?: string) => PromiseLike<any>`| 必须 |  |
| treeClick | 点击节点的方法 |`(nodeData: AntTreeNodeProps, s?: AntTreeNode) => void`| 非必须 |  |
| treeProps| 控制这个tree的参数集合 比如是否显示图标，是否自动展开节点等等 |`TreeProps`| 非必须 |  |
| openTreeKeys| 打开节点 |`(treeNode: AntTreeNode) => void`| 非必须 |  |
| openCallBack| 出发展开事件 |`(treeNode: AntTreeNode) => void`| 非必须 |  |

## AsyncTreeMini 简洁树

只保留异步加载和节点选择，适合嵌在侧栏或弹窗左侧。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `asyncTreeData` | 按父节点拉取子节点 | `(code?: string) => Promise<IAntTreeNode[]>` | - |
| `treeProps` | 透传给 antd Tree | `TreeProps` | `{}` |
| `treeSelect` | 选中节点 | `(data: { selected: boolean; data: IAntTreeNode }) => void` | - |

## AsyncTreePlus 可选值的树

支持 `value` / `onChange`，可以指定默认展开和复选框，适合放进表单。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 已选节点值 | `string[]` | - |
| `onChange` | 选中变化 | `(value: string[]) => void` | - |
| `asyncReq` | 异步加载节点 | `(code?: string) => Promise<IAntTreeNode[]>` | - |
| `expandedKeysReq` | 按值计算需要展开的节点 | `(value: string) => Promise<string[]>` | - |
| `titleRender` | 自定义节点标题 | `(item: IAntTreeNode) => React.ReactNode` | - |
| `checkable` | 是否显示复选框 | `boolean` | - |
| `showLine` | 是否显示连接线 | `boolean` | - |
| `disabled` | 是否禁用 | `boolean` | - |
| `disableLevel` | 从哪一层开始禁用 | `number` | - |
| `treeRef` | 调用 `deleteByValue`、`refresh` | `MutableRefObject<IAsyncTreePlusFun>` | - |

## AsyncTreeModal 弹窗树

在 `AsyncTreePlus` 上加一层弹窗，用按钮打开后再选择。额外参数：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `initDataReq` | 按已选值回显节点 | `(values: string[]) => Promise<IAntTreeNode[]>` | - |
| `title` | 弹窗标题 | `string` | - |
| `addText` | 触发按钮文案 | `string` | - |
| `size` | 按钮尺寸 | `SizeType` | 中号 |
| `modalProps` | 传给弹窗的属性 | `IAhModalProps` | - |



