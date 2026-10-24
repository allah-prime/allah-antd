---
title: AreaTable 地区选择
toc: content
group:
  title: 数据录入
  order: 3
---

# AreaTable 地区选择


## 何时使用

- 需要一个输入框而不是选择器。
- 需要输入建议/辅助提示。

## Demo

<code src="./demo/index.tsx"></code>

同目录还导出 `AreaTableModal`：用按钮打开弹窗选择地区，已选项以标签回显。在 `AreaTable` 的属性之外，它还有这些字段。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `selectDefList` | 按地区码回显已选地区 | `(code: string) => Promise<ISysDistrict[]>` | - |
| `modalProps` | 传给弹窗的属性 | `ModalProps & IAhModalProps` | - |
| `disabled` | 是否禁用 | `boolean` | - |
| `divStyle` | 外壳样式 | `React.CSSProperties` | - |
| `defAdminCode` | 默认地区码 | `string` | - |
| `single` | 是否单选 | `boolean` | - |
| `onChangeDiffObj` | 变更时抛出差异对象 | `(diffObj: any) => void` | - |
| `onChangeSource` | 变更时抛出新旧列表 | `(oldList, newList) => void` | - |
