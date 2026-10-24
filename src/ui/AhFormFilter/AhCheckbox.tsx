import type { IOptions7 } from '@allahjs/utils';
import { Checkbox, Tooltip } from 'antd';
import React from 'react';

type IProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: IOptions7<any>[];
};

const AhCheckbox: React.FC<IProps> = ({ value = [], onChange, options = [] }) => {
  return (
    <div>
      {options.map(item => (
        <Checkbox
          key={item.value}
          checked={value.includes(item.value)}
          onChange={e => {
            if (e.target.checked) {
              onChange?.([...value, item.value]);
            } else {
              onChange?.(value.filter(v => v !== item.value));
            }
          }}
        >
          <Tooltip title={item.description}>{item.label}</Tooltip>
        </Checkbox>
      ))}
    </div>
  );
};

export default AhCheckbox;
