import type { LegacyRef } from 'react';
import React from 'react';
import './utils.less';

export type ISearchDivProps = {
  searchRef?: LegacyRef<any>;
  children?: React.ReactNode;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * padding
   */
  padding?: number;
};

/**
 * 搜索用的div
 */
const SearchDiv: React.FC<ISearchDivProps> = ({ searchRef, children, style = {}, padding }) => {
  if (padding !== undefined) {
    style.padding = padding;
  }
  return (
    <div ref={searchRef} className="ah-page-header-search" style={style}>
      {children}
    </div>
  );
};

export default SearchDiv;
