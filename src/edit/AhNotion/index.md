---
toc: content
group:
  title: 数据录入
  order: 1
---

# AhNotion

Notion 风格块编辑器。输入 `/` 插入内容，划词弹出格式栏，左侧句柄可拖拽重排。默认按 Markdown 读写。

> **推荐**：块编辑业务场景请统一使用本组件。

等价于 `AhEditor` 传入 `renderMode="block"`：

```tsx | pure
import { AhEditor, AhNotion } from '..';
import { fileUpload2Usage } from '../../theling-utils';

<AhEditor renderMode="block" usage={fileUpload2Usage.NORMAL} permission="public" />
<AhNotion usage={fileUpload2Usage.NORMAL} permission="public" />
```

## 文件上传（粘贴 / 拖放 / 斜杠）

图片与非图片（PDF、音视频、附件）都走公司上传链：

`fileKeyRequest` → `uploadFile` → `generateSignUrlReq`

配置来源：`AhAntdConfig` 全局上传配置，或组件 props 透传。

- 粘贴 / 拖放图片 → `image` 节点
- 粘贴 / 拖放非图片 → `file` 节点（需 `fileUploader`，AhEditor 已自动注入）
- 斜杠「图片 / 视频 / 音频 / 文件」同理

文档站 Demo 使用 `mockImgUploader` / `mockFileUploader` 仅作本地演示；**业务环境不要传 mock**，应依赖 `AhAntdConfig`。

## cosKey 换签（防止临时 URL 过期）

编辑器内预览用的是临时签 URL。**持久化必须存 cosKey，回显再换签**（组件不内置，由业务 Service 负责）：

```ts
import { updateMarkdownImgUrl, infoMarkdownImgUrl } from '../../theling-utils';
// 或经营范围封装：
// import JyfwHtmlUtils from '.../JyfwHtmlUtils';

// 保存前：临时签 → cosKey（含 MD 图片 + Notion 嵌入的 video/audio/file HTML）
values.content = updateMarkdownImgUrl(values.content);
// values.content = JyfwHtmlUtils.updateMarkdownImgUrl(values.content);

// 详情 / 编辑回显：cosKey → 新鲜签 URL
res.content = await infoMarkdownImgUrl(res.content, (key, bucket) => getSigUrlByKey(key, bucket));
// res.content = await JyfwHtmlUtils.infoMarkdownImgUrl(res.content, bucket);
```

HTML / JSON 场景继续用 `updateHtmlImgUrl` / `infoHtmlImgUrl`、`updateJsonImgUrl` / `infoJsonImgUrl`（已支持 `file` 节点与媒体标签）。

### 正常使用

<code src="./demo/demo1.tsx" ></code>

### 在表单中使用

<code src="./demo/FormDemo1.tsx" ></code>
