### 代码演示

#### 基础用法

最简单的用法，数据自动循环滚动。

```tsx
import { ListCarousel } from '../..';

const App = () => {
  const data = [
    { title: '标题1', content: '内容1', key: '1' },
    { title: '标题2', content: '内容2', key: '2' },
    { title: '标题3', content: '内容3', key: '3' },
    { title: '标题4', content: '内容4', key: '4' },
    { title: '标题5', content: '内容5', key: '5' },
  ];

  const renderItem = (item: any, index: number) => {
    return (
      <div
        style={{
          width: '100%',
          height: 50,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 16,
          backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff',
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <strong>{item.title}</strong>
        <span style={{ marginLeft: 12, color: '#666' }}>{item.content}</span>
      </div>
    );
  };

  return (
    <ListCarousel 
      data={data} 
      renderItem={renderItem} 
      height={200}
      itemHeight={50}
    />
  );
};

export default App;
```

#### 弹跳动画效果

使用弹跳动画，让滚动更有节奏感。

```tsx
import { ListCarousel } from '../..';

const App = () => {
  const data = [
    { title: '🎉 系统升级通知', content: '系统将于今晚进行升级维护', key: '1' },
    { title: '📢 新功能发布', content: '新增数据导出功能', key: '2' },
    { title: '⚠️ 重要提醒', content: '请及时备份重要数据', key: '3' },
    { title: '🔔 活动通知', content: '双十一活动即将开始', key: '4' },
    { title: '📊 数据报告', content: '月度数据报告已生成', key: '5' },
    { title: '🎯 目标达成', content: '本月销售目标已达成', key: '6' },
  ];

  const renderItem = (item: any, index: number) => {
    return (
      <div
        style={{
          width: '100%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 16,
          backgroundColor: '#fff',
          borderLeft: '4px solid #1890ff',
          marginBottom: 2,
        }}
      >
        <span style={{ fontSize: 14 }}>{item.title}</span>
      </div>
    );
  };

  return (
    <ListCarousel 
      data={data} 
      renderItem={renderItem} 
      height={160}
      itemHeight={42}
      speed={2000}
      animationType="bounce"
    />
  );
};

export default App;
```

#### 自定义配置

展示更多配置选项的使用。

```tsx
import { ListCarousel } from '../..';

const App = () => {
  const data = [
    { title: '标题1', content: '这是一条很长的内容描述，用来测试文本溢出的处理', key: '1' },
    { title: '标题2', content: '内容2', key: '2' },
    { title: '标题3', content: '内容3', key: '3' },
  ];

  const renderItem = (item: any, index: number) => {
    return (
      <div
        style={{
          width: '100%',
          height: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: 4,
          margin: '2px 0',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.title}</div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.content}
        </div>
      </div>
    );
  };

  return (
    <ListCarousel 
      data={data} 
      renderItem={renderItem} 
      height={200}
      itemHeight={64}
      speed={3000}
      autoPlay={true}
      animationType="linear"
      visibleCount={3}
    />
  );
};

export default App;
```

#### 数据不足时的处理

当数据量不足以填满容器时，组件会自动停止滚动。

```tsx
import { ListCarousel } from '../..';

const App = () => {
  const data = [
    { title: '仅有的数据1', content: '内容1', key: '1' },
    { title: '仅有的数据2', content: '内容2', key: '2' },
  ];

  const renderItem = (item: any, index: number) => {
    return (
      <div
        style={{
          width: '100%',
          height: 50,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 16,
          backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff',
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        {item.title}
      </div>
    );
  };

  return (
    <ListCarousel 
      data={data} 
      renderItem={renderItem} 
      height={200}
      itemHeight={50}
    />
  );
};

export default App;
```

### API

#### ListCarousel

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 数据数组 | `T[]` | `[]` |
| renderItem | 渲染每一项的函数 | `(item: T, index: number) => React.ReactNode` | - |
| speed | 滚动速度，单位毫秒 | `number` | `1000` |
| autoPlay | 是否自动滚动 | `boolean` | `true` |
| className | 组件样式类名 | `string` | - |
| style | 组件样式 | `React.CSSProperties` | - |
| height | 组件高度 | `number \| string` | `200` |
| itemHeight | 每个项目的高度，单位px | `number` | `50` |
| visibleCount | 容器可见区域能显示的项目数量，不传则自动计算 | `number` | - |
| animationType | 动画类型 | `'linear' \| 'bounce'` | `'linear'` |

#### AnimationType

| 值 | 说明 |
| --- | --- |
| linear | 线性匀速滚动，适合稳定节奏的场景 |
| bounce | 弹跳效果滚动，每次移动一个项目高度，适合活泼的界面风格 |

#### 注意

- 当 `data.length <= visibleCount` 时，组件会自动停止滚动，保持静态显示
- `visibleCount` 不传时，会根据 `height / itemHeight` 自动计算
- `renderItem` 函数的 `index` 参数是原始数据的索引，不会因为数据复制而改变
- 建议为每个数据项提供唯一的 `key` 属性以优化渲染性能

### FAQ

**为什么我的数据没有滚动？**

请检查以下几点：
1. 数据量是否大于可见区域能显示的项目数量
2. `autoPlay` 是否设置为 `true`
3. `height` 和 `itemHeight` 的设置是否合理

**如何自定义滚动速度？**

通过 `speed` 参数控制每次滚动的时间间隔，单位为毫秒。值越小滚动越快。

**弹跳动画和线性动画有什么区别？**

- `linear`：匀速连续滚动，适合信息流展示
- `bounce`：每次弹跳移动一个项目高度，有节奏感，适合通知类展示

**如何处理长文本溢出？**

在 `renderItem` 函数中使用 CSS 样式处理，如：
```css
{
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}
```