---
title: DebugPanel API 调试面板
group:
  title: 业务组件
  order: 5
nav:
  title: 组件
  path: /components
demo:
  cols: 1
---

## 何时使用 {#when-to-use}

当需要为用户提供一个界面来调试特定 API 接口时，可以使用此组件。它允许用户输入参数、触发 API 调用并查看返回结果。

## debug 实现示例

`DebugPanel` 的核心在于 `debug` 属性，您可以传递一个自定义的调试函数。该函数负责执行实际的 API 调用。如果未传递，将使用内置的 axios 实现。以下是一个自定义实现示例：

```typescript
import { message } from 'antd';
import axios from 'axios';
import type { ApiParam, ApiConfig } from '../../ui';

const myCustomApiDebug = async (
  debugValues: any,
  apiConfig: { url?: string; method?: string },
  paramDefinitions: ApiParam[]
) => {
  console.log('Starting API call with:', { debugValues, apiConfig });
  message.loading({ content: '正在请求...', key: 'debugApi' });

  const config: axios.AxiosRequestConfig = {
    method: apiConfig.method as any || 'GET',
    url: apiConfig.url,
    ...(apiConfig.method?.toUpperCase() === 'GET' ? { params: debugValues } : { data: debugValues }),
    timeout: 5000,
    // headers: { Authorization: 'Bearer YOUR_TOKEN' }
  };

  try {
    const response = await axios(config);
    message.success({ content: '请求成功！', key: 'debugApi', duration: 2 });
    return response.data;
  } catch (error: any) {
    console.error('API Debug Error:', error);
    const errorMessage = error.response?.data?.message || error.message || '请求失败';
    message.error({ content: `请求出错: ${errorMessage}`, key: 'debugApi', duration: 3 });
    throw new Error(errorMessage);
  }
};
```

## 代码演示

下面演示了如何在组件中使用 `DebugPanel`，并将上面定义的 `myCustomApiDebug` 传递给 `debug` 属性。

```tsx
import React from 'react';
import { DebugPanel, ApiParam, ApiConfig } from '../../ui';
import { Typography } from 'antd';
import axios from 'axios';

const myCustomApiDebug = async (
  debugValues: any,
  apiConfig: { url?: string; method?: string },
  paramDefinitions: ApiParam[]
) => {
  // ...同上...
};

const apiConfig: ApiConfig = {
  path: '/api/v1/users',
  method: 'GET',
};

const paramDefinitions: ApiParam[] = [
  { name: 'page', in: 'query', type: 'number', description: '页码' },
  { name: 'pageSize', in: 'query', type: 'number', description: '每页数量' },
  { name: 'status', in: 'query', type: 'string', description: '状态' },
];

export default () => {
  return (
    <div style={{ height: '500px', border: '1px solid #eee', padding: '16px' }}>
      <Typography.Title level={5} style={{marginBottom: 16}}>API 调试面板</Typography.Title>
      <DebugPanel
        apiConfig={apiConfig}
        paramDefinitions={paramDefinitions}
        debug={myCustomApiDebug} // 直接传递 debug 属性
      />
    </div>
  );
};
```

## API

| 属性               | 说明                                                   | 类型                                                                                              | 默认值 |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ------ |
| `apiConfig`        | API 的基本配置信息，包含 `path` 和 `method`             | `ApiConfig`                                                                                       | -      |
| `paramDefinitions` | API 参数定义数组，用于渲染表单项                        | `ApiParam[]`                                                                                      | `[]`   |
| `debug`            | 执行 API 调试的函数，接收参数值、API 配置和参数定义      | `(debugValues: any, apiConfig: ApiConfig, paramDefinitions: ApiParam[]) => Promise<any>`           | 内置 axios 实现 |
| `layout`           | 表单布局方式（horizontal/vertical）                     | `'horizontal' \| 'vertical'`                                                                      | 'horizontal' |

### ApiConfig

```typescript
interface ApiConfig {
  /** API 路径 */
  path?: string;
  /** 请求方法 */
  method?: string;
}
```

### ApiParam

```typescript
interface ApiParam {
  /** 参数位置 */
  in: 'path' | 'query' | 'body' | 'header';
  /** 参数名称 */
  name: string;
  /** 参数类型 */
  type: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
  /** 是否必填 */
  required?: boolean;
  /** 参数描述 */
  description?: string;
}
```

#### 注意

- **`debug` 方法是核心，可选。如果未传递，将使用内置 axios 实现。** 该方法负责接收调试表单的值、API 配置和参数定义，并返回一个 `Promise`。Promise `resolve` 时返回 API 的响应数据（这个数据会展示在结果区域），`reject` 时抛出错误（错误信息会展示在结果区域）。
- `DebugPanel` 根据 `paramDefinitions` 中的 `type` 渲染表单项。对于 `object` 和 `array` 类型，使用 Monaco Editor 让用户输入 JSON 字符串。
- 返回结果区域使用 Monaco Editor 只读模式进行展示。
- `paramDefinitions` 中的 `in` 字段主要用于信息展示和 `key` 的生成，`DebugPanel` 本身不负责根据 `in` 字段区分处理参数，具体的参数组装逻辑（如哪些放入 URL query，哪些放入 request body）需要在传入的 `debug` 方法中实现。

## FAQ

**Q: 如何处理不同类型的参数输入？**

A: `DebugPanel` 会根据 `ApiParam` 定义中的 `type` 字段自动渲染不同类型的输入控件：`string` 对应 `ProFormText`，`number`/`integer` 对应 `ProFormDigit`，`boolean` 对应 `ProFormSwitch`。对于 `object` 和 `array` 类型，使用 Monaco Editor，需输入合法 JSON 字符串。

**Q: 如何自定义 API 请求的逻辑，比如添加认证 Header？**

A: 所有 API 请求的逻辑都封装在你传入的 `debug` 方法中。你可以在这个方法里自由地使用 `fetch`、`axios` 或其他 HTTP 库，配置请求头（Headers）、处理认证逻辑、设置超时等。请参考上面 "debug 实现示例" 部分的代码。

**Q: `ApiParam` 的 `in` 字段有什么用？**

A: `in` 字段（`path`, `query`, `body`, `header`）主要用于标识参数来源和生成表单项的唯一 `key`。`DebugPanel` 组件本身不依据 `in` 字段来构建请求。你需要在 `debug` 方法中，根据 `paramDefinitions` 数组中的 `in` 字段信息，自行决定如何将 `debugValues` 中的数据组装到请求的相应部分（URL 路径、查询参数、请求体、请求头）。 