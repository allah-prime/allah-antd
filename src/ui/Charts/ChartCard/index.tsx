import { Card } from 'antd';
import type { CardProps } from 'antd/es/card';
import classNames from 'classnames';
import React from 'react';

// @ts-ignore
import './index.less';

type totalType = () => React.ReactNode;

const renderTotal = (total?: number | totalType | React.ReactNode) => {
  if (!total && total !== 0) {
    return null;
  }
  let totalDom;
  switch (typeof total) {
    case 'undefined':
      totalDom = null;
      break;
    case 'function':
      totalDom = <div className="chartCardTotal">{total()}</div>;
      break;
    default:
      totalDom = <div className="chartCardTotal">{total}</div>;
  }
  return totalDom;
};

export interface ChartCardProps extends CardProps {
  title: React.ReactNode;
  action?: React.ReactNode;
  total?: React.ReactNode | number | (() => React.ReactNode | number);
  footer?: React.ReactNode;
  contentHeight?: number;
  avatar?: React.ReactNode;
  style?: React.CSSProperties;
}

class ChartCard extends React.Component<ChartCardProps> {
  renderContent = () => {
    const { contentHeight, title, avatar, action, total, footer, children, loading } = this.props;
    if (loading) {
      return false;
    }
    return (
      <div className="chartCard">
        <div className={classNames('chartTop')}>
          <div className="chartCardAvatar">{avatar}</div>
          <div className="chartCardMetaWrap">
            <div className="chartCardMeta">
              <span className="title">{title}</span>
              <span className="chartCardAction">{action}</span>
            </div>
            {renderTotal(total)}
          </div>
        </div>
        {children && (
          <div className="chartCardContent" style={{ height: contentHeight || 'auto' }}>
            <div className={contentHeight ? 'chartCardContentFixed' : ''}>{children}</div>
          </div>
        )}
        {footer && <div className={classNames('chartCardFooter')}>{footer}</div>}
      </div>
    );
  };

  render() {
    const {
      loading = false,
      contentHeight,
      title,
      avatar,
      action,
      total,
      footer,
      children,
      ...rest
    } = this.props;
    return (
      <Card loading={loading} styles={{ body: { padding: '20px 24px 8px 24px' } }} {...rest}>
        {this.renderContent()}
      </Card>
    );
  }
}

export default ChartCard;
