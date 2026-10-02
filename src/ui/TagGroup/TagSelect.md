---
toc: content
group:
  title: 展示
  order: 0
---

# TagSelect
标签选择器

## 何时使用
适用于需要用户从一组标签中选择多个选项的场景，特别是当标签数量较多时，可以选择展开或收起以节省空间。

## 代码演示

### 示例 1: 基本使用
展示如何使用`TagSelect`组件进行基本的标签选择。

```jsx
import React, { useState } from 'react';
import TagSelect from './index';

const Demo = () => {
	const [selectedTags, setSelectedTags] = useState([]);

	return (
		<TagSelect
			value={selectedTags}
			onChange={setSelectedTags}
			hideCheckAll={false}
			expandable={true}
		>
			<TagSelect.Option value="tag1">Tag 1</TagSelect.Option>
			<TagSelect.Option value="tag2">Tag 2</TagSelect.Option>
			<TagSelect.Option value="tag3">Tag 3</TagSelect.Option>
		</TagSelect>
	);
};

export default Demo;
```

### 示例 2: 展开与收起
演示如何使用`TagSelect`组件的展开和收起功能。

```jsx
import React, { useState } from 'react';
import TagSelect from './';

const Demo = () => {
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <TagSelect
      value={selectedTags}
      onChange={setSelectedTags}
      hideCheckAll={false}
      expandable={true}
    >
      <TagSelect.Option value="tag1">Tag 1</TagSelect.Option>
      <TagSelect.Option value="tag2">Tag 2</TagSelect.Option>
      <TagSelect.Option value="tag3">Tag 3</TagSelect.Option>
      <TagSelect.Option value="tag4">Tag 4</TagSelect.Option>
      <TagSelect.Option value="tag5">Tag 5</TagSelect.Option>
      <TagSelect.Option value="tag6">Tag 6</TagSelect.Option>
    </TagSelect>
  );
};

export default Demo;
```

### 示例 3: 全选功能
展示如何使用`TagSelect`的全选功能。

```jsx
import React, { useState } from 'react';
import TagSelect from './';

const Demo = () => {
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <TagSelect
      value={selectedTags}
      onChange={setSelectedTags}
      hideCheckAll={false}
    >
      <TagSelect.Option value="tag1">Tag 1</TagSelect.Option>
      <TagSelect.Option value="tag2">Tag 2</TagSelect.Option>
      <TagSelect.Option value="tag3">Tag 3</TagSelect.Option>
      <TagSelect.Option value="tag4">Tag 4</TagSelect.Option>
    </TagSelect>
  );
};

export default Demo;
```

## FAQ
**Q: 如何在标签选项中禁用某些选项？**  
A: 可以通过设置`disabled`属性来禁用某些选项，禁用的标签将不能被选中。
