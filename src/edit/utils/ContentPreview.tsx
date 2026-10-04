import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import './ContentPreview.less';

export type IContentPreviewProps = {
  /**
   * 内容
   */
  content: string | React.ReactNode;
  /**
   * 唯一的id
   */
  id: string;
  /**
   * 展开收起按钮的点击事件
   */
  activeClick?: () => void;
  /**
   * 是否显示展开收起按钮
   */
  showButton?: boolean;
  /**
   * 额外的样式
   */
  style?: React.CSSProperties;
  /**
   * 类名
   */
  className?: string;
  /**
   * 如果是富文本的话，需要进行数据的处理
   */
  handleContent?: (content: string) => Promise<string>;
  /**
   * 内容的高度
   */
  height?: number;
  /**
   * 文字样式模式 - 国务院，自定义，块编辑器
   */
  textMode?: 'gov' | 'custom';
  /**
   * 内容的格式，是md还是html
   */
  contentType?: 'md' | 'html' | 'json';
  /**
   * 这个字体会影响到行高的
   * @default 12pt
   */
  divFontSize?: string;
  /**
   * link的点击事件
   */
  linkClick?: (params: string) => void;
};

// 配置margin
export const marginStyles = `
  margin: 12px 0;
  line-height: 1.2;
`;

const commonStyles = `
  font-family: 宋体;
  font-size: 12pt;
  margin-top: 2px;
  margin-bottom: 2px;
  text-indent: 2em;
  word-wrap: break-word;
`;

// $$的样式 - 小三加粗居中
export const h3Styles = `
  font-family: 宋体;
  font-size: 16pt;
  font-weight: bold;
  text-align: center;
  text-indent: 0em;
  margin: 0;
`;

// $标题的样式
export const titleStyles = `
  font-family: 宋体;
  font-size: 24pt;
  font-weight: bold;
  text-align: center;
  text-indent: 0em;
  margin: 0;
  justify-content: center;
  align-items: center;
  display: flex;
`;

// 文号的样式 楷体 小四 居中，段前1.5行，段后1.5行，单倍行距1
export const wenHaoStyles = `
  font-family: 楷体;
  font-size: 12pt;
  text-align: center;
  text-indent: 0em;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
`;

// 尾部样式 右对齐后方加四个字符，无段前段后，单倍行距1
export const tailStyles = `
  text-align: right;
  margin: 0;
`;

// # 标题的样式
const title1Styles = `
  font-family: 宋体;
  font-size: 12pt;
  font-weight: bold;
  text-indent: 2em;
  margin-top: 2px;
  margin-bottom: 2px;
`;

// ## 标题的样式
const title2Styles = `
  font-family: 楷体;
  font-size: 12pt;
  text-indent: 2em;
  margin-top: 2px;
  margin-bottom: 2px;
  line-height: 1.8em;
`;

// ### 标题的样式
const title3Styles = `
  font-family: 宋体;
  margin-top: 2px;
  margin-bottom: 2px;
  text-align: center;
  text-indent: 0em;
  font-size: 1.125em;
  font-weight: 600;
`;

function processMarkdownLinks(markdownText: string): string {
  // Regular expression to match link syntax in Markdown
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  // Replace link syntax with HTML anchor tags
  return markdownText.replace(linkRegex, '<a href="$2">$1</a>');
}

export const customMdRenderer = (mdContent: string, textMode: 'gov' | 'custom') => {
  if (!mdContent) {
    return '';
  }
  const lines = mdContent.split('\n');
  const htmlLines = [];
  for (const line of lines) {
    if (line.trim() === '') {
      // 说明是空换行
      htmlLines.push('<br>');
      continue;
    }
    let htmlLine = '';
    if (line.startsWith('***')) {
      htmlLine = '<hr>';
    } else if (line.includes('***')) {
      htmlLine = line.replace(
        /\*\*\*(.*?)\*\*\*/g,
        '<span style="font-weight: bold; font-style: italic">$1</span>'
      );
    } else if (line.includes('**')) {
      htmlLine = line.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold">$1</span>');
    } else if (line.startsWith('$$ ')) {
      htmlLine = `<div style="${h3Styles}">${line.substring(3)}</div>`;
    } else if (line.startsWith('$ ')) {
      htmlLine = `<div style="${titleStyles}">${line.substring(2)}</div>`;
    } else if (line.startsWith('!! ')) {
      htmlLine = `<div style="${h3Styles}">${line.substring(3)}</div>`;
    } else if (line.startsWith('! ')) {
      htmlLine = `<div style="${titleStyles}">${line.substring(2)}</div>`;
    } else if (line.startsWith('~~ ')) {
      // 文号处理
      htmlLine = `<div style="${wenHaoStyles}">${line.substring(3)}</div>`;
    } else if (line.startsWith('##### ')) {
      htmlLine = `<h3 style="${title3Styles} font-family: 楷体;">${line.substring(4)}</h3>`;
    } else if (line.startsWith('#### ')) {
      htmlLine = `<h3 style="${title3Styles} font-family: 楷体;">${line.substring(4)}</h3>`;
    } else if (line.startsWith('### ')) {
      htmlLine = `<h3 style="${title3Styles} font-family: 楷体;">${line.substring(4)}</h3>`;
    } else if (line.startsWith('## ')) {
      htmlLine = `<h2 style="${title2Styles} font-family: 楷体; ${textMode === 'custom' ? 'text-indent: 0em;' : ''}">${line.substring(3)}</h2>`;
    } else if (line.startsWith('# ')) {
      htmlLine = `<h1 style="${title1Styles} ${textMode === 'custom' ? 'text-indent: 0em;' : ''}">${line.substring(2)}</h1>`;
      // 结尾的处理
    } else if (line.startsWith('---')) {
      htmlLine = `<p style="${tailStyles}">${line.substring(3)}</p>`;
    } else {
      htmlLine = `<p style="${commonStyles} ${textMode === 'custom' ? 'text-indent: 0em;' : ''}">${line}</p>`;
    }
    htmlLines.push(htmlLine);
  }
  const newMdContent = htmlLines.join('\n');
  return processMarkdownLinks(newMdContent);
};

