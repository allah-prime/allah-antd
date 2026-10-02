import { CheckOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { IOptions6 } from '../../../theling-utils/@types/IZlData';
import { Input, message } from 'antd';
import lodash from 'lodash';
import React, { useEffect, useState } from 'react';
import useCustomFormItem from '../../hooks/useCustomFormItem';
import ItemBar from '../../ItemBar';
import AddTag from './AddTag';
import './index.less';
import { ITagItem, ITagManageProps } from '../../interface/tag';

/**
 * @description：标签管理
 */
const TagManage: React.FC<ITagManageProps> = ({
  value,
  onChange,
  request,
  newTagRequest,
  defValReq,
  updateNewList,
  setLoading,
  initFinish,
  showAdd = true,
  isTagColor
}) => {
  // 这是本地选项，用来做搜索的
  const [localOptions, setLocalOptions] = useState<ITagItem[]>([]);
  // 模式。默认1，选择模式
  const [mode, setMode] = useState(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const { setItemKeys, setItems, items, itemKeys } = useCustomFormItem({
    value,
    defValReq,
    onSetValues: updateNewList,
    setLoading
  });

  const intAsyncData = () => {
    request().then(res => {
      setLocalOptions(res);
    });
  };

  useEffect(() => {
    // 告诉父级，初始化完成了
    initFinish?.();
    setTimeout(() => {
      setVisible(true);
    }, 1000);
    // 初始化默认的标签列表数据
    intAsyncData();
  }, []);

  /**
   * 调用远程数据进行搜索
   * @param keyword 关键词
   */
  const onSearch = async (keyword: string) => {
    const newOptions = await request(keyword);
    setLocalOptions(newOptions);
  };

  const onInputChange = (v: string) => {
    setInputValue(v);
    lodash.throttle(() => onSearch(v), 1500);
  };

  const addItem = (v: ITagItem) => {
    const newValue = [...items];
    // 如果存在就移除掉
    const index = itemKeys.indexOf(v.value);
    if (index > -1) {
      newValue.splice(index, 1);
      itemKeys.splice(index, 1);
    } else {
      newValue.push(v);
      itemKeys.push(v.value);
    }
    setItems(newValue);
    setItemKeys([...itemKeys]);
    updateNewList?.(newValue);
    onChange?.(itemKeys);
  };

  const addNewTag = (v: ITagItem) => {
    // 合并下，这个肯定是接口验证过了的
    setLocalOptions([...localOptions, v]);
    addItem(v);
  };
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <div
        style={{
          display: mode === 1 ? 'block' : 'none',
          width: 200,
          height: 224
        }}
      >
        <div className="theling_tag_search">
          <Input
            prefix={<SearchOutlined />}
            variant="borderless"
            value={inputValue}
            placeholder="搜索"
            onChange={e => onInputChange(e.target.value)}
            onPressEnter={() => onSearch(inputValue)}
          />
        </div>
        <div className="theling_tag_options" style={{ height: showAdd ? 154 : 180 }}>
          {localOptions?.map((item, index) => {
            return (
              <ItemBar<IOptions6<string>>
                boxShadow={index !== localOptions?.length - 1}
                clickMatter={
                  items.filter(it => it.value === item.value)[0]?.disabled
                    ? () => {
                        message.warning('不可编辑！！！');
                      }
                    : addItem
                }
                key={item.value}
                item={item}
                disabled={items.filter(it => it.value === item.value)[0]?.disabled}
                barTitleKey="label"
                extra={
                  itemKeys.includes(item.value) ? (
                    <CheckOutlined style={{ color: '#0170fe' }} />
                  ) : (
                    <></>
                  )
                }
                icon={
                  <div className="theling_tag_options_add_mode_radio_item">
                    <div
                      className="theling_tag_options_add_mode_radio_item_color"
                      style={{ background: `${item.color || '#c6c8cc'}` }}
                    />
                  </div>
                }
              />
            );
          })}
          {localOptions?.length === 0 && (
            <div style={{ padding: '7px 0 7px 10px' }}>
              <span style={{ color: '#717484' }}>没有找到想要的数据</span>
            </div>
          )}
        </div>
        {showAdd && (
          <div className="theling_tag_add" onClick={() => setMode(2)}>
            <PlusOutlined />
            创建标签
          </div>
        )}
      </div>
      <div style={{ display: mode === 1 ? 'none' : 'block' }}>
        <AddTag
          addNewTag={addNewTag}
          onBack={() => setMode(1)}
          addTagRequest={newTagRequest}
          isTagColor={isTagColor}
        />
      </div>
    </div>
  );
};
export default TagManage;
