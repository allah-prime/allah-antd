import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

const ExplainTips: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Tooltip title={content}>
      <QuestionCircleOutlined style={{ margin: '0 4px' }} />
    </Tooltip>
  );
};

export default ExplainTips;
