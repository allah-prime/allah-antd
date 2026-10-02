import React, { ReactNode } from 'react';
import { Timeline, Tag, Typography, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export type ActionStatus = 'success' | 'processing' | 'fail' | 'info' | 'warning';

export interface ActionLogDetail {
  id: number | string;
  content: string;
  status: ActionStatus;
  remark?: string;
  timestamp: string;
  extra?: ReactNode;
}

export interface ActionLog {
  id: number | string;
  operator: string;
  action: string;
  status: ActionStatus;
  remark?: string;
  timestamp: string;
  details?: ActionLogDetail[];
  extra?: ReactNode;
}

export interface ActionTimelineProps {
  data: ActionLog[];
  mode?: 'left' | 'alternate' | 'right' | 'start' | 'end';
  hideMainLine?: boolean;
  renderOperator?: (log: ActionLog) => ReactNode;
  renderAction?: (log: ActionLog) => ReactNode;
  renderDetails?: (details: ActionLogDetail[]) => ReactNode;
  style?: React.CSSProperties;
}

const getStatusTag = (status: ActionStatus) => {
  const statusMap = {
    success: { color: 'green', text: '成功' },
    processing: { color: 'blue', text: '进行中' },
    fail: { color: 'red', text: '失败' },
    warning: { color: 'orange', text: '警告' },
    info: { color: 'gray', text: '信息' }
  };
  const { color, text } = statusMap[status] || statusMap.info;
  return <Tag color={color}>{text}</Tag>;
};

const ActionTimeline: React.FC<ActionTimelineProps> = ({
  data,
  mode = 'left',
  hideMainLine = false,
  renderOperator,
  renderAction,
  renderDetails,
  style
}) => {
  const getTimelineItemColor = (status: ActionStatus) => {
    const colorMap = {
      success: 'green',
      processing: 'blue',
      fail: 'red',
      warning: 'orange',
      info: 'gray'
    };
    return colorMap[status] || 'gray';
  };

  return (
    <div style={{ padding: '16px', ...style }}>
      {hideMainLine && (
        <style>
          {`
          .ant-timeline .ant-timeline-item-tail {
            width: 0 !important;
            border-left: none !important;
            background: transparent !important;
          }
        `}
        </style>
      )}
      <Timeline
        mode={mode === 'left' ? 'start' : mode === 'right' ? 'end' : mode}
        items={data.map((log) => ({
          key: log.id,
          color: getTimelineItemColor(log.status),
          style: { paddingBottom: 24 },
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* 操作人和操作 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {renderOperator ? (
                  renderOperator(log)
                ) : (
                  <Text strong style={{ fontSize: 15 }}>
                    {log.operator}
                  </Text>
                )}

                {renderAction ? (
                  renderAction(log)
                ) : (
                  <Space>
                    <span style={{ color: '#222', fontSize: 15 }}>{log.action}</span>
                    {getStatusTag(log.status)}
                  </Space>
                )}
              </div>

              {/* 备注 */}
              {log.remark && <div style={{ color: '#888', fontSize: 13 }}>备注：{log.remark}</div>}

              {/* 时间 */}
              <div style={{ color: '#aaa', fontSize: 13 }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {log.timestamp}
              </div>

              {/* 额外内容 */}
              {log.extra}

              {/* 详细信息 */}
              {log.details &&
                log.details.length > 0 &&
                (renderDetails ? (
                  renderDetails(log.details)
                ) : (
                  <div
                    style={{
                      marginTop: 8,
                      marginLeft: 8,
                      borderLeft: '2px solid #e6e6e6',
                      paddingLeft: 12
                    }}
                  >
                    {log.details.map((detail) => (
                      <div key={detail.id} style={{ marginBottom: 6 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}
                        >
                          <span style={{ color: '#555', fontSize: 14 }}>{detail.content}</span>
                          {getStatusTag(detail.status)}
                          <span style={{ color: '#aaa', fontSize: 12 }}>
                            <ClockCircleOutlined style={{ marginRight: 2 }} />
                            {detail.timestamp}
                          </span>
                        </div>
                        {detail.remark && (
                          <div
                            style={{
                              color: '#bbb',
                              fontSize: 12,
                              marginLeft: 2
                            }}
                          >
                            备注：{detail.remark}
                          </div>
                        )}
                        {detail.extra}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )
        }))}
      />
    </div>
  );
};

export default ActionTimeline;
