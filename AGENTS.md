# AGENTS.md — allah-antd

> `@allahjs/antd` —— 基于 antd v6 封装的 React 业务组件库（组件源码在 `src/ui`、`src/edit`）。

## Skills 约定

项目级 skill 真源在仓库内，修改后必须同步到用户主目录下的同名 skill（供其他项目全局使用）：

- 修改 `.agents/skills/ah-page-content/SKILL.md` 后，必须把它复制到用户主目录的 `~/.agents/skills/ah-page-content/SKILL.md`（即用户级 skill 目录，路径中的 `~` 为当前用户主目录）。

```bash
# 每次改动 .agents/skills/ah-page-content/SKILL.md 后执行（~ 为用户主目录）
mkdir -p ~/.agents/skills/ah-page-content
cp .agents/skills/ah-page-content/SKILL.md ~/.agents/skills/ah-page-content/SKILL.md
```

正反例：

```text
❌ 只改了仓库内的 .agents/skills/ah-page-content/SKILL.md 就结束任务
✅ 改完后复制同一份文件到 ~/.agents/skills/ah-page-content/SKILL.md 再结束
```

> 注意：反向（用户级 → 项目级）不适用，项目级文件是唯一真源，不要从用户级反向覆盖。
