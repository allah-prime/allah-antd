---
nav: 研发
group:
  title: 进阶
  order: 1
order: 1
---

# 样式说明

本文档详细说明了项目中使用的样式系统，基于 `packages/ui/src/styles/base.less` 文件。该样式系统主要是为了配合学习使用 Tailwind CSS，减少从传统 CSS 向 Tailwind CSS 迁移的成本，同时保持对现有中文类名的兼容性。

## 基础变量

- `@basePieValue: 2px` - 基础尺寸单位，所有间距和尺寸都基于此值的倍数，与 Tailwind CSS 的设计理念一致

## 布局类 (Layout)

### Flexbox 布局

#### 基础 Flex 容器
```less
.ah-flex { display: flex !important; }
.ah-flex-row { flex-direction: row !important; }
.ah-flex-col { flex-direction: column !important; }
```

#### 对齐方式（Tailwind 兼容）
这些类名完全遵循 Tailwind CSS 的命名规范，便于未来无缝迁移：
```less
// 水平对齐
.ah-items-center { align-items: center !important; }
.ah-justify-center { justify-content: center !important; }
.ah-justify-between { justify-content: space-between !important; }
.ah-justify-around { justify-content: space-around !important; }
.ah-justify-end { justify-content: flex-end !important; }
```

#### 中文命名类（兼容旧项目）
```less
.ahWL_ah_jy, .ah-justify-around     // 均匀布局
.ahWL_ah_czwy, .ah-flex-row        // 横向从左往右
.ahWL_ah_sb, .ah-justify-between   // 一左一右
.ahWL_ah_r_jz, .ah-justify-center  // 水平居中
.ahWL_ah_cz, .ah-flex-col          // 垂直布局
.ahWL_ah_jz, .ah-items-center      // 垂直居中
.ahWL_ah_jz_y                      // 垂直居中（仅中文）
.ahWL_ah_jz_all, .ah-items-center  // 水平垂直居中
.ahWL_ah_f1, .ah-flex-1            // flex: 1
.ahWL_ah_r, .ah-justify-end        // 在右边
.ahWL_ah_f, .ah-flex               // 填充
```

### 定位类 (Position) - Tailwind 兼容
```less
.ah-static { position: static !important; }
.ah-fixed { position: fixed !important; }
.ah-absolute { position: absolute !important; }
.ah-relative { position: relative !important; }
.ah-sticky { position: sticky !important; }

// 定位辅助（Tailwind 兼容）
.ah-inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
.ah-inset-x-0 { left: 0 !important; right: 0 !important; }
.ah-inset-y-0 { top: 0 !important; bottom: 0 !important; }

.ah-top-0 { top: 0 !important; }
.ah-right-0 { right: 0 !important; }
.ah-bottom-0 { bottom: 0 !important; }
.ah-left-0 { left: 0 !important; }
```

### 固定定位（中文命名）
```less
.ahWL_ah_fixed_top, .ah-fixed-top    // 固定在顶部
.ahWL_ah_fixed_bottom, .ah-fixed-bottom // 固定在底部
```

### 显示类 (Display) - Tailwind 兼容
```less
.ah-block { display: block !important; }
.ah-inline-block { display: inline-block !important; }
.ah-inline { display: inline !important; }
.ah-hidden { display: none !important; }
```

### 尺寸类 (Sizing) - Tailwind 兼容
```less
.ah-w-full { width: 100% !important; }
.ah-h-full { height: 100% !important; }
.ah-w-screen { width: 100vw !important; }
.ah-h-screen { height: 100vh !important; }
```

### 滚动容器
```less
.ahWL_scrollCon  // 区域滚动的布局 - 最外层的容器需要使用这个
```

## 间距类 (Spacing)

### Tailwind CSS 间距系统
我们的间距系统完全遵循 Tailwind CSS 的设计理念，使用基于 `@basePieValue: 2px` 的等差数列：

- 每个级别增加 `@basePieValue * 2` (4px)
- 类名格式：`.ah-{property}{side}-{size}`
- 与 Tailwind CSS 完全兼容，迁移时只需移除 `ah-` 前缀

### 外边距 (Margin)

#### 所有边距
```less
.ah-m-1 { margin: 4px; }    // @basePieValue * 2
.ah-m-2 { margin: 8px; }    // @basePieValue * 4
.ah-m-3 { margin: 12px; }   // @basePieValue * 6
.ah-m-4 { margin: 16px; }   // @basePieValue * 8
.ah-m-5 { margin: 20px; }   // @basePieValue * 10
.ah-m-6 { margin: 24px; }  // @basePieValue * 12
```

