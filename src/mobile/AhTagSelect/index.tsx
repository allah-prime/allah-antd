import { useEffect, useRef, useState } from 'react';
import { ArrayUtil, defBaseFilter, IBaseFilter, IOptions7, ITablePage } from '../../theling-utils';
import { Badge, List, Space } from 'antd-mobile';
import { IAhFlatListFunc, IAhPopupProps, AhFlatList, AhMobileConfig, AhPopup } from '../';
import AhFromContent from '../AhFromContent';
import { CheckOutlined } from '@ant-design/icons';
import AhSelectorItem from '../AhSelectorItem';

type IValue = IOptions7<string>;

type IProps = {
  value?: string[];
  onChange?: (value?: string[], options?: IValue[]) => void;
  /**
   * 设置选择器的模式
   */
  mode?: 'single' | 'multiple';
  /**
   * 名字 - 用于显示
   */
  label?: string;
  /**
   * 获取选项的接口
   * @returns 选项列表
   */
  request?: (p: any) => Promise<ITablePage<IValue>>;
  /**
   * 新增选项的接口
   * @param keyword 新增选项的参数
   * @param color 新增选项的颜色
   * @returns 新增选项的结果
   */
  addRequest?: (keyword: string, color?: string) => Promise<IValue>;
  /**
   * 查询接口，使用id查询出对应的tag选项，用来在页面进行渲染
   */
  queryRequest?: (ids: string[]) => Promise<IValue[]>;
  /**
   * 指定挂载的 HTML 节点，默认为 body，如果为 null 的话，会渲染到当前节点
   */
  getContainer?: IAhPopupProps['getContainer'];
  /**
   * 单个项的渲染
   */
  itemRender?: (
    item: IValue,
    onSelect: (item: IValue) => void,
    currentValue?: IValue[]
  ) => React.ReactNode;
};

/**
 * 陪餐记录 - 员工列表
 * 这个是一个渲染人员列表的符合antd 表单 规范的 自定义表单组件
 */
