import classNames from 'classnames';
import React, { Component } from 'react';
import './index.less';

export interface FooterToolbarProps {
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

interface FooterToolbarState {
  width?: string | number;
}
export default class FooterToolbar extends Component<FooterToolbarProps, FooterToolbarState> {
  state = {
    width: undefined
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.resizeFooterToolbar();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    const sider: any = document.querySelector('.ant-layout-sider');
    if (sider === null) {
      return;
    }
    const { isMobile } = this.context as any;
    const width = isMobile ? undefined : `calc(100% - ${sider.style.width})`;
    const { width: stateWidth } = this.state;
    if (stateWidth !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { children, className, extra, ...restProps } = this.props;
    const { width } = this.state;
    return (
      <div className={classNames(className, 'theling_toolbar')} style={{ width }} {...restProps}>
        <div className="theling_left">{extra}</div>
        <div className="theling_right">{children}</div>
      </div>
    );
  }
}