#### 水平边距 (X轴)
```less
.ah-mx-1 { margin-left: 4px; margin-right: 4px; }
.ah-mx-2 { margin-left: 8px; margin-right: 8px; }
.ah-mx-3 { margin-left: 12px; margin-right: 12px; }
.ah-mx-4 { margin-left: 16px; margin-right: 16px; }
.ah-mx-5 { margin-left: 20px; margin-right: 20px; }
.ah-mx-6 { margin-left: 24px; margin-right: 24px; }
```

#### 垂直边距 (Y轴)
```less
.ah-my-1 { margin-top: 4px; margin-bottom: 4px; }
.ah-my-2 { margin-top: 8px; margin-bottom: 8px; }
.ah-my-3 { margin-top: 12px; margin-bottom: 12px; }
.ah-my-4 { margin-top: 16px; margin-bottom: 16px; }
.ah-my-5 { margin-top: 20px; margin-bottom: 20px; }
.ah-my-6 { margin-top: 24px; margin-bottom: 24px; }
```

#### 单边边距
```less
// 右边距
.ah-mr-1 { margin-right: 4px; }
.ah-mr-2 { margin-right: 8px; }
.ah-mr-3 { margin-right: 12px; }
.ah-mr-4 { margin-right: 16px; }
.ah-mr-5 { margin-right: 20px; }
.ah-mr-6 { margin-right: 24px; }

// 左边距
.ah-ml-1 { margin-left: 4px; }
.ah-ml-2 { margin-left: 8px; }
.ah-ml-3 { margin-left: 12px; }
.ah-ml-4 { margin-left: 16px; }
.ah-ml-5 { margin-left: 20px; }
.ah-ml-6 { margin-left: 24px; }

// 上边距
.ah-mt-1 { margin-top: 4px; }
.ah-mt-2 { margin-top: 8px; }
.ah-mt-3 { margin-top: 12px; }
.ah-mt-4 { margin-top: 16px; }
.ah-mt-5 { margin-top: 20px; }
.ah-mt-6 { margin-top: 24px; }

// 下边距
.ah-mb-1 { margin-bottom: 4px; }
.ah-mb-2 { margin-bottom: 8px; }
.ah-mb-3 { margin-bottom: 12px; }
.ah-mb-4 { margin-bottom: 16px; }
.ah-mb-5 { margin-bottom: 20px; }
.ah-mb-6 { margin-bottom: 24px; }
```

### 内边距 (Padding)

与外边距类似，内边距类使用 `.ah-p` 前缀：
```less
.ah-p-1 { padding: 4px; }
.ah-px-1 { padding-left: 4px; padding-right: 4px; }
.ah-py-1 { padding-top: 4px; padding-bottom: 4px; }
.ah-pr-1 { padding-right: 4px; }
.ah-pl-1 { padding-left: 4px; }
.ah-pt-1 { padding-top: 4px; }
.ah-pb-1 { padding-bottom: 4px; }
```

同样的规则适用于 2-6 级别。

## 排版类 (Typography)

### 字体大小（Tailwind 兼容）
这些字体大小类名完全遵循 Tailwind CSS 的命名规范：
```less
.ah-text-xs { font-size: 10px !important; }
.ah-text-sm { font-size: 12px !important; }
.ah-text-base { font-size: 14px !important; }
.ah-text-lg { font-size: 16px !important; }
.ah-text-xl { font-size: 18px !important; }
.ah-text-2xl { font-size: 20px !important; }
.ah-text-3xl { font-size: 24px !important; }
.ah-text-4xl { font-size: 30px !important; }
```

### 字体粗细（Tailwind 兼容）
这些字体粗细类名完全遵循 Tailwind CSS 的命名规范：
```less
.ah-font-thin { font-weight: 100 !important; }
.ah-font-light { font-weight: 300 !important; }
.ah-font-normal { font-weight: 400 !important; }
.ah-font-medium { font-weight: 500 !important; }
.ah-font-semibold { font-weight: 600 !important; }
.ah-font-bold { font-weight: 700 !important; }
.ah-font-extrabold { font-weight: 800 !important; }
.ah-font-black { font-weight: 900 !important; }
```

### 文本对齐（Tailwind 兼容）
```less
.ah-text-left { text-align: left !important; }
.ah-text-center { text-align: center !important; }
.ah-text-right { text-align: right !important; }
.ah-text-justify { text-align: justify !important; }
```

### 文本颜色（Tailwind 兼容）
这些文本颜色类名完全遵循 Tailwind CSS 的命名规范：
```less
.ah-text-gray-400 { color: #9ca3af !important; }
.ah-text-gray-500 { color: #6b7280 !important; }
.ah-text-gray-600 { color: #4b5563 !important; }
.ah-text-gray-700 { color: #374151 !important; }
.ah-text-gray-800 { color: #1f2937 !important; }
.ah-text-gray-900 { color: #111827 !important; }
```

