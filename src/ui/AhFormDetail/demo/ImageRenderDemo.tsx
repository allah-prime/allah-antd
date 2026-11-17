import type { IFormColumns } from '@allahjs/utils';
import { Tag } from 'antd';
import React from 'react';
import { defImgUrl } from '../../AhImageRender';
import AhFormDetail from '../index';

const product = {
  id: 'goods-101',
  name: '办公椅',
  cover: 'cover.png',
  status: 1
};

const columns: IFormColumns<typeof product>[] = [
  { title: '商品名', dataIndex: 'name' },
  {
    title: '封面',
    dataIndex: 'cover',
    valueType: 'image',
    fieldProps: {
      busiScene: 'goods',
      style: { width: 80, height: 80, objectFit: 'cover' },
      getFileByRelId: async () => [
        {
          uid: 'cover',
          fileId: 'cover',
          fileName: '商品封面',
          fileSize: 0,
          oldFile: false,
          cosKey: 'cover.png',
          cosWaterKey: '',
          previewUrl: '',
          bucket: 'demo'
        }
      ],
      getSignUrlByFileId: async () => defImgUrl
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value) => (
      <Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? '上架' : '下架'}</Tag>
    )
  }
];

export default function ImageRenderDemo() {
  return <AhFormDetail dataSource={product} columns={columns} column={2} labelWidth={80} />;
}
