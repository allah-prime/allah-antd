---
title: InfoLog 信息日志
toc: content
group:
  title: 数据展示
  order: 2
demo:
  cols: 2
---

# InfoLog 信息日志

```jsx
import React from 'react';
import InfoLog from './index';

const data = [
  {
    id: '1',
    userName: "我是鲶鱼",
    title: "我是鲶鱼",
    creTime: "2022年9月11日21:44:59",
    content: [{
      id: '1',
      content: '我是【鲶鱼1】',
    }, {
      id: '2',
      content: '我是【鲶鱼2】',
    }, {
      id: '3',
      content: '我是【鲶鱼3】',
    }],
  },
  {
    id: '2',
    userName: "我是鲶鱼",
    title: "我是鲶鱼",
    creTime: "2022年9月11日21:44:59",
    content: [{
      id: '1',
      content: '我是【鲶鱼1】',
    }, {
      id: '2',
      content: '我是【鲶鱼2】',
    }, {
      id: '3',
      content: '我是【鲶鱼3】',
    }],
  },
  {
    id: '3',
    avatar: "xxxxx",
    title: "我是鲶鱼",
    creTime: "2022年9月11日21:44:59",
    content: [{
      id: '1',
      content: '我是【鲶鱼1】',
    }, {
      id: '2',
      content: '我是【鲶鱼2】',
    }, {
      id: '3',
      content: '我是【鲶鱼3】',
    }],
  }
]

export default () => (
  
  <InfoLog data={data}/>
)
```
