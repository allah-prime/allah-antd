import { PlusOutlined } from '@ant-design/icons';
import { arrayUtils, diffUtils } from '@allahjs/utils';
import type { ISysDistrict } from '@allahjs/utils';
import type { ModalProps } from 'antd';
import { Popover, Tag } from 'antd';
import React, { useEffect } from 'react';
import AhAntdConfig from '../utils/AhAntdConfig';
import AhModal, { IAhModalProps } from '../AhModal';
import AreaTable, { AreaRenderItems } from './index';
import type { IAreaTableProps } from './interface';

export type IAreaTableModalProps = IAreaTableProps & {
  selectDefList?: (v: string) => Promise<ISysDistrict[]>;
  modalProps?: ModalProps & IAhModalProps;
  disabled?: boolean;
  /**
   * 外壳样式
   */
  divStyle?: React.CSSProperties;
  /**
   * 默认地区码
   */
  defAdminCode?: string;
  /**
   * 是否为单选模式
   */
  single?: boolean;
  /**
   * 修改的时候把diff对象抛出去
   */
  onChangeDiffObj?: (diffObj: any) => void;
  /**
   * 修改的时候把源数据也抛出去
   */
  onChangeSource?: (oldList: ISysDistrict[], newList: ISysDistrict[]) => void;
};

const AreaTableModal: React.FC<IAreaTableModalProps> = props => {
  const [visible, setVisible] = React.useState(false);
  const [itemList, setItemList] = React.useState<ISysDistrict[]>([]);
  const [defLoading, setDefLoading] = React.useState(false);

  const valueStr = props.value?.join(';');

  useEffect(() => {
    const selectDefList = props.selectDefList || AhAntdConfig.getAreaReq().selectDefList;
    if (props.value?.length === 0) {
      setItemList([]);
    }

    // 需要加载数据的情况：
    // 1. value 发生变化
    // 2. itemList 为空但 value 不为空
    if (valueStr) {
      setDefLoading(true);
      // 默认值发生变化的时候，需要调用接口去执行查询
      selectDefList!(valueStr).then((res: any) => {
        setItemList(res);
        setDefLoading(false);
      });
    }
  }, [valueStr, props.value]);

  const onItemListChange = (keys: string[], v: ISysDistrict[]) => {
    props?.onChangeSource?.(itemList, v);
    const appendAdminCodeListOld = itemList.map(item => item.adminCode);
    const appendAdminCodeListNew = v.map(item => item.adminCode);
    const appendAdminCodeTextOld = itemList.map(item => item.disName);
    const appendAdminCodeTextNew = v.map(item => item.disName);
    if (props.single) {
      // 单选模式下，直接使用最新选择的项
      const newItem = v[v.length - 1];
      if (newItem) {
        setItemList([newItem]);
        props.onChange?.([newItem.adminCode]);
      } else {
        setItemList([]);
        props.onChange?.([]);
      }
    } else {
      const appendAdminCodeList = diffUtils.buildDiffArray(
        appendAdminCodeListOld,
        appendAdminCodeListNew
      );
      const appendAdminCodeText = diffUtils.buildDiffArray(
        appendAdminCodeTextOld,
        appendAdminCodeTextNew
      );
      //合并itemList和v
      const newItemList = [...itemList, ...v];
      // 根据adminCode进行去重，并且只保留keys中包含的项
      const newItemList2 = arrayUtils.uniqueBy(
        newItemList.filter(item => keys.includes(item.adminCode)),
        'adminCode'
      );
      setItemList(newItemList2);
      props.onChange?.(keys);
      props.onChangeDiffObj?.({ appendAdminCodeList, appendAdminCodeText });
    }
  };

  const modalProps = props.modalProps || {};

  return (
    <div style={props.divStyle}>
      <AhModal
        open={visible}
        width={900}
        bodyStyle={{ padding: 8 }}
        footer={null}
        onCancel={() => setVisible(false)}
        {...modalProps}
      >
        <AreaTable onItemListChange={onItemListChange} {...props} valueList={itemList} />
      </AhModal>
      {defLoading ? (
        <>加载中...</>
      ) : (
        <div>
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
              适用区域
            </Tag>
          )}
          <Popover
            content={<AreaRenderItems data={itemList} />}
            title="已选区域"
            trigger="hover"
            styles={{ container: { padding: 0 } }}
          >
            <Tag style={{ marginLeft: 2 }}>
              已选
              {itemList.length}
              个区域
            </Tag>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default AreaTableModal;
