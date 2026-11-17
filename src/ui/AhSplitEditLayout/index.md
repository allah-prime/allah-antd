---
title: AhSplitEditLayout 分栏编辑布局
group:
  title: 通用
  order: 1
---

# AhSplitEditLayout 分栏编辑布局

左侧为正文编辑区，占 16 栅格，右侧为配置区，占 8 栅格。父容器给定高度时，正文与侧栏分别滚动，左侧顶部和底部操作区保持可见。

## 弹窗内编辑政策

`AhModal` 管理弹窗，外层 antd `Form` 统一校验顶部、正文和侧栏的字段。底部保存按钮通过 `htmlType="submit"` 触发该表单提交。

<code src="./demo/PolicyDemo.tsx"></code>

## API

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| header | 左侧顶部区域 | `ReactNode` |
| children | 左侧可滚动的正文区域 | `ReactNode` |
| sidebar | 右侧可滚动的配置区 | `ReactNode` |
| footer | 左侧底部操作区 | `ReactNode` |
