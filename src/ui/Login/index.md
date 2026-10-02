---
toc: content
group:
  title: 数据录入
  order: 1
---
# PasswordLogin
密码登录组件

## 何时使用
`PasswordLogin` 组件适用于需要用户进行密码验证的登录场景。它支持验证码验证、记住密码选项和忘记密码功能。

## 代码演示

### 示例 1: 基本使用
展示一个基础的登录表单，包含用户名、密码输入框及记住密码选项。

```jsx
import React from 'react';
import PasswordLogin from './PasswordLogin';

const BasicExample = () => {
  const handleForgotPassword = () => {
    console.log('忘记密码点击');
  };

  const handleGetVerCode = async () => {
    // 模拟获取验证码的操作
    return 'https://dummyimage.com/104x40/000/fff'; // 替换成实际验证码获取接口
  };

  return (
    <PasswordLogin
      getVerCode={handleGetVerCode}
      showVerCode={false}
      forgotPassword={handleForgotPassword}
      style={{ width: 300, margin: '0 auto' }}
    />
  );
};

export default BasicExample;
```

### 示例 2: 含验证码功能
展示一个包含验证码功能的登录表单。点击验证码图片可更新验证码。

```jsx
import React from 'react';
import PasswordLogin from './PasswordLogin';

const CaptchaExample = () => {
  const handleForgotPassword = () => {
    console.log('忘记密码点击');
  };

  const handleGetVerCode = async () => {
    // 模拟获取验证码的操作
    return 'https://dummyimage.com/104x40/000/fff'; // 替换成实际验证码获取接口
  };

  return (
    <PasswordLogin
      getVerCode={handleGetVerCode}
      showVerCode={true}
      forgotPassword={handleForgotPassword}
      style={{ width: 300, margin: '0 auto' }}
    />
  );
};

export default CaptchaExample;
```

### 示例 3: 自定义样式与提示
展示一个包含自定义样式和提示文本的登录表单。

```jsx
import React from 'react';
import PasswordLogin from './PasswordLogin';

const CustomStyleExample = () => {
  const handleForgotPassword = () => {
    console.log('忘记密码点击');
  };

  const handleGetVerCode = async () => {
    // 模拟获取验证码的操作
    return 'https://dummyimage.com/104x40/000/fff'; // 替换成实际验证码获取接口
  };

  return (
    <PasswordLogin
      getVerCode={handleGetVerCode}
      showVerCode={true}
      forgotPassword={handleForgotPassword}
      spanStyle={{ color: '#1890ff' }} // 自定义记住密码提示的样式
      rememberPwdTip="记住我的密码"
      usernamePlaceholder="输入用户名"
      style={{ width: 350, margin: '0 auto' }}
    />
  );
};

export default CustomStyleExample;
```

## FAQ

### 1. 如何自定义验证码的样式？
你可以通过自定义 `style` 属性来调整验证码图片的样式，例如宽度和高度。

### 2. 如何处理验证码获取失败的情况？
组件内部通过 `message.error` 方法提示获取验证码失败。你可以根据需要在 `getVerCode` 函数中处理错误信息。

### 3. `pwdRef` 属性的作用是什么？
`pwdRef` 允许外部组件通过 `ref` 来访问 `PasswordLogin` 组件的内部方法，例如刷新验证码。

---

