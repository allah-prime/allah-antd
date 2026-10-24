### 代码演示

#### 基本用法

```jsx
import React, { useState } from 'react';
import { ListSearch2 } from '../..';

const options = [
  {
    label: '前端开发',
    value: '1',
    color: '#1890ff',
    description: 'React, Vue, Angular等前端技术',
  },
  {
    label: '后端开发',
    value: '2',
    color: '#52c41a',
    description: 'Java, Python, Node.js等后端技术',
  },
  {
    label: '移动开发',
    value: '3',
    color: '#faad14',
  },
  {
    label: '数据库',
    value: '4',
    color: '#f5222d',
  },
];

export default () => {
  const [selectedValue, setSelectedValue] = useState([]);

  const onChange = (values, item, options) => {
    console.log('选中的值:', values);
    setSelectedValue(values);
  };

  return (
    <div>
      <h3>单选模式</h3>
      <ListSearch2 
        options={options} 
        onChange={onChange} 
        showSearch={false}
        optionsStyle={{
          height: 210,
          border: 'none',
        }} 
      />
    </div>
  );
};
```

#### 多选模式with分类筛选

```jsx
import React, { useState } from 'react';
import { ListSearch2 } from '../..';

const options = [
  {
    checked: false,
    color: '#3d55ab',
    description: null,
    disabled: false,
    key: null,
    label: '人工智能+',
    other: null,
    text: null,
    value: '45213'
  },
  {
    checked: false,
    color: '#f73135',
    description: null,
    disabled: false,
    key: null,
    label: '注册资本认缴',
    other: null,
    text: null,
    value: '45214'
  },
  {
    checked: false,
    color: '#08a835',
    description: null,
    disabled: false,
    key: null,
    label: '统一大市场',
    other: null,
    text: null,
    value: '45215'
  },
  {
    checked: false,
    color: '#51285c',
    description: null,
    disabled: false,
    key: null,
    label: '新质生产力',
    other: null,
    text: null,
    value: '45216'
  },
  {
    checked: false,
    color: '#59c917',
    description: null,
    disabled: false,
    key: null,
    label: '新公司法',
    other: null,
    text: null,
    value: '45222'
  },
  {
    checked: false,
    color: '#4f2c0d',
    description: null,
    disabled: false,
    key: null,
    label: '高效办成一件事',
    other: null,
    text: null,
    value: '45235'
  },
  {
    checked: false,
    color: '#3d551a',
    description: null,
    disabled: false,
    key: null,
    label: '放心消费行动',
    other: null,
    text: null,
    value: '45236'
  },
  {
    checked: false,
    color: '#2274b4',
    description: null,
    disabled: false,
    key: null,
    label: '食品安全社会共治',
    other: null,
    text: null,
    value: '45244'
  },
  {
    checked: false,
    color: '#f1aca5',
    description: null,
    disabled: false,
    key: null,
    label: '登记注册规范化标准化',
    other: null,
    text: null,
    value: '45245'
  },
  {
    checked: false,
    color: '#7f54b7',
    description: null,
    disabled: false,
    key: null,
    label: '恶意举报和职业打假',
    other: null,
    text: null,
    value: '45253'
  },
  {
    checked: false,
    color: '#1886dc',
    description: null,
    disabled: false,
    key: null,
    label: '个体工商户分型分类帮扶',
    other: null,
    text: null,
    value: '45254'
  }
];

export default () => {
  const [selectedValues, setSelectedValues] = useState([]);

  const onChange = (values, item, options) => {
    console.log('选中的值:', values);
    setSelectedValues(values);
  };

  return (
    <div>
      <ListSearch2 
        options={options} 
        onChange={onChange} 
        type="checkbox" 
        classifyValue={{45222: '1', 45245: '1'}}
      />
      <p>已选择: {selectedValues.length} 项</p>
    </div>
  );
};
```

#### 长文本处理

```jsx
import React, { useState } from 'react';
import { ListSearch2 } from '../..';

const defValue = [
  {
    label: '选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1',
    value: '1',
    description: '我是简要描述',
    color: '#1890ff',
  },
  {
    label: '选项2',
    value: '2',
    color: '#52c41a',
  },
  {
    label: '选项3',
    value: '3',
    color: '#faad14',
  },
  {
    label: '选项4',
    value: '4',
    color: '#f5222d',
  },
  {
    label: '选项5',
    value: '5',
    color: '#722ed1',
  },
  {
    label: '选项6',
    value: '6',
    color: '#fa8c16',
  },
  {
    label: '选项7',
    value: '7',
    color: '#13c2c2',
  },
  {
    label: '选项8',
    value: '8',
    color: '#eb2f96',
  },
  {
    label: '选项9',
    value: '9',
    color: '#a0d911',
  },
  {
    label: '选项10',
    value: '10',
    color: '#fadb14',
  },
];

export default () => {
  const [options, setOptions] = useState([...defValue]);

  const onChange = (values, item, allOptions) => {
    console.log('选中的值:', values);
    setOptions(allOptions);
  };

  return (
    <div>
      <ListSearch2 
        options={options} 
        onChange={onChange} 
        type="checkbox"
        optionsStyle={{
          height: 300,
          border: '1px solid #d9d9d9',
          borderRadius: 6,
        }}
      />
    </div>
  );
};
```

#### 在弹窗中使用

