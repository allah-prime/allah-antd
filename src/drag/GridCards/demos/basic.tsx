import { useState } from 'react';
import GridCards from '..';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { IOptions7 } from '@allahjs/utils';

export default () => {
  const [items, setItems] = useState<IOptions7<string>[]>([
    { value: '1', label: '选项1', description: '描述文本1' },
    { value: '2', label: '选项2', description: '描述文本2' },
    { value: '3', label: '选项3', description: '描述文本3' },
    { value: '4', label: '选项4', description: '描述文本4' },
    { value: '5', label: '选项5', description: '描述文本5' },
    { value: '6', label: '选项6', description: '描述文本6' },
    { value: '7', label: '选项7', description: '描述文本7' },
    { value: '8', label: '选项8', description: '描述文本8' },
    { value: '9', label: '选项9', description: '描述文本9' }
  ]);

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
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加选项
        </Button>
      </Space>
      <GridCards
        value={items}
        onChange={newItems => setItems(newItems)}
        title="基础九宫格"
        tips="拖拽调整顺序，点击右上角删除按钮可删除选项"
      />
    </div>
  );
};
