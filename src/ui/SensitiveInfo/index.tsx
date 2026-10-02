import React, { useState, useMemo } from 'react';
import { Button, message, Tooltip } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, CopyOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './index.less';

export type SensitiveType = 'phone' | 'email' | 'idCard' | 'bankCard' | 'general' | 'custom';

export interface SensitiveInfoProps {
  /**
   * 敏感信息内容
   */
  value: string;
  /**
   * 敏感信息类型
   * @default 'custom'
   */
  type?: SensitiveType;
  /**
   * 脱敏字符
   * @default '*'
   */
  maskChar?: string;
  /**
   * 自定义脱敏规则（仅在type为custom时生效）
   * 格式：[保留前几位, 保留后几位]
   * @default [3, 4]
   */
  customRule?: [number, number];
  /**
   * 是否显示切换按钮
   * @default true
   */
  showToggle?: boolean;
  /**
   * 是否显示复制按钮
   * @default true
   */
  showCopy?: boolean;
  /**
   * 默认是否显示敏感信息
   * @default false
   */
  defaultVisible?: boolean;
  /**
   * 受控模式下的显示状态
   */
  visible?: boolean;
  /**
   * 显示状态变化回调
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * 复制成功回调
   */
  onCopy?: (value: string) => void;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 提示文本配置
   */
  tooltips?: {
    show?: string;
    hide?: string;
    copy?: string;
  };
}

const SensitiveInfo: React.FC<SensitiveInfoProps> = ({
  value,
  type = 'custom',
  maskChar = '*',
  customRule = [3, 4],
  showToggle = true,
  showCopy = true,
  defaultVisible = false,
  visible,
  onVisibleChange,
  onCopy,
  className,
  style,
  disabled = false,
  tooltips = {}
}) => {
  const [internalVisible, setInternalVisible] = useState(defaultVisible);

  const isControlled = visible !== undefined;
  const currentVisible = isControlled ? visible : internalVisible;

  const {
    show: showTooltip = '显示',
    hide: hideTooltip = '隐藏',
    copy: copyTooltip = '复制'
  } = tooltips;

  // 脱敏处理函数
  const getMaskedValue = useMemo(() => {
    if (!value) return '';

    const maskValue = (str: string, keepStart: number, keepEnd: number) => {
      if (str.length <= keepStart + keepEnd) {
        return str;
      }
      const start = str.substring(0, keepStart);
      const end = str.substring(str.length - keepEnd);
      const middle = maskChar.repeat(str.length - keepStart - keepEnd);
      return start + middle + end;
    };

    switch (type) {
      case 'phone':
        // 手机号脱敏：保留前3位和后4位
        return maskValue(value, 3, 4);
      case 'email':
        // 邮箱脱敏：保留@前的前2位和@后的全部
        // eslint-disable-next-line no-case-declarations
        const atIndex = value.indexOf('@');
        if (atIndex > 0) {
          const username = value.substring(0, atIndex);
          const domain = value.substring(atIndex);
          if (username.length > 2) {
            const maskedUsername = username.substring(0, 2) + maskChar.repeat(username.length - 2);
            return maskedUsername + domain;
          }
        }
        return value;
      case 'idCard':
        // 身份证脱敏：保留前6位和后4位
        return maskValue(value, 6, 4);
      case 'bankCard':
        // 银行卡脱敏：保留前4位和后4位
        return maskValue(value, 4, 4);
      case 'general':
        // 通用脱敏：保留前3位和后3位
        return maskValue(value, 3, 3);
      case 'custom':
        // 自定义脱敏规则
        return maskValue(value, customRule[0], customRule[1]);
      default:
        return value;
    }
  }, [value, type, maskChar, customRule]);

  const handleToggleVisible = () => {
    if (disabled) return;

    const newVisible = !currentVisible;
    if (isControlled) {
      onVisibleChange?.(newVisible);
    } else {
      setInternalVisible(newVisible);
    }
  };

  const handleCopy = async () => {
    if (disabled) return;

    try {
      await navigator.clipboard.writeText(value);
      message.success('复制成功');
      onCopy?.(value);
    } catch (error) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success('复制成功');
        onCopy?.(value);
      } catch (fallbackError) {
        message.error('复制失败');
      }
      document.body.removeChild(textArea);
    }
  };

  const displayValue = currentVisible ? value : getMaskedValue;

  return (
    <div
      className={classNames(
        'sensitive-info',
        {
          'sensitive-info-disabled': disabled,
          'sensitive-info-visible': currentVisible
        },
        className
      )}
      style={style}
    >
      <span className="sensitive-info-content" title={currentVisible ? value : undefined}>
        {displayValue}
      </span>

      <div className="sensitive-info-actions">
        {showToggle && (
          <Tooltip title={currentVisible ? hideTooltip : showTooltip}>
            <Button
              type="text"
              size="small"
              icon={currentVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={handleToggleVisible}
              disabled={disabled}
              className="sensitive-info-toggle"
            />
          </Tooltip>
        )}

        {showCopy && (
          <Tooltip title={copyTooltip}>
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={disabled}
              className="sensitive-info-copy"
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SensitiveInfo;
