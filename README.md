# allah-antd

`@allahjs/antd` —— 基于 antd v6 封装的 React 业务组件库。

- 文档站：https://allah-prime.github.io/allah-antd/
- npm：https://www.npmjs.com/package/@allahjs/antd

## 安装

```bash
pnpm add @allahjs/antd
# peerDependencies：antd >= 6、react >= 18（项目内需已具备）
# 样式为 Less，需要构建工具支持 less（`pnpm add -D less`）
```

## 使用

```tsx
import { AhProTable } from '@allahjs/antd';

// 入口处引入全量样式（推荐）
import '@allahjs/antd/dist/ui/index.less';
// 或仅引入基础工具样式（布局、间距等辅助类）
// import '@allahjs/antd/dist/ui/styles/base.less';
```

## 包结构

| 目录 | 内容 |
| --- | --- |
| `src/ui` | 核心企业级组件（AhProTable、AhPage、Login、LightFilter 等 40+） |
| `src/edit` | 编辑器（AhEditor 富文本 / AhNotion / AhMarkdown / Monaco） |
| `src/drag` | 拖拽交互（DndKit、DragModal、GridCards 等） |
| `src/mobile` | 移动端组件（antd-mobile 封装：AhForm、AhFlatList 等） |
| `src/types` | 共享类型 |

组件按 `src/ui/<组件名>/` 目录组织：`index.md` 为 dumi 组件文档，`demo/` 为文档站示例。
新增组件后在 `src/index.ts` 导出即可。

工具与类型依赖 **@allahjs/utils**（`arrayUtils`/`dateUtils`/`diffUtils`/`fileUpload2Usage`/表单联动规则
`validateActions`/`ahRules` 等均已在该库提供）。本地联调时该依赖以 `link:../allah-utils` 软链到
工作区源码，改 utils 后先在 allah-utils 里 `pnpm build` 刷新 dist。

## 本地开发

```bash
pnpm install
pnpm dev          # dumi 文档站（组件开发调试）
pnpm build        # father 构建，输出 ESM 到 dist/
pnpm lint         # eslint（已知历史债务：15 error / 31 warning，多为原仓库代码风格）
pnpm type-check   # tsc --noEmit（不含 demo 目录）
```

## 发版（GitHub Actions + semantic-release + npm Trusted Publishing）

与工作区其他仓库一致，发版零操作：

```bash
git commit -m "feat: 新组件"   # feat → minor，fix → patch
git push                        # 推到 main，自动定版本、发 npm、打 tag、建 Release
```

**不要手动改 package.json 的 version，也不要手动打 tag。**

### ⚠️ 首次发布需要一次性引导（仅新包需要）

npm 的 Trusted Publishing 不支持「包还不存在」时的 OIDC 首发
（见 [npm/cli#8544](https://github.com/npm/cli/issues/8544)）。**在完成下面的引导之前，`Node.js Package`
流水线每次都会红**，报 `404 OIDC token exchange error - package not found` + `ENONPMTOKEN`——这是新包
的必经状态，不是配置错误。引导只需一次：

1. 本地手动首发一次（需 2FA / passkey）：
   ```bash
   version 已是 0.0.1，直接发布：
   pnpm publishNpm
   ```
2. 到 npmjs.com → `@allahjs/antd` → Settings → **Trusted Publisher** 添加绑定（五项缺一不可）：

   | 字段 | 值 |
   |---|---|
   | Organization or user | `allah-prime` |
   | Repository | `allah-antd`（不带组织前缀） |
   | Workflow filename | `npm-publish.yml` |
   | Environment name | `main` |
   | Allowed actions | `npm publish`（不要选 stage publish） |

3. 之后全自动：feat → 0.1.0、fix → 0.0.2（v0.0.1 锚点 tag 已就位，semantic-release 以它为基准递增）。

完整机制与排错见工作区 [docs/npm-自动化发包指南.md](../docs/npm-自动化发包指南.md)。
