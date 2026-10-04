---
toc: content
group:
  title: 展示
  order: 0
---

# TagSelect2

标签选择器

## 何时使用

适用于需要用户从一组标签中选择多个选项的场景。标签数量较多时，可以展开或收起以节省空间。

## 代码演示

### 示例 1: 基本使用

展示如何使用 `TagSelect2` 进行基本的标签选择。

```jsx
import React, { useState } from 'react';
import TagSelect from './TagSelect2';

const Demo = () => {
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <TagSelect
      value={selectedTags}
      onChange={setSelectedTags}
      options={[
        { label: '标签1', value: 'tag1' },
        { label: '标签2', value: 'tag2' },
        { label: '标签3', value: 'tag3' },
        { label: '标签4', value: 'tag4' },
        { label: '标签5', value: 'tag5' },
        { label: '标签6', value: 'tag6' }
      ]}
    />
  );
};

export default Demo;
```

### 示例 2: 展开与收起

标签超出一行时，右侧会出现「展开 / 收起」，收起时只保留一行，不再裁切半截标签。

```jsx
import React, { useState } from 'react';
import TagSelect from './TagSelect2';

const Demo = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const options = Array.from({ length: 18 }, (_, index) => ({
    label: `标签${index + 1}`,
    value: `tag${index + 1}`
  }));

  return (
    <TagSelect
      value={selectedTags}
      onChange={setSelectedTags}
      expandable
      options={options}
    />
  );
};

export default Demo;
```

### 示例 3: 全选功能

展示如何使用 `TagSelect2` 的全选功能。

```jsx
import React, { useState } from 'react';
import TagSelect from './TagSelect2';

const Demo = () => {
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <TagSelect
      value={selectedTags}
      onChange={setSelectedTags}
      hideCheckAll={false}
      options={[
        { label: '标签1', value: 'tag1' },
        { label: '标签2', value: 'tag2' },
        { label: '标签3', value: 'tag3' },
        { label: '标签4', value: 'tag4' },
        { label: '标签5', value: 'tag5' },
        { label: '标签6', value: 'tag6' }
      ]}
    />
  );
};

export default Demo;
```

### 示例 4: 禁用与单选

部分选项可设为禁用；`setting` 为 `true` 时切换为单选。

```jsx
import React, { useState } from 'react';
import TagSelect from './TagSelect2';

const Demo = () => {
  const [multiTags, setMultiTags] = useState(['tag1']);
  const [singleTag, setSingleTag] = useState(['tag2']);

  return (
    <div>
      <p>多选（含禁用项）</p>
      <TagSelect
        value={multiTags}
        onChange={setMultiTags}
        hideCheckAll={false}
        options={[
          { label: '标签1', value: 'tag1' },
          { label: '禁用标签', value: 'tag2', disabled: true },
          { label: '标签3', value: 'tag3' },
          { label: '标签4', value: 'tag4' }
        ]}
      />
      <p style={{ marginTop: 16 }}>单选</p>
      <TagSelect
        value={singleTag}
        onChange={setSingleTag}
        setting
        options={[
          { label: '选项A', value: 'tag1' },
          { label: '选项B', value: 'tag2' },
          { label: '选项C', value: 'tag3' }
        ]}
      />
    </div>
  );
};

export default Demo;
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 受控选中值 | `string[]` | - |
| `defaultValue` | 非受控默认选中值 | `string[]` | `[]` |
| `onChange` | 选中项变化回调 | `(value: string[]) => void` | - |
| `options` | 标签选项 | `{ value: string; label: ReactNode; disabled?: boolean }[]` | `[]` |
| `expandable` | 是否显示展开/收起 | `boolean` | `false` |
| `hideCheckAll` | 是否隐藏全选 | `boolean` | `true` |
| `setting` | 为 `true` 时单选 | `boolean` | `false` |
| `actionsText` | 操作文案 | `{ expandText?: string; collapseText?: string; selectAllText?: string }` | `{ expandText: '展开', collapseText: '收起', selectAllText: '选择全部' }` |
| `className` | 容器类名 | `string` | - |
| `tagItemStyle` | 单个标签样式 | `CSSProperties` | - |

## FAQ

**Q: 如何在标签选项中禁用某些选项？**  
A: 在 `options` 中设置 `disabled: true`，禁用的标签将不能被选中。
