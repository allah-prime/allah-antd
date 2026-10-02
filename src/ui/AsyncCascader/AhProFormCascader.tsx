import { ProFormCascader } from '@ant-design/pro-components';
import type { IAntTreeNode } from '../../theling-utils/@types/IZlData';
import type { DefaultOptionType } from 'antd/lib/cascader';
import React, { useEffect, useState } from 'react';
import './index.less';
import { asyncLoadData } from './utils';

/**
 * 异步级联选择器，这个选择器不能指定默认值，如果要指定的话，使用弹窗选择器
 */
const AhProFormCascader: React.FC<any> = (props): React.ReactElement => {
  const [options, setOptions] = useState<IAntTreeNode[]>([]);

  const { request, ...rest } = props;

  const newReq: any = request;

  useEffect(() => {
    newReq().then((res: React.SetStateAction<IAntTreeNode[]>) => {
      setOptions(res);
    });
  }, []);

  return (
    <ProFormCascader
      {...(rest as any)}
      fieldProps={
        {
          changeOnSelect: true,
          options,
          loadData: (v2: DefaultOptionType[]) => asyncLoadData(v2, newReq, setOptions, options),
          variant: 'borderless',
          ...rest.fieldProps
        } as any
      }
    />
  );
};

export default AhProFormCascader;
