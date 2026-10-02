import React, { useEffect } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useRequest } from 'ahooks';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

/**
 * 同步的组件
 */
const AsyncIcon: React.FC<{
  req: () => Promise<void>;
  defIcon?: React.ReactNode;
  runIcon?: React.ReactNode;
  errIcon?: React.ReactNode;
  okIcon?: React.ReactNode;
  runTip?: string;
  errTip?: string;
  defTip?: string;
  okTip?: string;
  size?: SizeType;
}> = ({
  req,
  defIcon = <PlayCircleOutlined />,
  runIcon = <LoadingOutlined />,
  errIcon = (
    <CloseCircleOutlined
      style={{
        color: 'red'
      }}
    />
  ),
  okIcon = (
    <CheckCircleOutlined
      style={{
        color: 'green'
      }}
    />
  ),
  runTip = '运行中...',
  defTip = '运行',
  errTip = '运行出错',
  okTip = '运行成功',
  size = 'small'
}) => {
  const runReq = useRequest(req, {
    manual: true,
    onBefore: () => {
      setTips(runTip);
    },
    onError: () => {
      setTips(errTip);
      setIcon(errIcon);
    },
    onSuccess: () => {
      setTips(okTip);
      setIcon(okIcon);
      setTimeout(() => {
        setTips(defTip);
        setIcon(defIcon);
      }, 3000);
    }
  });

  const [tips, setTips] = React.useState(defTip);

  const [icon, setIcon] = React.useState<React.ReactNode>(defIcon);

  useEffect(() => {
    setTips(defTip);
  }, [defTip]);

  useEffect(() => {
    setTips(runTip);
  }, [runTip]);

  useEffect(() => {
    setTips(errTip);
  }, [errTip]);

  useEffect(() => {
    setTips(okTip);
  }, [okTip]);

  return (
    <Tooltip title={tips}>
      <Button
        onClick={runReq.run} // 手动触发
        size={size}
        shape="circle"
        icon={runReq.loading ? runIcon : icon}
      />
    </Tooltip>
  );
};

export default AsyncIcon;
