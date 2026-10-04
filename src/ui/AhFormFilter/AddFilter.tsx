import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import type { IOptions7 } from '@allahjs/utils';
import { Popover } from 'antd';
import { createPortal } from 'react-dom';
import { IListSearchProps, ListSearch } from '../index';
import './index.less';

type IProps = {
  id: string;
  options: IOptions7<string>[];
  onChange: IListSearchProps['onChange'];
};

const AddFilter = ({ id, options, onChange }: IProps) => {
  const dom = document.querySelector(`#${id}:last-child > :last-child`);
  if (dom) {
    return createPortal(
      (
        <div style={{ marginLeft: 12 }}>
          <ProForm.Item style={{ marginBottom: 0 }}>
            <Popover
              content={
                <div style={{ width: 300 }}>
                  <ListSearch options={options} onChange={onChange} type="checkbox" />
                </div>
              }
              trigger="click"
              placement="bottomRight"
            >
              <div className="theling-antd-AhFormFilter-AddFilter">
                <PlusOutlined style={{ fontSize: 12, color: 'inherit' }} />
                &nbsp;筛选&nbsp;
                <DownOutlined style={{ fontSize: 12, color: 'inherit' }} />
              </div>
            </Popover>
          </ProForm.Item>
        </div>
      ) as any,
      dom
    );
  }
  return <></>;
};

export default AddFilter;
