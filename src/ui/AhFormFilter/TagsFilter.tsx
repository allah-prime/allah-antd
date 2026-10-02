import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import type { IOptions7 } from '../../theling-utils/@types/IZlData';
import { Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const { CheckableTag } = Tag;

/**
 * 标签的选择数据
 */
export declare type ITagOptDto = IOptions7<string> & {
  color?: string;
};

export type ITagsFilterProps = {
  // 标签数据
  tagOptsData: ITagOptDto[] | undefined;
  // 选中的标签数据
  selectTagOptsData: (v: string[]) => void;
  // 是否支持展开收起
  foldable?: boolean;
  // 标题（为false或null时不显示）
  title?: string | null | false;
  // 默认值
  value?: string[];
  //箭头和展开收起字符颜色
  titleColor?: string;
};

// 特性标签选择&展开折叠组件
const TagsFilter = ({
  titleColor = '#999999',
  tagOptsData,
  selectTagOptsData,
  foldable,
  title = '特性标签：',
  value = []
}: ITagsFilterProps) => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>(value);
  const [isUnfold, setIsUnfold] = useState(false);
  // 是否显示展开按钮
  const [isShowOpen, setIsShowOpen] = useState(false);
  const tagHandleChange = (tag: string, checked: boolean) => {
    const tags: string[] = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    setSelectedTags(tags);
    selectTagOptsData(tags);
  };
  const componentRef = useRef<HTMLDivElement>(null);

  // 监听窗口变化
  const resize = () => {
    if (componentRef.current) {
      setIsShowOpen(componentRef.current.scrollHeight > 34);
    }
  };

  useEffect(() => {
    resize();
  }, [tagOptsData?.length]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  // 展开收起组件
  const IsOpenClose = () => {
    return (
      <div
        style={{
          display: foldable ? 'block' : 'none',
          width: 60
        }}
        onClick={() => {
          setIsUnfold(!isUnfold);
        }}
      >
        {isUnfold ? (
          <div style={{ color: titleColor }}>
            收起 <CaretUpOutlined style={{ marginTop: 4 }} />
          </div>
        ) : (
          <div style={{ color: titleColor }}>
            展开 <CaretDownOutlined style={{ marginTop: 4 }} />
          </div>
        )}
      </div>
    );
  };
  return (
    <div
      className="ahWL_ah_sb"
      style={{
        lineHeight: '34px',
        width: '100%'
      }}
    >
      <div
        style={{
          width: '100%',
          minHeight: 34,
          height: foldable ? (isUnfold ? 'auto' : '34px') : 'auto',
          overflow: foldable && !isUnfold ? 'hidden' : 'visible',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          wordBreak: 'break-all',
          gap: '4px 8px'
        }}
        ref={componentRef}
      >
        {typeof title === 'string' && title && (
          <span style={{ minWidth: 72, color: titleColor }}>{title}</span>
        )}
        {(tagOptsData || []).length > 0 ? (
          <>
            {tagOptsData?.map(item => {
              return (
                <CheckableTag
                  key={item.value}
                  style={
                    selectedTags.indexOf(item.value) > -1
                      ? {
                          color: 'white',
                          backgroundColor: item.color,
                          fontSize: 14
                        }
                      : { color: item.color, fontSize: 14 }
                  }
                  checked={selectedTags.indexOf(item.value) > -1}
                  onChange={checked => tagHandleChange(item.value, checked)}
                >
                  {item.label}
                </CheckableTag>
              );
            })}
          </>
        ) : (
          <span style={{ color: '#999' }}>当前用户组下无已定义的特性标签</span>
        )}
      </div>
      {isShowOpen && <IsOpenClose />}
    </div>
  );
};

export default TagsFilter;
