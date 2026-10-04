import { Tooltip } from 'antd';
import type { TooltipProps } from 'antd/es/tooltip';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import './index.less';

const isSupportLineClamp = (document.body.style as any).webkitLineClamp !== undefined;

const TooltipOverlayStyle = {
  overflowWrap: 'break-word',
  wordWrap: 'break-word'
};

export interface EllipsisProps {
  /**
   * 移动到文本展示完整内容的提示
   */
  tooltip?: boolean | TooltipProps;
  /**
   * 移动到文本展示完整内容的提示
   */
  length?: number;
  /**
   * 在按照行数截取下最大的行数，超过则截取省略
   */
  lines?: number;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 样式
   */
  className?: string;
  /**
   * 是否将全角字符的长度视为2来计算字符串长度
   */
  fullWidthRecognition?: boolean;
  /**
   * 自定义省略号
   */
  omitStr?: any;
  /**
   * 文字的后缀
   */
  suffix?: any;
  /**
   * 文字的前缀
   */
  prefix?: any;
  children?: React.ReactNode;
}

/**
 * 获取字符串完整长度
 * @param str 目标字符串
 */
export const getStrFullLength: (str: string) => number = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1;
    }
    return pre + 2;
  }, 0);

/**
 * 按照指定长度对字符串进行切割
 * @param str 目标字符串
 * @param maxLength 最大长度
 */
export const cutStrByFullLength: (str: string, maxLength: number) => string = (
  str = '',
  maxLength
) => {
  let showLength = 0;
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    }
    return pre;
  }, '');
};

/**
 * 生成小提示
 * @param tooltip 提示
 * @param overlayStyle 样式
 * @param title 标题
 * @param children 子元素
 */
const getTooltip: ({
  tooltip,
  overlayStyle,
  title,
  children
}: {
  tooltip: any;
  overlayStyle: typeof TooltipOverlayStyle;
  title: any;
  children: any;
}) => React.ReactElement = ({ tooltip, overlayStyle, title, children }) => {
  // 写死吧，大于12个字才显示这个
  if (tooltip && title?.length > 10) {
    const rootStyle = overlayStyle as React.CSSProperties;
    const tooltipProps =
      tooltip === true
        ? { styles: { root: rootStyle }, title }
        : {
            ...tooltip,
            styles: {
              ...tooltip.styles,
              root: { ...rootStyle, ...tooltip.styles?.root }
            },
            title
          };
    return (
      <Tooltip placement="topLeft" {...tooltipProps}>
        {children}
      </Tooltip>
    );
  }
  return children;
};

const EllipsisText: ({
  text,
  length,
  tooltip,
  fullWidthRecognition,
  className,
  prefix,
  suffix,
  omitStr,
  ...other
}: {
  text: any;
  length: number;
  tooltip: any;
  className?: string;
  prefix?: string;
  suffix?: string;
  fullWidthRecognition: boolean;
  omitStr?: any;
}) => React.ReactElement = ({
  text,
  length,
  tooltip,
  fullWidthRecognition,
  prefix,
  suffix,
  omitStr,
  ...other
}) => {
  if (typeof text !== 'string') {
    throw new Error('Ellipsis children must be string.');
  }
  const textLength = fullWidthRecognition ? getStrFullLength(text) : text.length;
  console.log('fullWidthRecognition', fullWidthRecognition);
  if (textLength <= length || length < 0) {
    return (
      <span {...other}>
        {prefix}
        {text}
        {omitStr}
        {suffix}
      </span>
    );
  }
  const tail = '...';
  let displayText;
  if (length - tail.length <= 0) {
    displayText = '';
  } else {
    displayText = fullWidthRecognition ? cutStrByFullLength(text, length) : text.slice(0, length);
  }

  const spanAttrs = tooltip ? {} : { ...other };
  return getTooltip({
    tooltip,
    overlayStyle: TooltipOverlayStyle,
    title: text,
    children: (
      <span {...spanAttrs}>
        {prefix}
        {displayText}
        {tail}
        {omitStr}
        {suffix}
      </span>
    )
  });
};

let node: HTMLSpanElement;

let root: HTMLDivElement;

let content: HTMLDivElement;

let shadow: HTMLDivElement;

let shadowChildren: HTMLDivElement;

let defLines: number | undefined;

