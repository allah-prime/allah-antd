---
toc: content
group:
  title: 展示
  order: 0
---

# TagSelect2

标签选择器。完整示例见 [TagGroup / TagSelect2](/uis/tag-group)。

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
      expandable
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
