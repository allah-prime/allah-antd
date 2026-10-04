import React from 'react';
import { Popup, SearchBar } from 'antd-mobile';

export interface IAhPopupProps {
  /**
   * 是否显示弹窗
   */
  visible: boolean;
  /**
   * 点击遮罩层的回调
   */
  onMaskClick?: () => void;
  /**
   * 取消按钮的回调
   */
  onCancel?: () => void;
  /**
   * 确认按钮的回调
   */
  onConfirm?: () => void;
  /**
   * 弹窗标题
   */
  title?: string;
  /**
   * 是否显示搜索栏
   */
  showSearch?: boolean;
  /**
   * 搜索框的值
   */
  searchValue?: string;
  /**
   * 搜索框变化的回调
   */
  onSearchChange?: (value: string) => void;
  /**
   * 搜索框占位符
   */
  searchPlaceholder?: string;
  /**
   * 弹窗内容
   */
  children?: React.ReactNode;
  /**
   * 弹窗Popup的body样式 - 不是实际容器样式
   */
  bodyStyle?: React.CSSProperties;
  /**
   * 内容样式
   */
  contentStyle?: React.CSSProperties;
  /**
   * 是否显示确认按钮
   */
  showConfirm?: boolean;
  /**
   * 取消按钮文本
   */
  cancelText?: string;
  /**
   * 确认按钮文本
   */
  confirmText?: string;
  /**
   * 是否强制渲染弹窗内容
   */
  forceRender?: boolean;
  /**
   * 指定挂载的 HTML 节点，默认为 body，如果为 null 的话，会渲染到当前节点
   */
  getContainer?: HTMLElement | (() => HTMLElement) | null;
}

/**
 * 通用弹窗组件，包含头部导航栏、搜索栏和内容区域
 */
const AhPopup: React.FC<IAhPopupProps> = ({
  visible,
  onMaskClick,
  onCancel,
  onConfirm,
  title = '请选择',
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = '搜索',
  children,
  bodyStyle,
  contentStyle,
  showConfirm = true,
  cancelText = '取消',
  confirmText = '确认',
  forceRender = false,
  getContainer
}) => {
  const defaultBodyStyle: React.CSSProperties = {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    padding: 0,
    ...bodyStyle
  };

  /**
   * 计算内容区域的高度
   * 如果 defaultBodyStyle 中设置了高度，则基于该高度计算
   * 否则使用默认高度
   */
  const getContentHeight = (): number | string => {
    const bodyHeight = defaultBodyStyle.height;

    if (bodyHeight) {
      // 如果 bodyStyle 中设置了高度，需要减去头部和搜索栏的高度
      const headerHeight = 44; // 头部导航栏高度
      const searchHeight = showSearch ? 49 : 0; // 搜索栏高度（包含padding和border）
      const borderHeight = showSearch ? 2 : 1; // 边框高度

      if (typeof bodyHeight === 'number') {
        return Math.max(bodyHeight - headerHeight - searchHeight - borderHeight, 100);
      } else if (typeof bodyHeight === 'string') {
        // 如果是字符串类型（如 '400px', '50vh' 等），使用 calc 计算
        return `calc(${bodyHeight} - ${headerHeight + searchHeight + borderHeight}px)`;
      }
    }

    // 默认高度
    return showSearch ? 350 : 400;
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onMaskClick}
      bodyStyle={defaultBodyStyle}
      getContainer={getContainer}
      onClick={e => e.stopPropagation()}
      forceRender={forceRender}
    >
      {/* 头部导航栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '44px',
          padding: '0 16px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fff'
        }}
      >
        {/* 左侧取消按钮 */}
        <div
          onClick={onCancel}
          style={{
            color: '#666',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {cancelText}
        </div>

        {/* 中间标题 */}
        <div
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#333'
          }}
        >
          {title}
        </div>

        {/* 右侧确认按钮 */}
        {showConfirm && (
          <div
            onClick={onConfirm}
            style={{
              color: '#dc6b08',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {confirmText}
          </div>
        )}
        {!showConfirm && <div style={{ width: '32px' }} />}
      </div>

      {/* 搜索栏 */}
      {showSearch && (
        <div
          style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}
          onClick={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => e.stopPropagation()}
        >
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            onFocus={e => e.stopPropagation()}
            onBlur={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          height: getContentHeight(),
          ...contentStyle
        }}
      >
        {children}
      </div>
    </Popup>
  );
};

export default AhPopup;
