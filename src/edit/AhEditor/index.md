---
toc: content
group:
  title: 数据录入
  order: 1
---
# AhEditor

通用富文本编辑器，基于 `@allahjs/tiptap`。默认公文风格（`renderMode="gov"`），也可传入 `normal` / `custom`。

块编辑请使用 [AhNotion](/edits/ah-notion)；若必须在 `AhEditor` 上开启，可传 `renderMode="block"`（底层等价 `notion`）。

图片与文件上传由 `AhEditor` 统一注入 `imageUploader` / `fileUploader`（`AhAntdConfig` 的 `fileKeyRequest` + `uploadFile` + `generateSignUrlReq`）。持久化换签见 [AhNotion 文档](/edits/ah-notion#coskey-换签防止临时-url-过期)。

## 数据格式

`mode` 控制 `value` / `onChange` 的格式，**默认 `md`**。不传即可按 Markdown 读写：

```tsx | pure
<AhEditor
  bucket={bucket}
  usage={fileUpload2Usage.RICH_TEXT}
  permission={ZlPermissionEnum.PUBLIC}
/>
```

需要 HTML 或 Tiptap JSON 时再显式指定：

```tsx | pure
<AhEditor mode="md" />
<AhEditor mode="html" />
<AhEditor mode="json" />
```

| mode | value / onChange |
| --- | --- |
| `md`（默认） | Markdown 字符串 |
| `html` | HTML 字符串 |
| `json` | Tiptap JSON 对象 |

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| renderMode | 渲染模式 | `'gov' \| 'normal' \| 'custom' \| 'block'` | `'gov'` |
| mode | 数据格式 | `'md' \| 'html' \| 'json'` | `'md'` |
| usage | 文件上传用途 | `IUseType` | - |
| permission | 文件权限 | `string` | - |
| preview | 只读预览 | `boolean` | `false` |
| editorOpt | 透传底层编辑器 props | `IATiptapProps & Partial<IANotionProps>` | - |

### 正常使用

<code src="./demo/demo1.tsx" ></code>

### 在表单中使用

<code src="./demo/FormDemo1.tsx" ></code>
