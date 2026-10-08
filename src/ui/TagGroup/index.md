---
title: TagGroup 标签
toc: content
group:
  title: 数据展示
  order: 2
---

# TagGroup 标签

本页收纳标签相关导出：`TagSelect2`、`TagSwitch`、`TagList`、`TagOptions`（内含 `TagManage`）。

## TagSelect2 标签选择

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

## TagSwitch 标签开关

在一组标签里切换当前项。`options` 直接给数据，或用 `groupListReq` 异步拉取；改动通过 `groupChangeReq` 回写。

<embed src="./TagSwitch.md"></embed>

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `options` | 标签数据 | `IOptions7<string>[]` | - |
| `onValueChange` | 选中值变化 | `(value: string) => void` | - |
| `groupListReq` | 异步获取标签 | `() => Promise<IOptions7<string>[]>` | - |
| `groupChangeReq` | 数据修改后的回调 | `(type, item) => Promise<void>` | - |
| `leftTitle` | 左侧标题，传入后显示左侧区域 | `string` | - |
| `leftKey` | 左侧点击使用的 key | `string` | - |

## TagList 标签列表

只读展示一组可关闭的标签。适合表单里回显已选标签，关闭后通过 `onChange` 抛出剩余项。

```jsx
import React from 'react';
import { TagList } from '@allahjs/antd';

export default () => (
  <TagList
    value={[
      { label: '标签1', value: 'tag1' },
      { label: '标签2', value: 'tag2' },
    ]}
    onChange={(next) => console.log(next)}
  />
);
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 当前标签。表单托管时不必手写 | `IOptions7<string>[]` | `[]` |
| `onChange` | 关闭标签后的剩余列表 | `(value: IOptions7<string>[]) => void` | - |

## TagOptions 标签选项

带新增入口的标签选择。`request` 拉可选标签，`newTagRequest` 负责新建并返回 id。`TagManage` 是它内部的管理弹层，不单独导出页面。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 已选 id | `string[]` | - |
| `onChange` | 选中变化，第二个参数是完整标签对象 | `(ids: string[], itemList?: ITagItem[]) => void` | - |
| `request` | 按关键字拉标签列表 | `(keyword?: string) => Promise<ITagItem[]>` | - |
| `newTagRequest` | 新建标签并返回 id | `(tag: ITagItem) => Promise<string>` | - |
| `disabled` | 是否禁用 | `boolean` | - |
| `showAdd` | 是否显示新建按钮 | `boolean` | `true` |
| `autoRequest` | 是否自动请求 | `boolean` | - |
| `isTagColor` | 是否选择标签颜色 | `boolean` | - |
