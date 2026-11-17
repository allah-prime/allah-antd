import { Col, Row, theme } from 'antd';
import React, { type ReactNode } from 'react';
import './index.less';

export interface IAhSplitEditLayoutProps {
  header?: ReactNode;
  children?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
}

const AhSplitEditLayout = ({ header, children, sidebar, footer }: IAhSplitEditLayoutProps) => {
  const { token } = theme.useToken();

  return (
    <Row
      className="ah-split-edit-layout"
      wrap={false}
      style={{ background: token.colorBgContainer }}
    >
      <Col span={16} className="ah-split-edit-layout-main">
        {header != null && <div className="ah-split-edit-layout-header">{header}</div>}
        <div className="ah-split-edit-layout-body">{children}</div>
        {footer != null && (
          <div
            className="ah-split-edit-layout-footer"
            style={{ borderColor: token.colorBorderSecondary }}
          >
            {footer}
          </div>
        )}
      </Col>
      <Col
        span={8}
        className="ah-split-edit-layout-sidebar"
        style={{ background: token.colorBgLayout, borderColor: token.colorBorderSecondary }}
      >
        {sidebar}
      </Col>
    </Row>
  );
};

export default AhSplitEditLayout;