const AhTagSelect: React.FC<IProps> = ({ value = [], onChange, mode = 'single', ...props }) => {
  // 当前页面的项
  const [currentItemList, setCurrentItemList] = useState<IValue[]>([]);
  // 当前页面的value值
  const [currentValue, setCurrentValue] = useState<string[]>([]);

  // 弹窗是否可见
  const [visible, setVisible] = useState(false);
  // 页面的ref
  const pageRef = useRef<IAhFlatListFunc<IValue, IBaseFilter>>(undefined);

  const dataReq = props.request || AhMobileConfig.getCommReq().tagReq;
  const tagAddReq = props.addRequest || AhMobileConfig.getCommReq().tagAddReq;

  if (!dataReq) {
    console.error('请配置获取选项的接口');
  }

  const diffStr = value.join(',');

  // props 中的 value 发生变化时，更新当前值
  useEffect(() => {
    const isEqual = ArrayUtil.isEqual(
      value,
      currentItemList.map((v) => v.value)
    );
    // 比较下 value 和 currentValue 是否相同
    if (!isEqual) {
      // 调用接口查询下 tag 选项
      if (props.queryRequest) {
        props.queryRequest(value).then((res) => {
          setCurrentItemList(res);
          setCurrentValue(res.map((v) => v.value));
        });
      }
    }
  }, [diffStr]);

  // 处理 onChange 事件
  const handleChange = (newValue: IValue[] = []) => {
    if (onChange) {
      onChange(
        newValue.map((v) => v.value),
        newValue
      );
    }
    setCurrentItemList(newValue);
    setCurrentValue(newValue.map((v) => v.value));
  };

  const handleMultipleSelect = (item: IValue) => {
    const existingIndex = currentValue.indexOf(item.value);

    let newValues: string[] = [...currentValue];
    let newItemList: IValue[] = [...currentItemList];
    if (existingIndex >= 0) {
      // 取消选择，用下标进行删除
      console.log('取消选择', item.value);
      newValues.splice(existingIndex, 1);
      newItemList.splice(existingIndex, 1);
    } else if (mode === 'multiple') {
      // 选中
      newValues = [...currentValue, item.value];
      newItemList = [...currentItemList, item];
    } else if (mode === 'single') {
      newValues = [item.value];
      newItemList = [item];
    }
    handleChange(newItemList);
  };

  // 新增选项并选中它
  const handleAdd = async (keyword: string) => {
    if (tagAddReq) {
      const newItem = await tagAddReq(keyword);
      // 加到选项去
      pageRef.current?.appendData([newItem]);
      if (newItem.value) {
        if (mode === 'single') {
          handleChange([newItem]);
        } else {
          handleMultipleSelect(newItem);
        }
      }
    }
  };

  // 已选值的渲染函数
  const renderSelectedValue =
    currentItemList?.length > 0 ? (
      <Space wrap>
        {currentItemList.map((item) => (
          <AhSelectorItem
            item={item}
            selected
            key={item.value}
            onClick={() => handleMultipleSelect(item)}
          />
        ))}
      </Space>
    ) : (
      '请选择'
    );

  console.log('currentItemList', currentItemList);
  console.log('currentValue', currentValue);

  return (
    <div>
      <AhFromContent
        layout="horizontal"
        valueRender={renderSelectedValue}
        placeholder={`请选择${props.label || '数据'}`}
        onPress={() => setVisible(true)}
        showValue={currentItemList?.length > 0}
        diffStr={diffStr}
      />
      <AhPopup
        bodyStyle={{
          height: '60vh'
        }}
        visible={visible}
        onMaskClick={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        onConfirm={() => {
          setVisible(false);
        }}
        title={`请选择${props.label || '数据'}`}
        getContainer={props.getContainer}
      >
        <AhFlatList<IValue, IBaseFilter>
          rowKey="id"
          backgroundColor="#fff"
          pageRef={pageRef}
          defParams={{
            ...defBaseFilter
          }}
          request={dataReq!}
          emptyRender={(params) => (
            <div className="ah-px-6">
              <div className="ah-text-gray-400 ah-text-sm ah-mb-2">点击新增使用</div>
              <div
                className="ah-py-3"
                onClick={() => handleAdd(params!.keyword!)}
                style={{
                  borderBottom: '1px solid var(--adm-color-border)',
                  borderTop: '1px solid var(--adm-color-border)'
                }}
              >
                <Badge content="新">
                  <div
                    style={{
                      color: '#333',
                      fontSize: '16px'
                    }}
                  >
                    {params?.keyword}
                  </div>
                </Badge>
              </div>
            </div>
          )}
          itemRender={(item, index) => {
            if (props.itemRender) {
              return props.itemRender(item, handleMultipleSelect, currentItemList);
            }
            return (
              <List.Item
                key={item.value}
                onClick={() => !item.disabled && handleMultipleSelect(item)}
                arrowIcon={
                  currentValue.includes(String(item.value)) ? (
                    <CheckOutlined style={{ color: '#dc6b08', fontSize: '18px' }} />
                  ) : (
                    false
                  )
                }
                style={{
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.5 : 1,
                  backgroundColor: currentValue.includes(String(item.value))
                    ? '#f6ffed'
                    : '#ffffff',
                  borderBottom: '1px solid var(--adm-color-border)',
                  // 如果是第一个 ，则需要加上 borderTop
                  borderTop: index === 0 ? '1px solid var(--adm-color-border)' : 'none'
                }}
                className="ah-px-6"
              >
                <div
                  style={{
                    color: item.disabled ? '#999' : '#333',
                    fontSize: '16px'
                  }}
                >
                  {item.label}
                </div>
              </List.Item>
            );
          }}
        />
      </AhPopup>
    </div>
  );
};

export default AhTagSelect;
