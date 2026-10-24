import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import AhProTable from '../AhProTable';

const FooterDemo = () => {
  const request = (params: any) =>
    fetch('https://api.jyfwyun.com/cloud-service/cross/search', {
      method: 'POST',
      body: JSON.stringify({
        s: '1649664274429',
        searchType: 'item',
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        busiCombosObj: {},
        industryTypes: [],
        searchSchema: 'nlp',
        ac: '110000'
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then(async res => {
      const data = await res.json();
      return {
        data: data.result.data.records,
        total: data.result.data.total
      };
    });

  const columns: ProColumns[] = [
    {
      title: '条目名称',
      dataIndex: 'standardItem',
      width: '30%',
      ellipsis: true
    },
    {
      title: '短ID',
      dataIndex: 'shortId',
      width: '25%',
      ellipsis: true
    },
    {
      title: '编码',
      dataIndex: 'scopeCode',
      width: '25%',
      ellipsis: true
    },
    {
      title: '操作',
      width: '20%',
      render: () => (
        <Space>
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ height: 600 }}>
      <AhProTable
        columns={columns as any}
        params={{ pageSize: 10, pageNum: 1 }}
        request={request}
        rowKey="shortId"
        search={false}
        options={false}
        footerRender={
          <Space>
            <Button type="primary">批量导出</Button>
            <Button>批量删除</Button>
          </Space>
        }
      />
    </div>
  );
};

export default FooterDemo;
