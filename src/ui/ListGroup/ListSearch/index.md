### 代码演示

#### 基本用法

```jsx
import React, { useState } from 'react';
import { ListSearch } from '../..';

const options = [
  {
    label: '选项1',
    value: '1',
    description: '这是选项1的描述',
  },
  {
    label: '选项2',
    value: '2',
    description: '这是选项2的描述',
  },
  {
    label: '选项3',
    value: '3',
  },
  {
    label: '选项4',
    value: '4',
  },
];

export default () => {
  const [value, setValue] = useState([]);

  const onChange = (selectedValues, clickedItem, allOptions) => {
    console.log('选中的值:', selectedValues);
    console.log('点击的项:', clickedItem);
    setValue(selectedValues);
  };

  return (
    <div>
      <h3>单选模式（默认）</h3>
      <ListSearch options={options} onChange={onChange} value={value} />
    </div>
  );
};
```

#### 多选模式

```jsx
import React, { useState } from 'react';
import { ListSearch } from '../..';

const options = [
  {
    label: '前端开发',
    value: 'frontend',
    description: 'React, Vue, Angular等前端技术',
  },
  {
    label: '后端开发',
    value: 'backend',
    description: 'Java, Python, Node.js等后端技术',
  },
  {
    label: '移动开发',
    value: 'mobile',
    description: 'iOS, Android, React Native等',
  },
  {
    label: '数据库',
    value: 'database',
    description: 'MySQL, MongoDB, Redis等',
  },
  {
    label: '运维',
    value: 'devops',
    description: 'Docker, Kubernetes, CI/CD等',
  },
];

export default () => {
  const [value, setValue] = useState(['frontend', 'backend']);

  const onChange = (selectedValues, clickedItem, allOptions) => {
    console.log('选中的值:', selectedValues);
    setValue(selectedValues);
  };

  return (
    <div>
      <ListSearch 
        options={options} 
        onChange={onChange} 
        type="checkbox" 
        value={value}
      />
      <p>当前选中: {value.join(', ')}</p>
    </div>
  );
};
```

#### 大量数据with长文本

```jsx
import React, { useState } from 'react';
import { ListSearch } from '../..';

const defValue = [
  {
    label: '选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1',
    value: '1',
    description: '我是简要描述',
  },
  {
    label: '选项2',
    value: '2',
  },
  {
    label: '选项3',
    value: '3',
  },
  {
    label: '选项4',
    value: '4',
  },
  {
    label: '选项5',
    value: '5',
  },
  {
    label: '选项6',
    value: '6',
  },
  {
    label: '选项7',
    value: '7',
  },
  {
    label: '选项8',
    value: '8',
  },
  {
    label: '选项9',
    value: '9',
  },
  {
    label: '选项10',
    value: '10',
  },
];

export default () => {
  const [options, setOptions] = useState([...defValue]);

  const onChange = (selectedValues, clickedItem, allOptions) => {
    console.log('选中的值:', selectedValues);
    setOptions(allOptions);
  };

  return (
    <div>
      <ListSearch 
        options={options} 
        onChange={onChange} 
        type="checkbox"
        optionsStyle={{ height: 300 }}
      />
    </div>
  );
};
```

#### 在弹窗中使用

```jsx
import React, { useState } from 'react';
import { Button, Modal, Popover } from 'antd';
import { ListSearch } from '../..';

const options = [
  { label: '选项1', value: '1', description: '我是简要描述' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
  { label: '选项6', value: '6' },
];

export default () => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const onChange = (selectedValues, clickedItem, allOptions) => {
    console.log('选中的值:', selectedValues);
    setSelectedOptions(allOptions);
  };

  return (
    <div>
      <h3>在Modal中使用</h3>
      <Button onClick={() => setOptionsVisible(true)}>
        显示选项
      </Button>
      <Modal 
        title="选择选项"
        open={optionsVisible} 
        onCancel={() => setOptionsVisible(false)}
        footer={null}
        width={400}
      >
        <ListSearch options={options} onChange={onChange} type="checkbox"/>
      </Modal>

      <h3>在Popover中使用</h3>
      <Popover 
        content={
          <div style={{width: 300}}>
            <ListSearch options={options} onChange={onChange} type="checkbox"/>
          </div>
        }
        trigger="click"
        placement="bottomRight"
        title="选择选项"
      >
        <Button type="primary">点击选择</Button>
      </Popover>
    </div>
  );
};
```

