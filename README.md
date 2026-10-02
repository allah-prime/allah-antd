# allah-antd

`@allahjs/antd` —— 基于 antd v6 封装的 React 业务组件库，前身为企业内部组件库 `@theling/antd`（v8.2.4，CNB 私服），2026-10 迁移至本仓库公开发布。

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

## 包结构（迁移自 theling-antd 五个子包，已平铺）

| 目录 | 内容 | 原包名 |
| --- | --- | --- |
| `src/ui` | 核心企业级组件（ZlProTable、ZlPage、Login、LightFilter 等 40+） | `@theling/ui` |
| `src/edit` | 编辑器（ZlEditor 富文本 / ZlNotion / ZlMarkdown / Monaco） | `@theling/edit` |
| `src/drag` | 拖拽交互（DndKit、DragModal、GridCards 等） | `@theling/drag` |
| `src/mobile` | 移动端组件（antd-mobile 封装：ZlForm、ZlFlatList 等） | `@theling/mobile` |
| `src/types` | 共享类型 | `@theling/types` |
| `src/theling-utils` | 从 `@theling/utils@3.8.94` 收编的工具模块（原私服依赖，仅保留本库用到的闭包） | `@theling/utils` |

组件按 `src/ui/<组件名>/` 目录组织：`index.md` 为 dumi 组件文档，`demo/` 为文档站示例。
新增组件后在 `src/index.ts` 导出即可。

其他迁移调整：

- `@allahbin/tiptap` → `@allahjs/tiptap`（ZlEditor 底层）
- 原五包 workspace 依赖全部改为单包平铺，内部引用改为相对路径（由 `scripts/migrate.cjs` 一次性改写）
- dumi 打包器由 utoopack 换回 webpack（utoopack 与本库 less 资产不兼容）

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
   # 把 package.json 的 version 从 0.0.0 改为 1.0.0（仅此一次例外）
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

3. 之后把 version 改回 `0.0.0` 也无妨——semantic-release 以 npm 上的最新版本为基准递增，从此全自动。

完整机制与排错见工作区 [docs/npm-自动化发包指南.md](../docs/npm-自动化发包指南.md)。
