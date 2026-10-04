import { OrderedListOutlined } from '@ant-design/icons';
import type { IOptions7 } from '@allahjs/utils';
import { useInViewport } from 'ahooks';
import { Divider, Dropdown, Modal, Popover, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import ListSearch from '../../ListGroup/ListSearch';
import './index.less';
import { ITagSwitchProps } from '../../interface/tag';

const groupId = '';

const Index: React.FC<ITagSwitchProps> = ({
  options = [],
  onValueChange,
  groupListReq,
  groupChangeReq,
  leftTitle,
  leftKey = 'start'
}) => {
  const [groupModal, setGroupModal] = useState(false);
  const [currentKey, setCurrentKey] = useState<string>(groupId);
  const [groupList, setGroupList] = useState<IOptions7<string>[]>(options);

  const initData = () => {
    if (groupListReq) {
      groupListReq().then(res => {
        setGroupList(res);
      });
    }
  };

  useEffect(() => {
    initData();
  }, []);

  // 判断分组是否都完全显示出来了
  const [, ratio = 0] = useInViewport(() => document.getElementById('jyfw_group_list'), {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    root: () => document.getElementById('jyfw_group_list_div')
  });

  const onChange = (key: string) => {
    setCurrentKey(key);
    onValueChange?.(key);
  };

  return (
    <>
      <div style={{ padding: 12, background: '#fff', marginBottom: 12 }}>
        <div className="theling_antd_TagGroup_TagManage_filterBox">
          {leftTitle && (
            <>
              <div
                className={classNames(
                  'theling_antd_TagGroup_TagManage_textDiv',
                  currentKey === leftKey && 'theling_antd_TagGroup_TagManage_active'
                )}
                onClick={() => {
                  onChange(leftKey);
                }}
              >
                {leftTitle}
              </div>
              <Divider orientation="vertical" />
            </>
          )}

          <div
            style={{ display: 'flex', maxWidth: '50vw', overflow: 'hidden' }}
            id="jyfw_group_list_div"
          >
            <div style={{ display: 'flex' }}>
              <div
                className={classNames(
                  'theling_antd_TagGroup_TagManage_textDiv',
                  currentKey === '' && 'theling_antd_TagGroup_TagManage_active'
                )}
                key=""
                onClick={() => onChange('')}
              >
                全部
              </div>
              {groupList.map((item, index) => (
                <div
                  id={index === groupList.length - 1 ? 'jyfw_group_list' : ''}
                  className={classNames(
                    'theling_antd_TagGroup_TagManage_textDiv',
                    currentKey === item.value && 'theling_antd_TagGroup_TagManage_active'
                  )}
                  key={item.value}
                  onClick={() => onChange(item.value)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          {ratio < 1 && (
            <Popover
              content={
                <div style={{ width: 300 }}>
                  <ListSearch
                    value={[currentKey]}
                    options={groupList}
                    onChange={v1 => onChange(v1[0])}
                    type="radio"
                  />
                </div>
              }
              trigger="click"
              placement="bottom"
            >
              <Tooltip title="全部分组">
                <OrderedListOutlined className="theling_antd_TagGroup_TagManage_textDiv" />
              </Tooltip>
            </Popover>
          )}
          <div style={{ display: 'flex' }} className="theling_antd_TagGroup_TagManage_textDiv">
            <Dropdown
              menu={{
                onClick: e => {
                  if (e.key === 'groupManage') {
                    setGroupModal(true);
                  }
                },
                items: [
                  {
                    label: '分组管理',
                    key: 'groupManage'
                  }
                ]
              }}
            >
              <div>更多</div>
            </Dropdown>
          </div>
        </div>
        <Modal
          closable={false}
          open={groupModal}
          onCancel={() => {
            setGroupModal(false);
          }}
          footer={null}
        >
        </Modal>
      </div>
    </>
  );
};

export default Index;
