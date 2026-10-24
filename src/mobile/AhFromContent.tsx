import React, { useMemo } from 'react';
import { IAhFormItemProps } from '@allahjs/utils';

/**
 * 选择器显示的内容
 */
const AhFromContent: React.FC<{
  setVisible?: (v: boolean) => void;
  layout?: IAhFormItemProps['layout'];
  rightDom?: IAhFormItemProps['rightDom'];
  showValue?: boolean;
  valueRender: React.ReactNode | string;
  placeholder?: string;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 详情模式
   */
  details?: boolean;
  /**
   * 点击事件
   */
  onPress?: () => void;
  /**
   * 监听变化的字符串
   */
  diffStr?: string;
}> = ({
  setVisible,
  layout = 'horizontal',
  rightDom,
  showValue,
  valueRender,
  placeholder = '请选择',
  disabled,
  details,
  onPress,
  diffStr
}) => {
  console.log('layout', layout);

  const valueStr = useMemo(() => {
    if (details && !valueRender) {
      return '未选择';
    }
    return valueRender;
  }, [details, valueRender, diffStr, showValue]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1
        }}
        onClick={() => {
          if (onPress && !disabled) {
            onPress();
          } else if (!disabled) {
            setVisible?.(true);
          }
        }}
      >
        <div
          style={{
            color: showValue ? '#333' : '#999',
            fontSize: 'var(--font-size)',
            flex: 1
          }}
        >
          {showValue ? valueStr : placeholder}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {rightDom && <div style={{ marginRight: '8px' }}>{rightDom}</div>}
          {!details && (
            <div
              style={{
                width: '6px',
                height: '6px',
                borderTop: '2px solid #999',
                borderRight: '2px solid #999',
                transform: 'rotate(45deg)',
                marginLeft: '4px'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AhFromContent;
