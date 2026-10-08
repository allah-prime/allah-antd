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

`@allahjs/antd` 是 allah-antd 的核心组件包，提供了丰富的企业级 UI 组件，帮助开发者快速构建企业级应用。

## 组件列表

### 通用组件

- [AhProTable](/ui/ah-pro-table) - 高级表格组件，基于 ProTable 扩展，提供更多功能
- [AhModal](/ui/ah-modal) - 模态框组件，提供更多功能和更好的用户体验
- [AhModalForm](/ui/ah-modal-form) - 表单弹窗，基于 ProForm 自带表单状态机（对齐 pro 的 ModalForm，配 useAhModalForm）
- [AhFormFilter](/ui/ah-form-filter) - 筛选表单组件，用于数据筛选
- [AhEditModal](/ui/ah-edit-modal) - 编辑弹窗，左右分栏布局壳，表单由外层 antd Form 管理
- [AhPage](/ui/ah-page) - 表格页面容器组件（AhPageContent）
- [AhCardListPage](/ui/ah-card-list-page) - 卡片列表页面容器组件

### 数据展示

- [AreaTable](/ui/area-table) - 区域表格组件，支持区域展示数据
- [TagGroup](/ui/tag-group) - 标签组组件，用于展示标签组
- [LongTag](/ui/long-tag) - 长标签组件，用于展示长文本标签
- [AhImageRender](/ui/ah-image-render) - 图片渲染组件，支持图片预览
- [AhFilePreview](/ui/ah-file-preview) - 文件预览组件，支持多种文件格式预览
- [Ellipsis](/ui/ellipsis) - 文本省略组件，用于长文本省略
- [Charts](/ui/charts) - 图表组件，用于数据可视化
- [ListGroup](/ui/list-group) - 列表组组件，用于列表展示
- [SensitiveInfo](/ui/sensitive-info) - 敏感信息展示组件，支持脱敏显示

### 数据录入

- [AsyncCascader](/ui/async-cascader) - 异步级联选择器，支持异步加载数据
- [AsyncTree](/ui/async-tree) - 异步树组件，支持异步加载树节点
- [SelectSearch](/ui/select-search) - 搜索选择组件，支持搜索选择
- [DatePickerPlus](/ui/date-picker-plus) - 日期选择增强组件，提供更多功能
- [DayjsPicker](/ui/dayjs-picker) - Dayjs 日期选择组件，基于 Dayjs
- [DebounceSelect](/ui/debounce-select) - 防抖选择组件，支持防抖搜索
- [FileUpload2](/ui/file-upload) - 文件上传组件，支持文件上传
- [FileBox](/ui/file-box) - 文件盒子组件，用于文件管理
- [IconSelect](/ui/icon-select) - 图标选择组件，支持选择图标
- [EditableItem](/ui/editable-item) - 可编辑项组件，支持行内编辑
- [ApiParameterEditor](/ui/api-parameter-editor) - API参数编辑器组件

### 布局组件

- [FooterToolbar](/ui/footer-toolbar) - 底部工具栏组件，用于底部操作
- [PageLoading](/ui/page-loading) - 页面加载组件，用于页面加载状态
- [CardGroup](/ui/card-group) - 卡片组组件，用于卡片布局
- [ItemBar](/ui/item-bar) - 项目栏组件，用于项目展示
- [DragItemBar](/ui/drag-item-bar) - 可拖拽项目栏组件，支持拖拽排序
- [ItemListCard](/ui/item-list-card) - 列表卡片组件，用于列表展示
- [SettingDrawer](/ui/setting-drawer) - 设置抽屉组件，用于系统设置

### 功能组件

- [UserMonitor](/ui/user-monitor) - 用户监控组件，用于用户行为监控
- [InfoLog](/ui/info-log) - 信息日志组件，用于日志展示
- [ExplainTips](/ui/explain-tips) - 说明提示组件，用于提示说明
- [PollingProgressIcon](/ui/polling-progress-icon) - 轮询进度图标组件，用于显示轮询状态

### 登录组件

- [Login](/ui/login) - 登录组件，提供完整的登录功能

### 开发工具

- [PageDev](/ui/page-dev) - 页面开发工具组件，用于页面开发辅助

## 安装

```bash
# 使用 pnpm
$ pnpm add @allahjs/antd
```

## 使用

```jsx | pure
import { AhProTable, AhModal, AhFormFilter } from './';

// 使用组件
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

`@allahjs/antd` 支持基于 Ant Design 的主题定制，你可以通过修改 Ant Design 的主题变量来定制组件的样式。

```jsx | pure
// 在 ConfigProvider 中配置主题
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
