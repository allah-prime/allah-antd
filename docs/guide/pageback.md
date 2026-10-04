---
nav: 研发
group:
  title: 进阶
  order: 2
order: 2
---

# 项目打包发布指南

本项目采用 `father` 作为构建工具，并使用 `monorepo` 结构管理多个包。以下是打包和发布的详细步骤。

## 一、打包步骤

### 1. 安装依赖
首先，安装所有工作空间的依赖：
```bash
pnpm install
```

### 2. 构建所有包
使用以下命令递归构建所有包：
```bash
pnpm -r run build
```

### 3. 开发模式构建
在开发阶段，可以使用以下命令进行本地构建：
```bash
pnpm run buildDev
```

### 4. 构建文档
如果需要构建文档网站，请执行：
```bash
pnpm run docs:build
```

### 构建的输出内容
构建完成后，每个包将生成以下构建产物：
- `es/`：ES Module 格式的构建产物
- `lib/`：CommonJS 格式的构建产物（如果已配置）
- `dist/`：UMD 格式的构建产物（如果已配置）

## 二、发布到 npm

如需发布到 npm，请使用项目中配置的发布命令：
```bash
pnpm run ahpublish
```
此命令会自动构建所有包，发布到配置的 npm 仓库，并推送代码至 git 仓库。

### 注意事项
- 构建过程是并行的，包之间的依赖关系会自动处理。
- 若需构建特定包，请切换到相应包目录执行 `pnpm run build`。

### 常用命令
以下是一些常用的构建和发布命令：
```bash
### 构建所有包
pnpm run build:all

### 开发模式构建
pnpm run build:dev

### 只构建当前包
pnpm run build

### 构建文档
pnpm run docs:build
```

## 三、发布到制品库

### 1. 发布前准备
首先，执行以下命令以确保构建所有包，确保代码是最新的：
```bash
pnpm run prepublish
```

### 2. 发布到 Coding 制品库
使用此命令将所有包发布到 Coding 制品库：
```bash
pnpm run publish:coding
```

### 3. 一键发布
如需一键构建及发布所有包，请使用：
```bash
pnpm run publish:all
```

### 登录与版本管理
在发布之前，请确保：
1. 登录到 Coding 制品库：
```bash
pnpm login --registry=https://g-kahp5903-npm.pkg.coding.net/utils-plus/npm/
```
2. 每个包的 `package.json` 中版本号已更新，可使用以下命令更新：
```bash
pnpm run newVersion
```

3. 若需发布特定包，请切换到其目录并运行：
```bash
pnpm publish --registry=https://g-kahp5903-npm.pkg.coding.net/utils-plus/npm/
```

### 发布命令的优势
相比之前的 `ahpublish` 命令，现在的发布命令更加规范和可靠，主要优势包括：
1. 使用 `pnpm -r publish` 确保所有包正确发布。
2. 增加了 `prepublish` 钩子，确保发布前代码已构建。
3. 将构建和发布步骤分开，便于调试及错误处理。

## 四、项目入口文件

项目的入口文件用于导出所有子包的内容，示例如下：
```typescript:src/index.ts
// Drag 相关组件
export * from '@allahjs/antd-drag';

// Edit 相关组件
export * from '@allahjs/antd-edit';

// UI 相关组件
export * from '@allahjs/antd-ui';
```

### 使用示例
1. 确保每个子包的 `package.json` 中 `name` 字段分别为：
   - `@allahjs/antd-drag`
   - `@allahjs/antd-edit`
   - `@allahjs/antd-ui`

2. 发布流程示例：
```bash
### 先发布子包
cd packages/drag && pnpm publish
cd ../edit && pnpm publish
cd ../ui && pnpm publish

### 然后发布主包
cd ../.. && pnpm publish
```

3. 安装主包：
```bash
pnpm add @allahjs/antd
```

### 组件导入示例
通过主包统一导入所有组件：
```typescript | pure
import { DragComponent } from '@allahjs/antd';  // 从 drag 包
import { EditComponent } from '@allahjs/antd';  // 从 edit 包
import { UIComponent } from '@allahjs/antd';    // 从 ui 包
```

## 注意事项
1. 发布时请先发布子包，再发布主包。
2. 每次发布前须更新版本号，并确保所有代码已提交到 git 仓库。
3. 确保每个包都有正确的构建输出。
4. 建议在子包的 `package.json` 中添加 `peerDependencies`，以声明对等依赖。

```
