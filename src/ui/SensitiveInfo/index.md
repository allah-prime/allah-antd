---
toc: content
group:
  title: 展示
  order: 0
demo:
  cols: 1
---

# SensitiveInfo 敏感信息展示

用于展示敏感信息的组件，支持脱敏显示、切换显示/隐藏、复制等功能。

## 何时使用

- 需要展示手机号、身份证号、银行卡号等敏感信息时
- 需要在保护隐私的同时提供查看完整信息的能力
- 需要提供快速复制敏感信息的功能

## 代码演示

### 基础用法

最简单的用法，默认使用自定义脱敏规则。

```jsx
import React from 'react';
import { SensitiveInfo } from '..';

export default () => (
  <div style={{ padding: 20 }}>
    <SensitiveInfo value="13812345678" />
  </div>
);
```

### 不同类型的敏感信息

支持手机号、邮箱、身份证、银行卡、通用等常见敏感信息类型。

```jsx
import React from 'react';
import { SensitiveInfo } from '..';
import { Space, Typography } from 'antd';

const { Text } = Typography;

export default () => (
  <div style={{ padding: 20 }}>
    <Space direction="vertical" size="middle">
      <div>
        <Text strong>手机号：</Text>
        <SensitiveInfo value="13812345678" type="phone" />
      </div>
      <div>
        <Text strong>邮箱：</Text>
        <SensitiveInfo value="example@domain.com" type="email" />
      </div>
      <div>
        <Text strong>身份证：</Text>
        <SensitiveInfo value="110101199001011234" type="idCard" />
      </div>
      <div>
        <Text strong>银行卡：</Text>
        <SensitiveInfo value="6222021234567890123" type="bankCard" />
      </div>
      <div>
        <Text strong>通用模式：</Text>
        <SensitiveInfo value="1234567890123456" type="general" />
      </div>
    </Space>
  </div>
);
```

### 自定义脱敏规则

可以自定义脱敏字符和脱敏规则。

```jsx
import React from 'react';
import { SensitiveInfo } from '..';
import { Space, Typography } from 'antd';

const { Text } = Typography;

export default () => (
  <div style={{ padding: 20 }}>
    <Space direction="vertical" size="middle">
      <div>
        <Text strong>默认脱敏（保留前3位后4位）：</Text>
        <SensitiveInfo value="1234567890123456" />
      </div>
      <div>
        <Text strong>自定义规则（保留前2位后2位）：</Text>
        <SensitiveInfo value="1234567890123456" customRule={[2, 2]} />
      </div>
      <div>
        <Text strong>自定义脱敏字符：</Text>
        <SensitiveInfo value="1234567890123456" maskChar="●" />
      </div>
    </Space>
  </div>
);
```

### 控制按钮显示

可以控制是否显示切换和复制按钮。

```jsx
import React from 'react';
import { SensitiveInfo } from '..';
import { Space, Typography } from 'antd';

const { Text } = Typography;

export default () => (
  <div style={{ padding: 20 }}>
    <Space direction="vertical" size="middle">
      <div>
        <Text strong>显示所有按钮：</Text>
        <SensitiveInfo value="13812345678" type="phone" />
      </div>
      <div>
        <Text strong>只显示切换按钮：</Text>
        <SensitiveInfo value="13812345678" type="phone" showCopy={false} />
      </div>
      <div>
        <Text strong>只显示复制按钮：</Text>
        <SensitiveInfo value="13812345678" type="phone" showToggle={false} />
      </div>
      <div>
        <Text strong>不显示按钮：</Text>
        <SensitiveInfo value="13812345678" type="phone" showToggle={false} showCopy={false} />
      </div>
    </Space>
  </div>
);
```

### 受控模式

可以通过 `visible` 和 `onVisibleChange` 来控制显示状态。

```jsx
import React, { useState } from 'react';
import { SensitiveInfo } from '..';
import { Switch, Space, Typography } from 'antd';

const { Text } = Typography;

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <Space direction="vertical" size="middle">
        <div>
          <Switch 
            checked={visible} 
            onChange={setVisible} 
            checkedChildren="显示" 
            unCheckedChildren="隐藏" 
          />
        </div>
        <div>
          <Text strong>受控模式：</Text>
          <SensitiveInfo 
            value="13812345678" 
            type="phone" 
            visible={visible}
            onVisibleChange={setVisible}
          />
        </div>
      </Space>
    </div>
  );
};
```

### 禁用状态

可以设置组件为禁用状态。

```jsx
import React from 'react';
import { SensitiveInfo } from '..';
import { Space, Typography } from 'antd';

const { Text } = Typography;

export default () => (
  <div style={{ padding: 20 }}>
    <Space direction="vertical" size="middle">
      <div>
        <Text strong>正常状态：</Text>
        <SensitiveInfo value="13812345678" type="phone" />
      </div>
      <div>
        <Text strong>禁用状态：</Text>
        <SensitiveInfo value="13812345678" type="phone" disabled />
      </div>
    </Space>
  </div>
);
```

### 自定义提示文本

可以自定义按钮的提示文本。

```jsx
import React from 'react';
import { SensitiveInfo } from '..';

export default () => (
  <div style={{ padding: 20 }}>
    <SensitiveInfo 
      value="13812345678" 
      type="phone"
      tooltips={{
        show: '点击显示完整信息',
        hide: '点击隐藏敏感信息',
        copy: '点击复制到剪贴板'
      }}
    />
  </div>
);
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 敏感信息内容 | `string` | - |
| type | 敏感信息类型 | `'phone' \| 'email' \| 'idCard' \| 'bankCard' \| 'general' \| 'custom'` | `'custom'` |
| maskChar | 脱敏字符 | `string` | `'*'` |
| customRule | 自定义脱敏规则（仅在type为custom时生效），格式：[保留前几位, 保留后几位] | `[number, number]` | `[3, 4]` |
| showToggle | 是否显示切换按钮 | `boolean` | `true` |
| showCopy | 是否显示复制按钮 | `boolean` | `true` |
| defaultVisible | 默认是否显示敏感信息 | `boolean` | `false` |
| visible | 受控模式下的显示状态 | `boolean` | - |
| onVisibleChange | 显示状态变化回调 | `(visible: boolean) => void` | - |
| onCopy | 复制成功回调 | `(value: string) => void` | - |
| className | 自定义样式类名 | `string` | - |
| style | 自定义样式 | `React.CSSProperties` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| tooltips | 提示文本配置 | `{ show?: string; hide?: string; copy?: string }` | `{ show: '显示', hide: '隐藏', copy: '复制' }` |

## 脱敏规则

| 类型 | 脱敏规则 | 示例 |
| --- | --- | --- |
| phone | 保留前3位和后4位 | `138****5678` |
| email | 保留@前的前2位和@后的全部 | `ex****@domain.com` |
| idCard | 保留前6位和后4位 | `110101********1234` |
| bankCard | 保留前4位和后4位 | `6222************0123` |
| general | 保留前3位和后3位 | `123*******456` |
| custom | 根据customRule自定义 | 可自定义 |