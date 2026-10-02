import type { IBaseFilter, IOptions7 } from '../../theling-utils/@types/IZlData';
import { Select } from 'antd';
import React, { useState } from 'react';
import SortIcon from '../utils/SortIcon';
import { defSortOpt } from './SortFilterAntd';

export type ISortFilterProps = {
  /**
   * 筛选值改变时的回调
   */
  onChange?: (value: IBaseFilter) => void;
  /**
   * 筛选值
   */
  opts: IOptions7<string>[];
  /**
   * 默认值
   */
  value?: string;
};

/**
 * 排序筛选组件
 * @param onChange 筛选值改变时的回调
 * @param opts 筛选项
 * @param value 默认值
 * @constructor
 */
const SortFilter: React.FC<ISortFilterProps> = ({ onChange, opts, value }) => {
  // 筛选条件（样式开关）
  const [asc, setAsc] = useState<boolean>(false);
  const [columnType, setColumnType] = useState<string>(value || opts[0].value);

  return (
    <div className="ahWL_ah_sb">
      <Select<string>
        value={columnType}
        variant="borderless"
        style={{ width: 130 }}
        onChange={v => {
          if (v === defSortOpt.value && value) {
            // 显示默认筛选
            setColumnType(defSortOpt.value);
            // 这个v是发给后台的字段
            v = value;
          } else {
            setColumnType(v);
          }
          const sort: Record<string, boolean> = {};
          if (v) {
            sort[v] = asc;
          }
          onChange?.({
            sort,
            pageNum: 1
          });
        }}
      >
        {[defSortOpt, ...opts].map(item => (
          <Select.Option key={item.value} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
      <SortIcon
        onChange={v => {
          setAsc(v);
          onChange?.({
            sort: {
              [columnType]: v
            },
            pageNum: 1
          });
        }}
      />
    </div>
  );
};

export default SortFilter;