const Ellipsis: React.FC<EllipsisProps> = (props) => {
  const [text, setText] = useState<string>('');
  const [targetCount, setTargetCount] = useState<number>(0);

  const bisection: (
    th: number,
    m: number,
    b: number,
    e: number,
    text2: string,
    shadowNode: any
  ) => number = (th, m, b, e, text2, shadowNode) => {
    const suffix = '...';
    let mid = m;
    let end = e;
    let begin = b;
    shadowNode.innerHTML = text2.substring(0, mid) + suffix;
    let sh = shadowNode.offsetHeight;

    if (sh <= th) {
      shadowNode.innerHTML = text2.substring(0, mid + 1) + suffix;
      sh = shadowNode.offsetHeight;
      if (sh > th || mid === begin) {
        return mid;
      }
      begin = mid;
      if (end - begin === 1) {
        mid = 1 + begin;
      } else {
        mid = Math.floor((end - begin) / 2) + begin;
      }
      return bisection(th, mid, begin, end, text2, shadowNode);
    }
    if (mid - 1 < 0) {
      return mid;
    }
    shadowNode.innerHTML = text2.substring(0, mid - 1) + suffix;
    sh = shadowNode.offsetHeight;
    if (sh <= th) {
      return mid - 1;
    }
    end = mid;
    mid = Math.floor((end - begin) / 2) + begin;
    return bisection(th, mid, begin, end, text2, shadowNode);
  };

  const computeLine = () => {
    const { lines } = props;
    if (lines && !isSupportLineClamp) {
      const text3 = shadowChildren.innerText || shadowChildren.textContent || '';
      const lineHeight = parseInt(getComputedStyle(root).lineHeight || '', 10);
      const targetHeight = lines * lineHeight;
      content.style.height = `${targetHeight}px`;
      const totalHeight = shadowChildren.offsetHeight;
      const shadowNode = shadow.firstChild;

      if (totalHeight <= targetHeight) {
        setText(text3);
        setTargetCount(text3.length);
        return;
      }

      // bisection
      const len = text3.length;
      const mid = Math.ceil(len / 2);

      const count = bisection(targetHeight, mid, 0, len, text3, shadowNode);
      setText(text3);
      setTargetCount(count);
    }
  };

  const handleRoot = (n: HTMLDivElement) => {
    root = n;
  };

  const handleContent = (n: HTMLDivElement) => {
    content = n;
  };

  const handleNode = (n: HTMLSpanElement) => {
    node = n;
  };

  const handleShadow = (n: HTMLDivElement) => {
    shadow = n;
  };

  const handleShadowChildren = (n: HTMLDivElement) => {
    shadowChildren = n;
  };

  useEffect(() => {
    if (node) {
      computeLine();
    }
  }, []);

  useEffect(() => {
    if (props.lines !== defLines) {
      defLines = props.lines;
      computeLine();
    }
  }, [props.lines]);

  const {
    children,
    lines,
    length,
    className,
    tooltip,
    fullWidthRecognition,
    omitStr,
    suffix,
    prefix,
    ...restProps
  } = props;

  const cls = classNames('theling_ellipsis', className, {
    ['theling_lines']: lines && !isSupportLineClamp,
    ['theling_lineClamp']: lines && isSupportLineClamp
  });

  if (!lines && !length) {
    return (
      <span className={cls} {...restProps}>
        {prefix}
        {children}
        {omitStr}
        {suffix}
      </span>
    );
  }

  // 如果只限制长度
  if (!lines) {
    console.log('只限制长度');
    return (
      <EllipsisText
        className={cls}
        length={length!}
        text={children || ''}
        tooltip={tooltip}
        fullWidthRecognition={fullWidthRecognition!}
        suffix={suffix}
        omitStr={omitStr}
        prefix={prefix}
        {...restProps}
      />
    );
  }

  const id = `antd-pro-ellipsis-${`${new Date().getTime()}${Math.floor(Math.random() * 100)}`}`;

  // support document.body.style.webkitLineClamp
  if (isSupportLineClamp) {
    const style = `#${id}{-webkit-line-clamp:${lines};-webkit-box-orient: vertical;}`;

    const node2 = (
      <div id={id} className={cls} {...restProps}>
        <style>{style}</style>
        {prefix}
        {children}
        {omitStr}
        {suffix}
      </div>
    );

    return getTooltip({
      tooltip,
      overlayStyle: TooltipOverlayStyle,
      title: children,
      children: node2
    });
  }

  const childNode = (
    <span ref={handleNode}>
      {prefix}
      {targetCount > 0 && text.substring(0, targetCount)}
      {targetCount > 0 && targetCount < text.length && '...'}
      {omitStr}
      {suffix}
    </span>
  );

  return (
    <div {...restProps} ref={handleRoot} className={cls}>
      <div ref={handleContent}>
        {getTooltip({
          tooltip,
          overlayStyle: TooltipOverlayStyle,
          title: text,
          children: childNode
        })}
        {prefix}
        <div className="theling_shadow" ref={handleShadowChildren}>
          {children}
        </div>
        {omitStr}
        {suffix}
        <div className="theling_shadow" ref={handleShadow}>
          <span>
            {prefix}
            {text}
            {omitStr}
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Ellipsis;
