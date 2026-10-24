---
title: ExplainTips 说明提示
toc: content
group:
  title: 工具
  order: 5
---

# ExplainTips 说明提示

## 何时使用
`ExplainTips` 组件用于在用户界面上提供额外的帮助信息或解释，通常与图标结合使用。当用户将鼠标悬停在图标上时，会显示相关的提示内容。适用于需要简洁展示提示信息的场景。

## 代码演示

### 基本用法

```jsx
import React from 'react';
import ExplainTips from './';

const BasicExample = () => (
  <div>
    <p>
      这是一个需要解释的内容 <ExplainTips content="这是一个额外的提示信息" />
    </p>
  </div>
);

export default BasicExample;
```

### 带有详细描述的提示

```jsx
import React from 'react';
import ExplainTips from './';

const DetailedExample = () => (
  <div>
    <p>
      查看详情 <ExplainTips content="点击这里查看更多详细信息和帮助文档。" />
    </p>
  </div>
);

export default DetailedExample;
```

### 在表单字段旁边展示提示

```jsx
import React from 'react';
import ExplainTips from './';

const FormExample = () => (
  <form>
    <label>
      用户名
      <ExplainTips content="请输入您的全名。此信息将用于您的账户设置。" />
    </label>
    <input type="text" name="username" />
    <button type="submit">提交</button>
  </form>
);

export default FormExample;
```

## FAQ

**Q: `ExplainTips` 组件支持自定义样式吗？**  
A: 目前，`ExplainTips` 组件只支持通过 `style` 属性自定义图标的样式。如果需要更复杂的样式自定义，可能需要对组件进行扩展。

**Q: 如何改变提示框的显示位置？**  
A: 组件使用了 `antd` 的 `Tooltip`，你可以通过 `Tooltip` 的 `placement` 属性来设置提示框的显示位置，例如 `topLeft`、`bottomRight` 等。你可以在 `ExplainTips` 组件中添加 `placement` 属性并将其传递给 `Tooltip`。

---
