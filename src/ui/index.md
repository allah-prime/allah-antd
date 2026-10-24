---
nav:
  title: UI 组件
  order: 1
group:
  title: 介绍
  order: 0
order: 1
---

# UI 组件概述

`@allahjs/antd` 是 allah-antd 的核心组件包，提供企业级 UI 组件，用来搭建后台页面。

## 文档约定

新增或修改 `src/ui` 文档时按下面执行。侧栏条目和本页列表使用同一套分组、同一套标题。

- **侧栏 `title` 和一级标题**：英文导出名 + 空格 + 中文简称，例如 `AhModal 模态框`。不要只写中文，也不要只写英文组件名。
- **分组、正文、「何时使用」、API 说明列**：中文。
- **属性名、类型、示例代码**：英文，不翻译。
- **组件文档不写 `nav`**。只有本页保留 `nav.title: UI 组件`，其余页面交给 dumi 归到 `/ui`。
- **分组只用这 6 个**（`group.title` 与 `order`）：介绍 0、通用 1、数据展示 2、数据录入 3、布局 4、工具 5。
- **单独开页的范围**：`src/ui/index.ts` 里作为独立组件导出的，各有一条侧栏。子组件、表单碎片和工具函数写在父页面里，文件名必须是 `index.md` 才会生成路由。

## 组件列表

### 通用

- [AhProTable 高级表格](/ui/ah-pro-table) - 基于 ProTable 的表格
- [AhPageContent 表格页面](/ui/ah-page) - 带搜索和分页的表格页容器
- [AhCardListPage 卡片列表](/ui/ah-card-list-page) - 卡片列表页容器
- [AhModal 模态框](/ui/ah-modal) - 增强版弹窗
- [AhModalForm 表单弹窗](/ui/ah-modal-form) - 自带 ProForm 状态的弹窗，配合 `useAhModalForm`
- [AhEditModal 编辑弹窗](/ui/ah-edit-modal) - 左右分栏的编辑壳，表单由外层 antd Form 管理
- [AhDetailModal 详情弹窗](/ui/ah-detail-modal) - 按字段渲染详情内容
- [AhFormFilter 筛选表单](/ui/ah-form-filter) - 固定条件加可增删条件的筛选器
- [AhFormDetail 详情表单](/ui/ah-form-detail) - 基于 Descriptions 的详情展示

### 数据展示

- [Ellipsis 文本省略](/ui/ellipsis) - 超长文本省略，悬停查看全文
- [SensitiveInfo 敏感信息](/ui/sensitive-info) - 脱敏、显隐切换和复制
- [AhImageRender 图片渲染](/ui/ah-image-render) - 按 `cosKey` 或 `fileId` 渲染图片，同页包含 `AhImagePreview`
- [AhFilePreview 文件预览](/ui/ah-file-preview) - 图片、PDF、Word 等文件预览
- [InfoLog 信息日志](/ui/info-log) - 操作日志时间线
- [CardList 卡片列表](/ui/card-group) - 一组可新增的卡片
- [ListGroup 列表](/ui/list-group) - `ItemListCard`、`ListCarousel`、`ListSearch`、`ListSearch2`
- [TagGroup 标签](/ui/tag-group) - `TagSelect2`、`TagSwitch`、`TagList`、`TagOptions`
- [Charts 图表](/ui/charts) - `ChartCard`、`Field`、`NumberInfo`、`Trend`
- [FileBox 文件盒](/ui/file-box) - 文件展示与下载

### 数据录入

- [AreaTable 地区选择](/ui/area-table) - 地区表格，同页包含 `AreaTableModal`
- [AsyncCascader 异步级联](/ui/async-cascader) - 异步级联，同页包含 `AhProFormCascader`
- [AsyncTree 异步树](/ui/async-tree) - 异步树，同页包含 `AsyncTreeMini`、`AsyncTreePlus`、`AsyncTreeModal`
- [TreeSelect 树选择](/ui/tree-select) - 可搜索、可多选的树选择
- [SelectSearch 搜索选择](/ui/select-search) - 可搜索、可新增选项的选择器
- [DebounceSelect 防抖选择](/ui/debounce-select) - 带防抖的异步下拉
- [DatePickerPlus 日期选择](/ui/date-picker-plus) - 带预设范围的日期选择
- [DayjsPicker 日期时间](/ui/dayjs-picker) - 基于 dayjs 的 `DatePicker`、`TimePicker`、`Calendar`
- [FileUpload2 文件上传](/ui/file-upload) - 文件上传，同页包含 `FileImportModal`
- [IconSelect 图标选择](/ui/icon-select) - 从图标列表里选择
- [EditableItem 可编辑项](/ui/editable-item) - 行内切换查看和编辑
- [ApiParameterEditor API 参数](/ui/api-parameter-editor) - 树形编辑 API 参数
- [PasswordLogin 密码登录](/ui/login) - 账号密码登录
- [LightFilter 轻量筛选](/ui/light-filter) - 轻量筛选条，供 `AhFormFilter` 和页面容器使用

### 布局

- [FooterToolbar 底部工具栏](/ui/footer-toolbar) - 固定在视口底部的操作栏
- [PageLoading 页面加载](/ui/page-loading) - 页面加载占位
- [ItemBar 项目栏](/ui/item-bar) - 列表项的标题和操作栏
- [SettingDrawer 设置抽屉](/ui/setting-drawer) - 切换环境配置的抽屉

### 工具

- [utils 工具函数](/ui/utils) - 搜索布局、下载、样式变量等工具
- [hooks 常用钩子](/ui/hooks) - 表格、详情、表单弹窗、轮询等 hooks
- [ExplainTips 说明提示](/ui/explain-tips) - 悬停说明
- [PollingProgressIcon 轮询进度](/ui/polling-progress-icon) - 任务状态图标
- [UserMonitor 用户监听](/ui/user-monitor) - 监听空闲并触发回调

可拖拽的 `DragItemBar` 在[拖拽](/drag)文档里，不在本导航。

## 安装

```bash
# 使用 pnpm
$ pnpm add @allahjs/antd
```

## 使用

```jsx | pure
import { AhProTable, AhModal, AhFormFilter } from '@allahjs/antd';

function App() {
  return (
    <div>
      <AhProTable {...props} />
      <AhModal {...props} />
      <AhFormFilter {...props} />
    </div>
  );
}
```

## 主题定制

`@allahjs/antd` 跟随 Ant Design 的主题。在 `ConfigProvider` 里改 token 即可。

```jsx | pure
import { ConfigProvider } from 'antd';

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1890ff'
      }
    }}
  >
    <YourApp />
  </ConfigProvider>
);
```
