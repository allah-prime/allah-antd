import { Button, Col, Form, Row, Skeleton, Space } from 'antd';
import React from 'react';
import TitleInput from './TitleInput';

export type IFormContentProps = {
  /**
   * 左侧内容区域渲染
   */
  leftContentRender?: React.ReactNode | React.ReactNode[];
  leftContentRenderFun?: () => React.ReactNode | React.ReactNode[];
  /**
   * 快捷按钮
   */
  linkButtonRender?: React.ReactNode | React.ReactNode[];
  linkButtonRenderFun?: () => React.ReactNode | React.ReactNode[];
  /**
   * 头部的渲染
   */
  headerRender?: React.ReactNode | React.ReactNode[];
  headerRenderFun?: () => React.ReactNode | React.ReactNode[];
  /**
   * 右侧的渲染
   */
  rightRender?: React.ReactNode | React.ReactNode[];
  rightRenderFun?: () => React.ReactNode | React.ReactNode[];
  /**
   * 底部渲染
   */
  footerRender?: React.ReactNode | React.ReactNode[];
  /**
   * 标题渲染
   */
  titleRender?: React.ReactNode | React.ReactNode[];
  onOk?: () => void;
  //title禁用
  onCancel?: () => void;
  /**
   * 提交时间的loading，如果有的话，取消按钮会被禁用
   */
  loading?: boolean;
  /**
   * 是否显示关闭按钮，默认显示
   */
  closable?: boolean;
  /**
   * 标题的表单名字
   */
  titleName?: string;
  /**
   * 标题是否必填
   */
  titleRequired?: boolean;
  titlePlaceholder?: string;
  disabled?: boolean;
  /**
   * 加载数据的loading
   */
  reqLoading?: boolean;
  /**
   * 弹窗的高度
   */
  height?: number | string;
  /**
   * 节点的id
   */
  domId?: string;
};

const FormContent: React.FC<IFormContentProps> = ({
  linkButtonRender,
  linkButtonRenderFun,
  headerRender,
  headerRenderFun,
  rightRender,
  rightRenderFun,
  leftContentRender,
  leftContentRenderFun,
  footerRender,
  onCancel,
  onOk,
  loading,
  titleRender,
  titleName,
  titlePlaceholder = '请输入标题',
  titleRequired = true,
  reqLoading,
  height,
  domId
}) => {
  const contentHeight = height || '100%';

  const footerDom = () => {
    if (footerRender) {
      return footerRender;
    }
    return (
      <Space>
        <Button loading={loading} type="primary" onClick={onOk}>
          确认
        </Button>
        <Button disabled={loading} onClick={onCancel}>
          取消
        </Button>
      </Space>
    );
  };

  return (
    <Row style={{ height: contentHeight, minHeight: 0, overflow: 'hidden' }} id={domId}>
      <Col span={16} className="theling-form-modal-content">
        <div className="theling-form-modal-header">
          <div>{headerRender || headerRenderFun?.()}</div>
          <div>
            <Skeleton
              loading={reqLoading}
              paragraph={{
                rows: 2
              }}
            >
              {titleRender || (
                <Form.Item
                  name={titleName || 'title'}
                  className="theling-form-modal-title-item"
                  rules={[{ required: titleRequired, message: '标题不能为空!' }]}
                >
                  <TitleInput placeholder={titlePlaceholder} />
                </Form.Item>
              )}
              {linkButtonRender ? (
                <div className="theling-form-modal-toolbar">{linkButtonRender}</div>
              ) : null}
              {linkButtonRenderFun?.() ? (
                <div className="theling-form-modal-toolbar">{linkButtonRenderFun()}</div>
              ) : null}
            </Skeleton>
          </div>
        </div>
        <div className="theling-form-modal-left-main">
          <div className="theling-form-modal-left-content">
            <Skeleton
              paragraph={{
                rows: 6
              }}
              loading={reqLoading}
            >
              {leftContentRender || leftContentRenderFun?.()}
            </Skeleton>
            <Skeleton loading={reqLoading} />
            <Skeleton loading={reqLoading} />
            <Skeleton loading={reqLoading} />
          </div>
        </div>
        <div className="theling-form-modal-left-footer">{footerDom()}</div>
      </Col>
      <Col span={8} className="theling-form-modal-select" style={{ height: contentHeight, minHeight: 0 }}>
        <Skeleton
          paragraph={{
            rows: 20
          }}
          loading={reqLoading}
        >
          {rightRender || rightRenderFun?.()}
        </Skeleton>
      </Col>
    </Row>
  );
};

export default FormContent;