/**
 * 文本预览组件 - 有展开和收起功能
 */
const ContentPreview: React.FC<IContentPreviewProps> = ({
  id,
  content,
  activeClick,
  showButton = true,
  style,
  className,
  handleContent,
  height = 200,
  textMode = 'custom',
  contentType = 'html'
}) => {
  // 富文本内容
  const [nowContent, setNowContent] = useState<string>();
  // block的内容
  const [blockContent, setBlockContent] = useState<React.ReactNode>();

  const [active, setActive] = useState<boolean>(false);
  // 是否显示展开收起按钮
  const [showIcon, setShowIcon] = useState<boolean>(false);

  const divId = `${id}_ContentPreview`;
  // 父级div的id
  const parentDivId = `${id}_content_preview_parent`;

  const buttonClick = () => {
    setActive(!active);
    const dom = document.getElementById(parentDivId);
    // 如果是张开描述，那么就设置div的高度为auto
    if (dom) {
      if (!active) {
        dom.style.height = 'auto';
        // 删除maxHeight
        dom.style.maxHeight = '';
      } else {
        // 如果是收起描述，那么就设置div的高度为200px
        dom.style.maxHeight = `${height}px`;
      }
      activeClick?.();
    }
  };

  // 判断是否需要显示展开收起按钮
  const canShowIcon = () => {
    // 获取id为divId的div实际高度
    const divHeight = document.getElementById(divId)?.clientHeight;
    // 如果高度大于200，就显示展开收起按钮
    if (divHeight && divHeight > height) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  };

  // 处理内容的方法
  const handleContent2 = async (v: string) => {
    if (handleContent) {
      const newContent = await handleContent(v);
      setNowContent(newContent);
    } else if (contentType === 'md') {
      const content1 = customMdRenderer(v, textMode);
      setNowContent(content1);
    } else {
      setNowContent(v);
    }
  };

  useEffect(() => {
    if (contentType !== 'json' && typeof content === 'string') {
      handleContent2(content);
    } else if (typeof content === 'object') {
      setBlockContent(content);
    }
  }, [content]);

  useEffect(() => {
    canShowIcon();
  }, [nowContent]);

  const maxHeight = showButton ? height - 12 : 'auto';

  const contentClass =
    textMode === 'gov' ? 'ah_content_preview_content_gov' : 'ah_content_preview_content';

  const domRender = () => {
    if (contentType === 'json') {
      return (
        <div className={contentClass} id={divId}>
          {blockContent}
        </div>
      );
    }
    return (
      <div
        className={contentClass}
        id={divId}
        dangerouslySetInnerHTML={{
          __html: nowContent || '-'
        }}
      />
    );
  };

  return (
    <div style={style} className={className}>
      <div
        id={parentDivId}
        style={{
          maxHeight,
          overflow: 'hidden'
        }}
      >
        {domRender()}
      </div>
      {showButton && (
        <div
          className={
            active ? 'ah_content_preview_button_parent2' : 'ah_content_preview_button_parent1'
          }
          style={{ color: '#1890FF', display: showIcon ? 'block' : 'none' }}
        >
          <div onClick={buttonClick} className="ah_content_preview_button">
            {active ? (
              <>
                <UpOutlined style={{ marginRight: '10px' }} />
                收起描述
              </>
            ) : (
              <>
                <DownOutlined style={{ marginRight: '10px' }} />
                展开描述
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPreview;
