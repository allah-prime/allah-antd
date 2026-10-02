import type { ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import AhProTable from '../../AhProTable/AhProTable';
import '../../AhProTable/AhProTable.less';

const AhProTableDemo = () => {
  const request = (params: any) =>
    fetch('https://api.jyfwyun.com/cloud-service/cross/search', {
      headers: {
        accept: 'application/json',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        authorization: 'null',
        'cache-control': 'no-cache',
        'content-type': 'application/json;charset=UTF-8',
        pragma: 'no-cache',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Microsoft Edge";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site'
      },
      referrer: 'https://jyfwyun.com/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: `{"s":"1649664274429","searchType":"item","pageNum":${params.pageNum},"busiCombosObj":{},"pageSize": ${params.pageSize} ,"industryTypes":[],"searchSchema":"nlp","ac":"110000"}`,
      method: 'POST',
      mode: 'cors'
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
      key: 'code',
      width: '20%',
      ellipsis: true
    },
    {
      title: '短id',
      dataIndex: 'shortId',
      key: 'code',
      width: '20%',
      ellipsis: true
    },
    {
      title: '编码',
      dataIndex: 'scopeCode',
      key: 'code',
      width: '20%',
      ellipsis: true
    }
  ];

  return (
    <div style={{ height: 700 }}>
      <AhProTable
        columns={columns as any}
        params={{ pageSize: 10, pageNum: 1 }}
        search={false}
        options={false}
        request={request}
        rowKey="shortId"
        footerRender={<Button>nih</Button>}
        toolBarRender={() => [
          <Button key={1} type="primary">
            新增
          </Button>
        ]}
      />
    </div>
  );
};

export default AhProTableDemo;
