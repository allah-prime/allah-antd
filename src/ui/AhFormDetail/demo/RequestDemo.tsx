import React from 'react';
import AhFormDetail from '../index';
import { dataRequest, columnsReq } from './requestDemo';
import { StringUtils } from '../../../theling-utils';

/**
 * 异步请求数据示例
 */
const RequestDemo: React.FC = () => {
  return (
    <AhFormDetail
      formGroupReq={columnsReq}
      request={() => dataRequest().then(res => StringUtils.replaceEmpty(res, '-'))}
    />
  );
};

export default RequestDemo;
