---
toc: content
group:
  title: 展示
  order: 0
demo:
  cols: 2
---

# 拖拽排序组件

```jsx
import React from "react";
import { Space } from "antd";
import { SnippetsTwoTone } from "@ant-design/icons";
import { TableDropdown } from "@ant-design/pro-components";
import ItemBar from "./index";
import DragItemBar from "./index";
const { data } = require("./data.ts");

export default () => {
  const renderDom = (item) => {
    return <div style={{padding:10}}>{item.label}</div>;
  };
  const onChange = (items) => {
    console.log(111, items);
  };
  return (
    <>
      <DragItemBar
        value={data}
        renderItem={renderDom}
        rowKey={"value"}
        onChange={onChange}
      />
    </>
  );
};
```
