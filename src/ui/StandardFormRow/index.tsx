import classNames from 'classnames';
import React from 'react';
import './index.less';
interface IProps {
  /**
   * 前面的标题
   */
  title?: string;
  /**
   * 是否是最后一个，如果是最后一个，就不显示那个虚线了
   */
  last?: boolean;
  /**
   * 块
   */
  block?: boolean;
  /**
   * 网格
   */
  grid?: boolean;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const StandardFormRow: React.FC<IProps> = ({ title, children, last, block, grid, ...rest }) => {
  const cls = classNames('theling_standardFormRow', {
    ['theling_standardFormRowBlock']: block,
    ['theling_standardFormRowLast']: last,
    ['theling_standardFormRowGrid']: grid
  });

  return (
    <div className={cls} {...rest}>
      {title && (
        <div className="theling_label">
          <span>{title}</span>
        </div>
      )}
      <div className="theling_content">{children}</div>
    </div>
  );
};

export default StandardFormRow;
