import { AhPageContent } from '../../index';
import { ProFormSelect } from '@ant-design/pro-components';

const columns = [
  {
    title: '条目名称',
    dataIndex: 'standardItem',
    key: 'code',
    width: 120,
    ellipsis: true
  },
  {
    title: '短id',
    dataIndex: 'shortId',
    key: 'code',
    width: 120,
    ellipsis: true
  },
  {
    title: '编码',
    dataIndex: 'scopeCode',
    key: 'code',
    ellipsis: true
  }
];

const request = (params: any) => {
  return fetch('https://api.jyfwyun.com/cloud-service/cross/search', {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
    referrer: 'https://jyfwyun.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: `{"s":"1649664274429","searchType":"item","pageNum":${params.pageNum},"busiCombosObj":{},"pageSize": ${params.pageSize} ,"industryTypes":[],"searchSchema":"nlp","ac": ${params.ac}}`,
    method: 'POST',
    mode: 'cors'
  }).then(async res => {
    const data = await res.json();
    return data.result.data;
  });
};
export default () => (
  <div
    style={{
      height: 800
    }}
  >
    <AhPageContent
      searchLayout="plugin"
      defParams={{ pageSize: 10, pageNum: 1, ac: '110000' }}
      containerHeight={500}
      rowSelection={{}}
      rowKey="standardItem"
      searchForm={[
        <ProFormSelect
          key={1}
          label="地区"
          name="ac"
          options={[
            { label: '北京市', value: '110000' },
            { label: '天津市', value: '120000' },
            { label: '河北省', value: '130000' },
            { label: '山西省', value: '140000' },
            { label: '内蒙古自治区', value: '150000' },
            { label: '辽宁省', value: '210000' },
            { label: '吉林省', value: '220000' },
            { label: '黑龙江省', value: '230000' }
          ]}
        />
      ]}
      request={request}
      columns={columns}
    />
  </div>
);
