import { InfoCircleOutlined } from '@ant-design/icons/lib';
import { Tooltip } from 'antd';
import ChartCard from '../../ChartCard';
import Field from '../../Field';
import Trend from '../../Trend';

const trendText = {
  marginLeft: 8,
  color: 'red'
};

export default () => {
  return (
    <ChartCard
      variant="borderless"
      title="总销售额"
      action={
        <Tooltip title="指标说明">
          <InfoCircleOutlined />
        </Tooltip>
      }
      total="¥12423"
      footer={<Field label="日销售额" value="￥12423" />}
      contentHeight={46}
    >
      <Trend flag="up" style={{ marginRight: 16 }}>
        周访问量
        <span style={trendText}>12%</span>
      </Trend>
      <Trend flag="down">
        日访问量
        <span style={trendText}>11%</span>
      </Trend>
    </ChartCard>
  );
};
