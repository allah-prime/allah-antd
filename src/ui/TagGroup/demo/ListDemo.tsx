import React, { useEffect } from 'react';
import { IOptions7 } from '../../../theling-utils/@types/IZlData';
import { Button, Row, Table, Tag } from 'antd';
import { zlrequest } from '../../../theling-utils';

const buttonList = [
  {
    label: '基础信息',
    value: '1'
  },
  {
    label: '角色权限',
    value: '2'
  },
  {
    label: '兴趣标签',
    value: '3'
  }
];

const ListDemo = () => {
  const [tagList, setTagList] = React.useState<IOptions7<string>[]>([]);

  // 当前点击的按钮
  const [currentButton, setCurrentButton] = React.useState<string>('基础信息');

  const initData = () => {
    zlrequest(
      'https://api.jyfwyun.com/ent-basic-data-service/api/assistPolicyLaw/cross/policyList',
      {
        params: {
          pageNum: 2,
          pageSize: 10,
          policyClassifies: ['1731965894508761090'],
          filed: 'contentAndName',
          enable: '1',
          sort: {
            publish_time: false
          },
          noDefaultAc: '1',
          showHistory: true
        },
        manner: 'json'
      }
    ).then(res => {
      console.log(res);
      setTagList(res.records);
    });
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <div>
      <Row>
        {tagList.map(item => (
          <Tag key={item.label}>{(item as any).policyName}</Tag>
        ))}
      </Row>
      <Row>
        {currentButton}
        {buttonList.map(item => (
          <Button
            key={item.value}
            onClick={() => {
              setCurrentButton(item.label);
            }}
            style={{
              backgroundColor: currentButton === item.label ? '#1890ff' : '#fff'
            }}
          >
            {item.label}
          </Button>
        ))}
        <div
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'red',
            display: currentButton === '基础信息' ? 'block' : 'none'
          }}
        >
          <Tag>asdada</Tag>
        </div>
        <div
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'blue',
            display: currentButton === '角色权限' ? 'block' : 'none'
          }}
        >
          <Button>asdadsa</Button>
        </div>
        <div
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'yellow',
            display: currentButton === '兴趣标签' ? 'block' : 'none'
          }}
        >
          <Table></Table>
        </div>
      </Row>
    </div>
  );
};

export default ListDemo;
