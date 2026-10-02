import type {
  IAntTreeNode,
  IBaseFilter,
  IOptions6,
  ITablePage
} from '../../theling-utils/@types/IZlData';
import type { ISysDisFilter, ISysDistrict } from '../../theling-utils/@types/ISystem';
import React from 'react';

export type IAreaTableProps = {
  /**
   * 左侧的地区树接口，如果不传，就使用配置里面的
   * @param v 地区码
   */
  asyncTreeData?: (v?: string) => Promise<IAntTreeNode[]>;
  /**
   * 地区的分页数据，如果不传，就使用配置里面的
   * @param v
   */
  selectTableData?: (v?: ISysDisFilter) => Promise<ITablePage<ISysDistrict>>;
  /**
   * 全选接口，如果不传，就使用配置里面的
   * @param v
   */
  selectAllData?: (v?: ISysDisFilter) => Promise<ISysDistrict[]>;
  /**
   * 地区类型的配置
   */
  disTypeOptReq?: () => Promise<IOptions6<string>[]>;
  /**
   * 禁用地区接口
   */
  disabledAdminCodes?: string[];
  /**
   * 默认值
   */
  value?: string[];
  /**
   * 值数组
   */
  valueList?: ISysDistrict[];
  /**
   * 修改的时候触发
   * @param v
   */
  onChange?: (v: string[]) => void;
  onItemListChange?: (keys: string[], v: ISysDistrict[]) => void;
  /**
   * 表格的高度，同时也可以控制弹窗的高度，默认500
   */
  scrollY?: number;
  /**
   * 默认的地区码
   */
  defAdminCode?: string;
  children?: React.ReactNode;
  /**
   * 是否开启地区互斥
   */
  mutex?: boolean;
  /**
   * 是否显示地区选择器
   */
  showAreaSelector?: boolean;
  /**
   * 默认pcode
   */
  defPcode?: string;
  /**
   * 是否为单选模式
   */
  single?: boolean;
};

export interface ISysDisFilter extends IBaseFilter {
  pcode?: string;
  /**
   * 地区类型
   */
  depType?: string;
  /**
   * 其他属性
   */
  otherProperty?: string;
  /**
   * 搜索方式
   */
  searchType?: 'all' | '';
  /**
   * 地区编码
   */
  adminCode?: string;
  adminCodes?: string[];
  /**
   * 层级
   */
  disType?: string;
}
