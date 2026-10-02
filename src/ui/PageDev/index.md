---
toc: content
group:
  title: 展示
  order: 0
---
# Result
结果提示
## 何时使用
当你需要向用户展示操作结果或状态信息时，使用 `Result` 组件可以提供清晰的反馈。这个组件适用于显示成功、错误、警告或信息提示。

## 代码演示

### 示例 1: 开发中页面提示
```jsx
import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';

const DevelopmentPage = () => (
  <Result 
    icon={<SmileOutlined />} 
    title="该页面正在开发中，敬请期待！" 
  />
);

export default DevelopmentPage;
```
展示一个开发中的页面提示，配有笑脸图标。

### 示例 2: 成功操作提示
```jsx
import { CheckCircleOutlined } from '@ant-design/icons';
import { Result } from 'antd';

const SuccessPage = () => (
  <Result 
    icon={<CheckCircleOutlined />} 
    title="操作成功！" 
    subTitle="你的操作已成功完成。" 
  />
);

export default SuccessPage;
```
展示一个成功操作的提示，配有勾选圆圈图标，并带有副标题。

### 示例 3: 错误信息提示
```jsx
import { CloseCircleOutlined } from '@ant-design/icons';
import { Result } from 'antd';

const ErrorPage = () => (
  <Result 
    icon={<CloseCircleOutlined />} 
    title="操作失败" 
    subTitle="请稍后重试或联系客服。" 
  />
);

export default ErrorPage;
```
展示一个错误信息提示，配有关闭圆圈图标，并带有副标题。

## FAQ
**Q: `Result` 组件是否可以自定义图标和内容？**  
A: 是的，`Result` 组件支持自定义图标和内容，可以通过 `icon` 和 `title` 属性来调整。
