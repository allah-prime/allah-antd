import { PlusOutlined } from '@ant-design/icons';
import { viewportToPixels } from '../../theling-utils';
import type { IAntTreeNode } from '../../theling-utils/@types/IZlData';
import { Button, Col, Row, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import useCustomFormItem from '../hooks/useCustomFormItem';
import { modelSize } from '../utils/AhReactUtils';
import '../AhFormModal/index.less';
import AhModal from '../AhModal';
import AsyncTreePlus, { defTextRender } from './AsyncTreePlus';
import type { IAsyncTreeModalProps, IAsyncTreePlusFun } from './interface';

/**
 * 异步树弹窗，分为树和标签选择两部分
 * @constructor
 */
const AsyncTreeModal: React.FC<IAsyncTreeModalProps> = (props) => {
  const { size = 'middle', modalProps = {} } = props;
  const [visible, setVisible] = useState(false);

  const treeRef = React.useRef<IAsyncTreePlusFun>(undefined);

  const onChange = (v: string[]) => {
    props.onChange?.(v);
  };

  const { setItems, items } = useCustomFormItem({
    value: props.value,
    defValReq: props.initDataReq
  });

  const onClose = (item: IAntTreeNode) => {
    // 调用树的ref来删除数据
    console.log('调用树的ref来删除数据');
    treeRef.current?.deleteByValue(item);
  };

  const renderTag = () => {
    return (
      <>
        {items.map((item, index) =>
          item.disabled ? (
            <Tooltip title={props.disabledTips}>
              <Tag color="processing" style={{ margin: '2px' }} key={item.key}>
                {defTextRender(item)}
              </Tag>
            </Tooltip>
          ) : (
            <Tag style={{ margin: '2px' }} key={item.key} closable onClose={() => onClose(item)}>
              {defTextRender(item)}
            </Tag>
          )
        )}
      </>
    );
  };

  const sizeConfig = modelSize(size);

  // vh转成px
  const height = viewportToPixels(sizeConfig.height as string) - 100;

  return (
    <div style={props.style}>
      <AhModal
        {...sizeConfig}
        onCancel={() => setVisible(false)}
        open={visible}
        width={680}
        bodyStyle={{ padding: 24 }}
        footer={[
          <Button key={1} onClick={() => setVisible(false)}>
            完成选择
          </Button>
        ]}
        forceRender
        {...modalProps}
      >
        {props.title && (
          <Row>
            <h4>{props.title}</h4>
          </Row>
        )}
        <Row gutter={8}>
          <Col span={12}>
            <div
              style={{
                height,
                overflowY: 'auto'
              }}
            >
              <AsyncTreePlus
                {...props}
                onChange={onChange}
                onItemChange={setItems}
                treeRef={treeRef}
              />
            </div>
          </Col>
          <Col span={12}>{renderTag()}</Col>
        </Row>
      </AhModal>
      {!props.disabled && (
        <Tag
          onClick={() => setVisible(true)}
          style={{
            background: '#fff',
            borderStyle: 'dashed',
            margin: '2px',
            cursor: 'pointer'
          }}
        >
          <PlusOutlined />
          {props.addText || '新增'}
        </Tag>
      )}
      {renderTag()}
    </div>
  );
};

export default AsyncTreeModal;
