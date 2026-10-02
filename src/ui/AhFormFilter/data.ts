import { zlrequest } from '../../theling-utils';
import { ProFormColumnsType } from '@ant-design/pro-components';

export const defFormData = [
  {
    aliasLabel: null,
    attLabel: '属性1',
    attType: 'select',
    attTypeText: '下拉框',
    filedName: null,
    defaultValue: null,
    options: null,
    description: '111',
    weight: null,
    id: '27',
    attScene: '1',
    dicGroupMap: null
  },
  {
    aliasLabel: null,
    attLabel: '属性2',
    attType: 'checkbox',
    attTypeText: '多选框',
    filedName: null,
    defaultValue: null,
    options: {
      eum: {
        '1': '111',
        '2': '222'
      },
      value: [
        {
          label: '111',
          value: '1'
        },
        {
          label: '222',
          value: '2'
        }
      ]
    },
    description: null,
    weight: null,
    id: '28',
    attScene: '1',
    dicGroupMap: null
  },
  {
    aliasLabel: null,
    attLabel: '2222',
    attType: 'select',
    attTypeText: '下拉框',
    filedName: null,
    defaultValue: null,
    options: {
      eum: [
        '外资',
        '内资',
        '个体',
        '农专',
        '港澳个体',
        '台湾个体',
        '个体互联网',
        '外国企业常驻代表机构'
      ],
      value: [
        {
          checked: false,
          label: '1',
          value: '外资'
        },
        {
          checked: false,
          label: '2',
          value: '内资'
        },
        {
          checked: false,
          label: '3',
          value: '个体'
        },
        {
          checked: false,
          label: '4',
          value: '农专'
        },
        {
          checked: false,
          label: '5',
          value: '港澳个体'
        },
        {
          checked: false,
          label: '6',
          value: '台湾个体'
        },
        {
          checked: false,
          label: '7',
          value: '个体互联网'
        },
        {
          checked: false,
          label: '8',
          value: '外国企业常驻代表机构'
        }
      ]
    },
    description: null,
    weight: null,
    id: '31',
    attScene: '1',
    dicGroupMap: 'entType'
  },
  {
    aliasLabel: null,
    attLabel: '日期',
    attType: 'date',
    attTypeText: '日期',
    filedName: null,
    defaultValue: null,
    options: null,
    description: null,
    weight: null,
    id: '32',
    attScene: '1',
    dicGroupMap: null
  }
];

const asyncTreeData = (adminCode: string = '000000') =>
  zlrequest('http://theling.top:9002/opera-service/district/api/cross/asyncAntTree', {
    params: {
      adminCode
    },
    method: 'get'
  });

const valueEnum = {
  all: { text: '全部', status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error'
  },
  closed: {
    text: '已解决',
    status: 'Success',
    disabled: true
  },
  processing: {
    text: '解决中',
    status: 'Processing'
  }
};

export const domColumns: ProFormColumnsType<any, 'adminCode'>[] = [
  {
    title: '标题阿萨德撒大撒打算多所大所',
    dataIndex: 'title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项'
        }
      ]
    },
    width: 'm'
  },
  {
    title: '状态3331',
    dataIndex: 'state1222',
    valueType: 'cascader',
    request: async () => [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'hangzhou',
            label: '杭州',
            children: [
              {
                value: 'xihu',
                label: '西湖'
              }
            ]
          }
        ]
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men'
              }
            ]
          }
        ]
      }
    ],
    width: 'm'
  },
  {
    title: '状态1',
    dataIndex: 'state1',
    valueType: 'adminCode',
    request: asyncTreeData,
    width: 'm',
    fieldProps: {
      label: '地区'
    }
  },
  {
    title: '状态2',
    dataIndex: 'state2',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态3',
    dataIndex: 'state3',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态4',
    dataIndex: 'state4',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态5',
    dataIndex: 'state5',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态6',
    dataIndex: 'state6',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态7',
    dataIndex: 'state7',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态8',
    dataIndex: 'state8',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态9',
    dataIndex: 'state9',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态11',
    dataIndex: 'state11',
    valueType: 'select',
    valueEnum,
    width: 'm'
  },
  {
    title: '状态12',
    dataIndex: 'state12',
    valueType: 'select',
    valueEnum,
    width: 'm'
  }
];
