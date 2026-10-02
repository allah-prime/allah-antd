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

# 工具组件集合

### initialAhState.ts

这个用在antd初始化的时候。

示例代码：

```
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<IInitialAhState> {
  return initialAhState({
    queryCurrent: UserService.queryCurrent,
    defaultSettings,
    isHash: ZL_PROFILES === 'ylb',
  });
}
```

### SearchContent

搜索内容组件，里面是用来进行搜索布局的，一共有两栏。

```jsx
import React from 'react';
import SearchContent from './SearchContent';

export default () => (
  <div>
    <SearchContent searchForm={<div>我的表单</div>} filterDom={<div>我是筛选组件</div>}/>
  </div>
)
```

### SearchDiv

就是在写表单的时候，套在SearchContent外面的壳子

### SortIcon

排序图标

```jsx
import React from 'react';
import {Select} from "antd";
import SortIcon from './SortIcon';
import SearchContent from './SearchContent';

const {Option} = Select;

export default () => (
  <div>
    <SearchContent searchForm={<div>asdad</div>} filterDom={
      <>
        <Select
          variant="borderless"
          style={{width: 160}}
        >
          <Option value="tag_name">按标签名称首字母排序</Option>
          <Option value="update_time">按导入时间排序</Option>
        </Select>
        <SortIcon/>
      </>
    }/>
  </div>
)
```

### 头像组件

头像组件

```jsx
import React from 'react';
import {Select} from "antd";
import SortIcon from './SortIcon';
import AhAvatar from './AhAvatar';

const {Option} = Select;

const currentUser = {
  headImgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  userName: '张三',
}

export default () => (
  <div>
    <AhAvatar
      avatar={true}
      name={currentUser.userName}
      headImgUrl={currentUser.headImgUrl}
      suffixText={currentUser.userName}
    />
  </div>
)
```
头像组件 - 带鼠标悬浮效果

```jsx
import React from 'react';
import {Select} from "antd";
import SortIcon from './SortIcon';
import AhAvatar from './AhAvatar';

const {Option} = Select;

const currentUser = {
  headImgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  userName: '张三',
}

export default () => (
  <div style={{height: 46}}>
    <AhAvatar
      name={currentUser.userName}
      headImgUrl={currentUser.headImgUrl}
      suffixText={currentUser.userName}
      hover
      maxWidth={200}
    />
  </div>
)
```

## SoleButton按钮

```jsx
import React from 'react';
import SoleButton from './SoleButton';

export default () => (
  <div>
    <SoleButton onClick={() => {
      console.log('点击了')
    }}>点击</SoleButton>
  </div>
)
```

## IconText图标文字

```jsx
import React from 'react';
import { LikeOutlined } from '@ant-design/icons';
import IconText from '../IconSelect/IconText';

export default () => (
  <div>
    <IconText icon={<LikeOutlined />} text="查看"/>
  </div>
)
```


## ContentPreview内容预览

```jsx
import React from 'react';
import ContentPreview from './ContentPreview';

const text = `臣密言：臣以险衅，夙遭闵凶。生孩六月，慈父见背；行年四岁，舅夺母志。祖母刘愍臣孤弱，躬亲抚养。臣少多疾病，九岁不行，零丁孤苦，至于成立。既无伯叔，终鲜兄弟，门衰祚薄，晚有儿息。外无期功强近之亲，内无应门五尺之僮，茕茕孑立，形影相吊。而刘夙婴疾病，常在床蓐，臣侍汤药，未曾废离。(愍 一作：悯；孑立 一作：独立)

　　逮奉圣朝，沐浴清化。前太守臣逵察臣孝廉；后刺史臣荣举臣秀才。臣以供养无主，辞不赴命。诏书特下，拜臣郎中，寻蒙国恩，除臣洗马。猥以微贱，当侍东宫，非臣陨首所能上报。臣具以表闻，辞不就职。诏书切峻，责臣逋慢；郡县逼迫，催臣上道；州司临门，急于星火。臣欲奉诏奔驰，则刘病日笃，欲苟顺私情，则告诉不许：臣之进退，实为狼狈。

　　伏惟圣朝以孝治天下，凡在故老，犹蒙矜育，况臣孤苦，特为尤甚。且臣少仕伪朝，历职郎署，本图宦达，不矜名节。今臣亡国贱俘，至微至陋，过蒙拔擢，宠命优渥，岂敢盘桓，有所希冀。但以刘日薄西山，气息奄奄，人命危浅，朝不虑夕。臣无祖母，无以至今日，祖母无臣，无以终余年。母、孙二人，更相为命，是以区区不能废远。

　　臣密今年四十有四，祖母今年九十有六，是臣尽节于陛下之日长，报养刘之日短也。乌鸟私情，愿乞终养。臣之辛苦，非独蜀之人士及二州牧伯所见明知，皇天后土实所共鉴。愿陛下矜愍愚诚，听臣微志，庶刘侥幸，保卒余年。臣生当陨首，死当结草。臣不胜犬马怖惧之情，谨拜表以闻。(祖母刘 一作：祖母；矜愍 一作：矜悯)`

export default () => (
  <div>
    <ContentPreview id="sadad" content={text} />
    <ContentPreview id="sadad2" content={text} textMode="gov" />
  </div>
)
```


