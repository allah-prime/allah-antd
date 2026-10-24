在一组标签里切换当前项，适合作为表单里的标签开关。

### 标注的自定义表单配置

```jsx
import React from 'react';
import {Space} from 'antd';
import TagSwitch from './index';

const defValue = [
  {
    "checked": false,
    "description": null,
    "disabled": false,
    "label": "时间11211321",
    "value": "8b6540002eb395427f20431490ae03ec"
  },
  {
    "checked": false,
    "description": null,
    "disabled": false,
    "label": "阿萨大大是",
    "value": "69335f02e5595ed867180fb1f3414619"
  },
  {
    "checked": false,
    "description": null,
    "disabled": false,
    "label": "啊撒大苏打倒萨大大",
    "value": "b341d067d051b47704279a76e0fa54a9"
  },
];

export default () => {

  const [optList, setOptList] = React.useState(defValue);

  const groupChangeReq = (type, item) => {
    console.log(type, item);
    return Promise.resolve();
  }

  const onValueChange = (value) => {
    console.log(value);
  }

  const groupListReq = () => {
    optList.push({
      "checked": false,
      "description": null,
      "disabled": false,
      "label": new Date().getTime(),
      "value": new Date().getTime(),
    });
    return Promise.resolve(optList);
  }
    
  return (
    <>
      <h2>有数据</h2>
      <TagSwitch groupChangeReq={groupChangeReq} onValueChange={onValueChange} groupListReq={groupListReq}/>
    </>
  )
}
```

### 标注的自定义表单配置

```jsx
import React from 'react';
import {Space} from 'antd';
import TagSwitch from './index';

const defValue = [];

export default () => {

  const [optList, setOptList] = React.useState(defValue);

  const groupChangeReq = (type, item) => {
    console.log(type, item);
    return Promise.resolve();
  }

  const onValueChange = (value) => {
    console.log(value);
  }

  const groupListReq = () => {
    optList.push({
      "checked": false,
      "description": null,
      "disabled": false,
      "label": new Date().getTime(),
      "value": new Date().getTime(),
    });
    return Promise.resolve(optList);
  }
    
  return (
    <>
      <h2>有数据2</h2>
      <TagSwitch leftTitle="我的收藏" groupChangeReq={groupChangeReq} onValueChange={onValueChange} groupListReq={groupListReq}/>
    </>
  )
}
```

<API src="./index.tsx"></API>