```jsx
import React, { useState } from 'react';
import { Button, Modal, Popover } from 'antd';
import { ListSearch2 } from '../..';

const options = [
  {
    label: '前端工程师',
    value: '1',
    color: '#1890ff',
    description: '负责前端开发工作',
  },
  {
    label: '后端工程师',
    value: '2',
    color: '#52c41a',
    description: '负责后端开发工作',
  },
  {
    label: '产品经理',
    value: '3',
    color: '#faad14',
    description: '负责产品规划工作',
  },
  {
    label: '设计师',
    value: '4',
    color: '#f5222d',
    description: '负责UI/UX设计工作',
  },
];

export default () => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const onChange = (values, item, allOptions) => {
    console.log('选中的值:', values);
    setSelectedOptions(allOptions);
  };

  return (
    <div>
      <h3>在Modal中使用</h3>
      <Button onClick={() => setOptionsVisible(true)}>
        显示选项
      </Button>
      <Modal 
        title="选择岗位"
        open={optionsVisible} 
        onCancel={() => setOptionsVisible(false)}
        footer={null}
        width={400}
      >
        <ListSearch2 options={options} onChange={onChange} type="checkbox"/>
      </Modal>

      <h3>在Popover中使用</h3>
      <Popover 
        content={
          <div style={{width: 300}}>
            <ListSearch2 options={options} onChange={onChange} type="checkbox"/>
          </div>
        }
        trigger="click"
        placement="bottomRight"
        title="选择岗位"
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
import { ListSearch2 } from '../..';

const options = [
  { label: '管理员', value: 'admin', color: '#f5222d' },
  { label: '编辑者', value: 'editor', color: '#faad14' },
  { label: '查看者', value: 'viewer', color: '#52c41a' },
  { label: '访客', value: 'guest', color: '#1890ff' },
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
      name="roleForm2"
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
        <ListSearch2 options={options} />
      </Form.Item>

      <Form.Item
        label="多选角色"
        name="multipleRoles"
        rules={[{ required: true, message: '请至少选择一个角色!' }]}
      >
        <ListSearch2 options={options} type="checkbox" />
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

### API

#### ListSearch2

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 可选项数据源 | `IOptions7<string>[]` | `[]` |
| onChange | 选择变化时的回调函数 | `(value: string[], item?: IOptions7<string>, options?: IOptions7<string>[]) => void` | - |
| value | 当前选中的值 | `string[]` | - |
| type | 选择类型 | `'radio' \| 'checkbox'` | `'radio'` |
| showSearch | 是否显示搜索框 | `boolean` | `true` |
| optionsStyle | 选项区域样式 | `React.CSSProperties` | - |
| itemRender | 自定义选项渲染函数 | `(item: IOptions6<string>) => React.ReactNode` | - |
| classifyValue | 分类值对象，用于标记特定选项的分类状态 | `Record<string, string>` | - |
| checkKey | 控制选择的值（受控模式） | `string[]` | - |

#### IOptions7 数据结构（ListSearch2扩展）

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
  /** 颜色标识（ListSearch2特有） */
  color?: string;
  /** 其他扩展字段 */
  key?: string | null;
  other?: any;
  text?: string | null;
  [key: string]: any;
}
```

#### classifyValue 说明

`classifyValue` 是一个对象，用于标记特定选项的分类状态：

```typescript
// 示例：将值为 '45222' 和 '45245' 的选项标记为分类 '1'
const classifyValue = {
  '45222': '1',
  '45245': '1'
};
```

#### ListSearch2 与 ListSearch 的区别

| 特性 | ListSearch | ListSearch2 |
| --- | --- | --- |
| 颜色支持 | ❌ | ✅ 支持 `color` 属性 |
| 分类筛选 | ❌ | ✅ 支持 `classifyValue` |
| 更丰富的数据结构 | ❌ | ✅ 支持更多扩展字段 |
| 标签化展示 | ❌ | ✅ 更好的视觉效果 |
| 受控模式 | ✅ | ✅ 额外支持 `checkKey` |

#### 注意事项

- `color` 属性支持十六进制颜色值，会影响选项的视觉展示
- `classifyValue` 用于高级分类场景，可以标记特定选项的分类状态
- 组件保持与 `ListSearch` 相同的基础 API，可以无缝迁移
- 长文本会自动截断并显示省略号
- 支持所有 `ListSearch` 的功能，同时提供更多高级特性

#### FAQ

**Q: ListSearch2 相比 ListSearch 有什么优势？**

A: ListSearch2 提供了颜色标识、分类筛选、更丰富的数据结构支持等高级功能，适合需要更强视觉效果和复杂交互的场景。

**Q: classifyValue 的作用是什么？**

A: `classifyValue` 用于标记特定选项的分类状态，可以用于实现分组筛选、状态标识等高级功能。

**Q: 如何设置选项的颜色？**

A: 在选项数据的 `color` 字段中设置十六进制颜色值，如 `#1890ff`，组件会自动应用这个颜色到相应的视觉元素上。

**Q: 是否可以从 ListSearch 迁移到 ListSearch2？**

A: 可以，ListSearch2 保持了与 ListSearch 相同的基础 API，可以直接替换组件名称，然后根据需要添加新的特性配置。

**Q: 如何处理长文本显示？**

A: 组件内置了长文本处理机制，会自动截断过长的文本并显示省略号，保持界面的整洁性。
