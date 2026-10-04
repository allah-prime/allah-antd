import { useState } from 'react';
import GridCards from '..';
import { Button, Radio, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { IOptions7 } from '@allahjs/utils';

export default () => {
  const [items, setItems] = useState<IOptions7<string>[]>([
    { value: '1', label: '选项1', description: '描述文本1' },
    { value: '2', label: '选项2', description: '描述文本2' },
    { value: '3', label: '选项3', description: '描述文本3' },
    { value: '4', label: '选项4', description: '描述文本4' }
  ]);

  const [columns, setColumns] = useState(2);

  const handleAdd = () => {
    const newId = String(items.length + 1);
    setItems([
      ...items,
      {
        value: `new-${newId}`,
        label: `新选项${newId}`,
        description: `新的描述文本${newId}`
      }
    ]);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} orientation="vertical">
        <Space>
          <span>列数：</span>
          <Radio.Group value={columns} onChange={e => setColumns(e.target.value)}>
            <Radio.Button value={2}>2列</Radio.Button>
            <Radio.Button value={3}>3列</Radio.Button>
            <Radio.Button value={4}>4列</Radio.Button>
          </Radio.Group>
        </Space>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加选项
        </Button>
      </Space>
      <GridCards
        value={items}
        onChange={newItems => setItems(newItems)}
        columns={columns}
        gap={12}
        title={`${columns}列布局示例`}
        tips="可以通过调整列数来改变布局"
      />
    </div>
  );
};
