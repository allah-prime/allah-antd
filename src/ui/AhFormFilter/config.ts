import type { IDefSysDefinedAttributes } from '../../theling-utils/@types/IZlData';
import { IValueType } from '../../theling-utils';

/**
 * 基本的自定义属性对象
 */
export type IAhSysDefinedAttributes = IDefSysDefinedAttributes<IValueType>;

/**
 * 结果表，用来存资源对应属性的值
 */
export interface ISysDefinedAttributesValue {
  /**
   * 属性的主键
   */
  attId: string;

  /**
   * 属性的类型，使用对应的字典就好了
   */
  resType?: number;

  /**
   * 资源的id，通过这个id来进行查询的，这个需要建索引
   */
  resId: string;

  /**
   * 存的值，是json的，可以是各种乱七八糟的东西
   */
  resValue?: {
    value: any;
  };
}
