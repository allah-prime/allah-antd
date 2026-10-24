import React from 'react';
import './MobileShell.less';

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  domId?: string;
}

/**
 * 移动端外壳组件
 * 模拟手机外观，提供移动端预览效果
 */
const MobileShell: React.FC<MobileShellProps> = ({
  children,
  title = 'Demo',
  domId = 'mobile-shell'
}) => {
  return (
    <div className="mobile-shell">
      <div className="mobile-shell-device" id={domId}>
        {/* 手机顶部刘海 */}
        <div className="mobile-shell-notch" />
        {/* 状态栏 */}
        <div className="mobile-shell-status-bar">
          <div className="mobile-shell-status-left">
            <span className="mobile-shell-time">9:41</span>
          </div>
          <div className="mobile-shell-status-right">
            <div className="mobile-shell-signal" />
            <div className="mobile-shell-wifi" />
            <div className="mobile-shell-battery">
              <div className="mobile-shell-battery-level" />
            </div>
          </div>
        </div>
        {/* 导航栏 */}
        <div className="mobile-shell-nav-bar">
          <div className="mobile-shell-nav-back">‹</div>
          <div className="mobile-shell-nav-title">{title}</div>
          <div className="mobile-shell-nav-more">⋯</div>
        </div>
        {/* 内容区域 */}
        <div className="mobile-shell-content">{children}</div>
        {/* 底部指示器 */}
        <div className="mobile-shell-home-indicator" />
      </div>
    </div>
  );
};

export default MobileShell;
