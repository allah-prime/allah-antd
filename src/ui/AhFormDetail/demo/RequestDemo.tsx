import React from 'react';
import AhFormDetail from '../index';
import { dataRequest, columnsReq } from './requestDemo';
import { stringUtils } from '@allahjs/utils';

/**
 * 异步请求数据示例
 */
const RequestDemo: React.FC = () => {
  return (
    <AhFormDetail
      formGroupReq={columnsReq}
      request={() => dataRequest().then(res => stringUtils.replaceEmpty(res, '-'))}
    />
  );
};

export default RequestDemo;
