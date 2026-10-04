import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import './index.less';

import { ITagItem } from '../../interface/tag';

interface IProps {
  /**
   * 新增一个标签，如果调用了接口，就会先调用接口，然后再调用这个方法
   * @param v
   */
  addNewTag: (v: ITagItem) => void;
  /**
   * 点击返回按钮
   */
  onBack: () => void;
  /**
   * 添加新的标签数据，添加完成后，需要返回标签的id
   * @param v
   */
  addTagRequest?: (v: ITagItem) => Promise<string>;
  /**
   * 是否选择标签颜色
   */
  isTagColor?: boolean;
}

export const colorList = [
  '#c6c8cc',
  '#5a606b',
  '#5fd9c6',
  '#7ad94e',
  '#d98657',
  '#ffce40',
  '#ff8c40',
  '#ff5757',
  '#fe6fd4',
  '#ab6bff',
  '#4dbafd',
  '#3e70f8'
];

/**
 * 新增标签
 */
const AddTag: React.FC<IProps> = ({ addNewTag, onBack, addTagRequest, isTagColor = true }) => {
  const [color, setColor] = useState<string>();
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const addTag = async () => {
    if (!addTagRequest) {
      return;
    }
    if (isTagColor && !color) {
      message.warning('请选择标签颜色');
      return;
    }
    setLoading(true);
    const newTags: ITagItem = {
      color,
      label: value // ****** 删除了 !
    } as ITagItem;
    try {
      newTags.value = await addTagRequest(newTags);
      addNewTag(newTags);
      setLoading(false);
      setValue('');
      setColor('');
      onBack();
    } catch (error: any) {
      setLoading(false);
      message.error(error.msg);
    }
  };

  /*
   * 1. 给btn加一个ref，在添加标签时清空数据、颜色
   * 2. 同时回到选项卡
   *  */
  return (
    <div className="theling_tag_options_add_mode">
      <div className="theling_tag_options_add_mode_title">
        <ArrowLeftOutlined style={{ float: 'left' }} onClick={onBack} />
        <span className="theling_tag_options_add_mode_title_text">创建标签</span>
      </div>
      <div className="theling_tag_options_add_mode_tips">
        <span>标签名称</span>
      </div>
      <div>
        <Input
          disabled={loading}
          onChange={v => setValue(v.target.value)}
          value={value}
          variant="borderless"
          placeholder="请输入标签名称"
        />
      </div>
      {isTagColor && (
        <>
          <div className="theling_tag_options_add_mode_tips">
            <span>标签颜色</span>
          </div>
          <div className="theling_tag_options_add_mode_radio">
            {colorList.map(item => (
              <div
                key={item}
                className="theling_tag_options_add_mode_radio_item"
                onClick={() => !loading && setColor(item)}
              >
                <div
                  className="theling_tag_options_add_mode_radio_item_color"
                  style={{ background: `${item}` }}
                >
                  {color === item && (
                    <CheckOutlined
                      className="theling_tag_options_add_mode_radio_item_color_icon"
                      style={{ color: '#fff' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ padding: 6 }}>
        <Button
          onClick={addTag}
          disabled={!value || value.length === 0 || !addTagRequest}
          type="primary"
          block
          loading={loading}
        >
          创建标签
        </Button>
      </div>
    </div>
  );
};

export default AddTag;
