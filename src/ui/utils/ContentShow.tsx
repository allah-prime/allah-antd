import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useInViewport } from 'ahooks';
import React, { useState } from 'react';

export type IContentShowProps = {
  /**
   * 如果是详情页面，就传true
   */
  showButton: boolean;
  /**
   * don的id
   */
  domId: string;
  /**
   * 表单的dom
   */
  formDom: React.ReactNode;
  /**
   * 详情的dom
   */
  detailsDom: React.ReactNode;
  /**
   * 是否限制阅读
   */
  isAstrict?: boolean;
  /**
   * 限制阅读后的弹窗
   */
  openModal?: () => void;
};

/**
 * 内容展示组件
 * @constructor
 */
const ContentShow: React.FC<IContentShowProps> = ({
  showButton = false,
  domId = 'LeftContent',
  formDom,
  detailsDom,
  isAstrict = false,
  openModal
}) => {
  // 如果是详情页，就显示不活跃的状态，所以要取反
  const [active, setActive] = useState<boolean | undefined>(undefined);
  // 判断分组是否都完全显示出来了
  const [, ratio = 0] = useInViewport(() => document.getElementById(`${domId}Form`), {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    root: () => document.getElementById(domId)
  });
  const canShowIcon = () => {
    if (active !== undefined) {
      return true;
    }
    // 当ratio != 0，并且是不是编辑时候，说明显示了
    if (ratio < 1 && showButton) {
      return true;
    }
    return false;
  };

  const divHeight = () => {
    // 如果是详情页面，并且，没有点击icon就返回200出去
    if (showButton && !active) {
      return 200;
    }
    // 如果是详情页面，并且点击了icon，就返回高度
    if (showButton && active) {
      return 'auto';
    }
    return 'auto';
  };

  return (
    <>
      <div
        style={{
          height: divHeight(),
          overflow: 'hidden'
        }}
        id={domId}
      >
        <div id={`${domId}Form`}>{showButton ? detailsDom : formDom}</div>
      </div>
      {showButton && (
        <div
          style={{
            color: '#1890FF',
            display: canShowIcon() ? 'block' : 'none'
          }}
        >
          <div
            onClick={() => {
              if (isAstrict) {
                openModal?.();
              } else {
                setActive(!active);
              }
            }}
            style={{
              borderRadius: '14px',
              marginLeft: '40%',
              cursor: 'pointer',
              alignItems: 'center',
              lineHeight: '28px',
              width: '94px',
              height: '28px',
              fontSize: '13px',
              boxShadow: '0 3px 8px rgba(0,0,0,.05), 0 1px 4px rgba(0,0,0,.05)',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
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
    </>
  );
};

export default ContentShow;
