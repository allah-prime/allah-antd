import React, { useState } from 'react';
import GridCards from '..';
import { Button, Space, Slider, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { IOptions7 } from '@allahjs/utils';

export default () => {
  const [items, setItems] = useState<IOptions7<string>[]>([
    { value: '1', label: '选项1', description: '描述文本1' },
    { value: '2', label: '选项2', description: '描述文本2' },
    { value: '3', label: '选项3', description: '描述文本3' },
    { value: '4', label: '选项4', description: '描述文本4' },
    { value: '5', label: '选项5', description: '描述文本5' },
    { value: '6', label: '选项6', description: '描述文本6' }
  ]);

  const [height, setHeight] = useState<number>(120);
  const [keepSquare, setKeepSquare] = useState<boolean>(false);

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
      <Space style={{ marginBottom: 16 }} orientation="vertical" size="large">
        <Space>
          <span>卡片高度：</span>
          <Slider
            style={{ width: 200 }}
            min={80}
            max={200}
            value={height}
            onChange={value => setHeight(value)}
          />
          <span>{height}px</span>
        </Space>

        <Space>
          <span>保持正方形：</span>
          <Switch checked={keepSquare} onChange={setKeepSquare} />
        </Space>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加选项
        </Button>
      </Space>

      <GridCards
        value={items}
        onChange={newItems => setItems(newItems)}
        columns={3}
        gap={12}
        cardHeight={height}
        keepSquare={keepSquare}
        title="自定义高度示例"
        tips="可以通过调整高度和是否保持正方形来改变卡片样式"
      />
    </div>
  );
};