#### 在表单中使用

```tsx
import React from 'react';
import { Button, Form } from 'antd';
import { ListSearch } from '../..';

const options = [
  { label: '管理员', value: 'admin' },
  { label: '编辑者', value: 'editor' },
  { label: '查看者', value: 'viewer' },
  { label: '访客', value: 'guest' },
];

export default () => {
  const onFinish = (values: any) => {
    console.log('表单提交:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('表单验证失败:', errorInfo);
  };

  return (
    <Form
      name="roleForm"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{ 
        singleRole: ['admin'], 
        multipleRoles: ['admin', 'editor'] 
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="单选角色"
        name="singleRole"
        rules={[{ required: true, message: '请选择一个角色!' }]}
      >
        <ListSearch options={options} />
      </Form.Item>

      <Form.Item
        label="多选角色"
        name="multipleRoles"
        rules={[{ required: true, message: '请至少选择一个角色!' }]}
      >
        <ListSearch options={options} type="checkbox" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};
```

#### 禁用搜索功能

```jsx
import React, { useState } from 'react';
import { ListSearch } from '../..';

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
];

export default () => {
  const [value, setValue] = useState([]);

  const onChange = (selectedValues) => {
    setValue(selectedValues);
  };

  return (
    <div>
      <ListSearch 
        options={options} 
        onChange={onChange} 
        showSearch={false}
        optionsStyle={{ border: '1px solid #d9d9d9', borderRadius: 6 }}
      />
    </div>
  );
};
```

### API

#### ListSearch

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 可选项数据源 | `IOptions7<string>[]` | `[]` |
| onChange | 选择变化时的回调函数 | `(value: string[], item?: IOptions7<string>, options?: IOptions7<string>[]) => void` | - |
| value | 当前选中的值 | `string[]` | - |
| type | 选择类型 | `'radio' \| 'checkbox'` | `'radio'` |
| showSearch | 是否显示搜索框 | `boolean` | `true` |
| optionsStyle | 选项区域样式 | `React.CSSProperties` | - |
| itemRender | 自定义选项渲染函数 | `(item: IOptions6<string>) => React.ReactNode` | - |

#### IOptions7 数据结构

```typescript
interface IOptions7<T> {
  /** 显示文本 */
  label: string;
  /** 选项值 */
  value: T;
  /** 是否选中 */
  checked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 描述信息 */
  description?: string;
  /** 其他扩展字段 */
  [key: string]: any;
}
```

#### onChange 回调参数

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| value | 当前选中的值数组 | `string[]` |
| item | 当前点击的选项（可选） | `IOptions7<string>` |
| options | 所有选项的当前状态（可选） | `IOptions7<string>[]` |

#### 注意事项

- 单选模式下，`value` 数组只包含一个元素
- 多选模式下，`value` 数组包含所有选中的元素
- 搜索功能支持对 `label` 和 `value` 进行模糊匹配
- 组件内部维护选项的 `checked` 状态
- 支持通过 `value` 属性控制初始选中状态

### FAQ

**Q: 如何控制选项的初始选中状态？**

A: 通过 `value` 属性传入选中的值数组，组件会自动更新对应选项的选中状态。

**Q: 搜索功能的匹配规则是什么？**

A: 搜索功能会对选项的 `label` 和 `value` 字段进行包含匹配（includes），支持部分文本匹配。

**Q: 如何在表单中使用该组件？**

A: 组件支持标准的表单值传递，可以直接在 Form.Item 中使用。单选模式下传入包含一个元素的数组，多选模式下传入包含多个元素的数组。

**Q: 如何自定义选项的渲染样式？**

A: 使用 `itemRender` 属性传入自定义渲染函数，可以完全控制选项的显示样式和交互逻辑。

**Q: 组件是否支持异步加载选项？**

A: 组件本身不处理异步加载，但可以通过更新 `options` 属性来动态更新选项列表。