### 特殊文本样式
```less
.ahWL_ah_title1  // 主标题字号 (font-weight: 600; font-size: 16px)
.ahWL_ah_text2   // 内容颜色 (color: #808080)
```

## 背景色 (Background Colors)
```less
.ahWL_ah_main_background_color1  // 主背景色 (#fff)
.ahWL_ah_main_background_color2  // 背景色2 (#edf1f6)
```

## 边框圆角 (Border Radius)

### Tailwind CSS 圆角系统
我们的圆角系统完全遵循 Tailwind CSS 的设计理念，使用基于 `@basePieValue: 2px` 的等差数列，与 Tailwind CSS 完全兼容。

### 所有圆角
```less
.ah-rounded-1 { border-radius: 4px; }   // @basePieValue * 2
.ah-rounded-2 { border-radius: 8px; }   // @basePieValue * 4
.ah-rounded-3 { border-radius: 12px; }  // @basePieValue * 6
.ah-rounded-4 { border-radius: 16px; }  // @basePieValue * 8
.ah-rounded-5 { border-radius: 20px; }  // @basePieValue * 10
.ah-rounded-6 { border-radius: 24px; }  // @basePieValue * 12
```

### 单边圆角
```less
// 左上角
.ah-rounded-tl-1 { border-top-left-radius: 4px; }
// 右上角
.ah-rounded-tr-1 { border-top-right-radius: 4px; }
// 左下角
.ah-rounded-bl-1 { border-bottom-left-radius: 4px; }
// 右下角
.ah-rounded-br-1 { border-bottom-right-radius: 4px; }
```

同样的规则适用于 2-6 级别。

## 特殊组件

### 垂直分割线
```less
.ahWL_verticalBar  // 垂直的一个竖线 (width: 4px; margin-right: 6px; margin-left: 2px; border-radius: 2px)
```

### 鼠标样式
```less
.ah-cursor_pointer  // 小手样式
```

## 文本溢出处理

### 单行省略
```less
.ahWL_ah_ellipsis_1  // 超出1行显示省略号
```

### 多行省略
```less
.ahWL_ah_ellipsis_2  // 超出2行显示省略号
.ahWL_ah_ellipsis_3  // 超出3行显示省略号
```

## 溢出控制（Tailwind 兼容）
```less
.ah-overflow-hidden { overflow: hidden !important; }
.ah-overflow-auto { overflow: auto !important; }
.ah-overflow-scroll { overflow: scroll !important; }
.ah-overflow-visible { overflow: visible !important; }
```

## Ant Design 覆盖
```less
.ant-pro-layout-container {
  overflow: hidden;
}
```

## 设计目标与迁移策略

### Tailwind CSS 兼容性
本样式系统的设计初衷是为了帮助团队从传统 CSS 平滑过渡到 Tailwind CSS，因此：

1. **命名规范一致**：采用与 Tailwind CSS 相同的类名命名规则
2. **功能覆盖完整**：包含了 Tailwind 常用的布局、间距、排版等核心功能
3. **学习成本低**：开发者可以通过这些类名提前熟悉 Tailwind 的使用方式

### 使用建议

1. **优先使用英文类名**：新的开发应该优先使用英文类名（如 `.ah-flex`, `.ah-m-2`），这些类名与 Tailwind CSS 保持一致
2. **中文类名兼容**：中文类名（如 `.ahWL_ah_jy`）主要用于兼容旧项目，新项目不建议使用
3. **组合使用**：可以组合多个类名来实现复杂的布局效果，这也是 Tailwind CSS 的核心思想
4. **迁移路径清晰**：当项目准备好迁移到 Tailwind CSS 时，只需将 `ah-` 前缀替换为 Tailwind 的对应类名即可

### 迁移示例
```html
<!-- 当前项目使用 -->
<div class="ah-flex ah-justify-between ah-items-center ah-m-4">

<!-- 迁移到 Tailwind CSS 后 -->
<div class="flex justify-between items-center m-4">
```

## 示例代码

```html
<!-- Flex 布局示例 -->
<div class="ah-flex ah-justify-between ah-items-center ah-m-4">
  <div class="ah-text-lg ah-font-semibold">标题</div>
  <div class="ah-text-gray-600">副标题</div>
</div>

<!-- 间距示例 -->
<div class="ah-p-4 ah-mb-6 ah-rounded-2 ahWL_ah_main_background_color2">
  <p class="ah-text-base ah-mb-2">内容文本</p>
  <p class="ah-text-sm ah-text-gray-500">辅助文本</p>
</div>
```