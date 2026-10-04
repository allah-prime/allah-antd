import type { IOptions7 } from '@allahjs/utils';
import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { ITagListProps } from '../interface/tag';

/**
 * 标签数组
 */
const TagList: React.FC<ITagListProps> = ({ value = [], onChange }) => {
  const [itemList, setItemList] = useState<IOptions7<string>[]>(value);

  const handleClose = (index1: number) => {
    itemList.splice(index1, 1);
    setItemList([...itemList]);
    onChange?.([...itemList]);
  };

  const valueStr = value.join(';');

  useEffect(() => {
    setItemList(value);
  }, [valueStr]);

  return (
    <div>
      {itemList.length === 0 && '暂无数据'}
      {itemList.map((item, index) => (
        <Tag
          key={item.value}
          closable
          onClose={e => {
            e.preventDefault();
            handleClose(index);
          }}
          style={{ margin: 3 }}
        >
          {item.label}
        </Tag>
      ))}
    </div>
  );
};

export default TagList;
