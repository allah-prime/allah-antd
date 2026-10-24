---
title: AhCascader
group:
  title: 数据录入
  order: 1
nav:
  title: 移动端
  order: 5
  path: /mobile
demo:
  cols: 2
---

# 级联选择器 AhCascader

级联选择器，用于多层级数据的选择，支持省市区、部门职位等场景。

## 何时使用 {#when-to-use}

- 需要从一组相关联的数据集合进行选择，例如省市区，公司部门，事物分类等
- 选项数量较多，需要通过层级结构来组织
- 需要根据前一级的选择来确定下一级的选项

## 代码演示

<code src="../demos/AhCascaderDemo.tsx"></code>

## API

级联选择器基于 `AhFormItem` 实现，通过设置 `valueType="cascader"` 来使用。

### AhFormItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| valueType | 值类型，设置为 `cascader` | `string` | - |
| options | 级联选择的数据源 | `CascaderOption[]` | `[]` |
| fieldProps | 传递给级联选择器的属性 | `CascaderProps` | - |

### CascaderOption

```typescript
interface CascaderOption {
  label: string;          // 显示的文本
  value: string | number; // 选项的值
  key: string;           // 唯一标识
  children?: CascaderOption[]; // 子选项
}
```

### CascaderProps (fieldProps)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| allowClear | 是否支持清空 | `boolean` | `false` |
| showSearch | 是否支持搜索 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否显示加载状态 | `boolean` | `false` |
| placeholder | 输入框占位文本 | `string` | `请选择` |
| filter | 自定义搜索过滤函数 | `(inputValue: string, path: CascaderOption[]) => boolean` | - |

## 使用场景

### 1. 三级级联 - 省市区选择
适用于地址选择，数据层级为：省份 → 城市 → 区县

```typescript
const areaOptions = [
  {
    label: '浙江省',
    value: 'zj',
    key: 'zj',
    children: [
      {
        label: '杭州市',
        value: 'hz',
        key: 'hz',
        children: [
          { label: '西湖区', value: 'xh', key: 'xh' },
          { label: '余杭区', value: 'yh', key: 'yh' }
        ]
      }
    ]
  }
];
```

### 2. 二级级联 - 部门职位
适用于组织架构选择，数据层级为：部门 → 职位

```typescript
const departmentOptions = [
  {
    label: '技术部',
    value: 'tech',
    key: 'tech',
    children: [
      { label: '前端开发', value: 'frontend', key: 'frontend' },
      { label: '后端开发', value: 'backend', key: 'backend' }
    ]
  }
];
```

### 3. 单级选择
当数据只有一层时，级联选择器表现类似普通选择器

```typescript
const cityOptions = [
  { label: '北京', value: 'beijing', key: 'beijing' },
  { label: '上海', value: 'shanghai', key: 'shanghai' }
];
```

### 4. 大数据量场景
当选项数量较多时，建议开启搜索功能

```typescript
<AhFormItem
  title="大数据量区域"
  dataIndex="area"
  valueType="cascader"
  options={largeDataOptions}
  fieldProps={{
    showSearch: true,
    allowClear: true,
    filter: (inputValue, path) => {
      return path.some(option => 
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  }}
/>
```

### 5. 异步加载数据
支持动态加载数据，可以显示加载状态

```typescript
const [options, setOptions] = useState([]);

useEffect(() => {
  // 模拟异步加载
  setTimeout(() => {
    setOptions(loadedData);
  }, 1000);
}, []);

<AhFormItem
  title="异步加载区域"
  dataIndex="asyncArea"
  valueType="cascader"
  options={options}
  fieldProps={{
    loading: options.length === 0,
    placeholder: options.length === 0 ? '数据加载中...' : '请选择'
  }}
/>
```

## 注意事项

1. **数据结构**：确保每个选项都有 `label`、`value`、`key` 属性
2. **唯一标识**：`key` 属性必须在同级选项中唯一
3. **性能优化**：大数据量时建议开启搜索功能，提升用户体验
4. **异步加载**：可以通过 `loading` 属性显示加载状态
5. **搜索功能**：可以自定义 `filter` 函数来实现特定的搜索逻辑

## FAQ

### 如何获取选中的完整路径？

级联选择器返回的值是一个数组，包含从根节点到叶子节点的完整路径：

```typescript
// 选择 "浙江省 → 杭州市 → 西湖区" 时
// 返回值为：['zj', 'hz', 'xh']
```

### 如何设置默认值？

通过表单的 `initialValues` 或 `form.setFieldsValue` 设置：

```typescript
// 设置默认选中 "技术部 → 前端开发"
<Form initialValues={{ department: ['tech', 'frontend'] }}>
  <AhFormItem
    title="部门职位"
    dataIndex="department"
    valueType="cascader"
    options={departmentOptions}
  />
</Form>
```

### 如何实现动态加载子级数据？

可以通过监听选择事件，动态更新 options：

```typescript
const [options, setOptions] = useState(initialOptions);

const handleChange = (value, selectedOptions) => {
  // 根据选择的值动态加载下级数据
  if (value.length === 1) {
    loadChildrenData(value[0]).then(children => {
      // 更新对应选项的 children
      setOptions(updatedOptions);
    });
  }
};
```
