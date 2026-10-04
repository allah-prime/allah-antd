---
nav:
  title: 工具
  order: 3
toc: content
group:
  title: 工具
  order: 3
demo:
  cols: 2
---

# 基础样式

> 本质上就是一个一个的对象，使用对象合并，覆盖，可以组合码使用

使用示例

单个样式

```
<div style={ahWL.ah_r_jz}>
  <Progress type="circle" percent={pollingProgress.progress} />
</div>
```

多个样式组合

```
<div style={{ ...ahWL.ah_r_jz, ...ahWL.ah_cz }}>
  <Progress type="circle" percent={pollingProgress.progress} />
</div>
```

也可以使用className来操作

```
<div className={styles.ah_r_jz}>
  <Progress type="circle" percent={pollingProgress.progress} />
</div>
```
