import { CheckOutlined } from '@ant-design/icons';
import { IZlFormItemProps, ObjectUtils } from '../../theling-utils';
import type { IOptions7 } from '../../theling-utils/@types/IZlData';
import { Checkbox, List, Radio, Selector, SpinLoading } from 'antd-mobile';
import type { SelectorProps } from 'antd-mobile/es/components/selector';
import React, { useCallback, useEffect, useRef } from 'react';
import AhMobileConfig from '../utils/AhMobileConfig';
import AhFromContent from '../AhFromContent';
import AhPopup, { IAhPopupProps } from '../AhPopup';

export type AhSelectorBaseProps = IZlFormItemProps<string | string[]> &
  Omit<SelectorProps<any>, 'onChange'> & {
    /**
     * 设置选择器的模式
     */
    mode?: 'single' | 'multiple';
    /**
     * 值的类型，字符串或数字
     */
    valueType?: 'string' | 'number';
    /**
     * 搜索用到的keys - 默认是label和text
     */
    searchKeys?: string[];
    /**
     * 选项
     */
    options?: IOptions7<any>[];
    /**
     * 异步请求函数
     */
    request?: (params?: any) => Promise<IOptions7<any>[]>;
    /**
     * 搜索模式：local-本地搜索，remote-远程搜索，auto-自动判断（默认）
     * - local: 强制使用本地搜索，即使有 request 函数
     * - remote: 强制使用远程搜索，需要配合 request 函数
     * - auto: 自动判断，有 request 时使用远程搜索，否则使用本地搜索
     */
    searchMode?: 'local' | 'remote' | 'auto';
    /**
     * 选项的模式，是Chip还是Radio - 只能在少于4个选项的时候使用
     */
    optionMode?: 'chip' | 'radio';
    /**
     * 是否通铺，就是全放出来
     */
    fullAll?: boolean;
    /**
     * 弹窗显示的阈值配置
     */
    popupThreshold?: {
      /** 最小选项数量，默认为4 */
      minCount?: number;
      /** 最大总字数，默认为20 */
      maxTextLength?: number;
    };
    /**
     * 选择后的回调
     */
    onChange?: (value: any) => void;
    /**
     * 指定挂载的 HTML 节点，默认为 body，如果为 null 的话，会渲染到当前节点
     */
    getContainer?: IAhPopupProps['getContainer'];
  };

// 如果配置了字典，那么就从字典获取数据
export const buildDictReq = (dicGroupMap?: string) => {
  if (dicGroupMap && AhMobileConfig.getCommReq()) {
    const commReq = AhMobileConfig.getCommReq();
    return () => commReq.opt7ListByKey?.(dicGroupMap);
  }
  return undefined;
};

/**
 * 通用选择组件，支持单选和多选
 * 当选项数量和总字数都超过阈值时会弹出选择框，默认阈值为4个选项且总字数超过20
 */
const AhSelect: React.FC<AhSelectorBaseProps> = props => {
  const {
    onChange,
    label,
    rightDom,
    showDivider = false,
    request,
    valueEnum,
    value,
    options,
    valueType = 'string',
    mode = 'single',
    searchMode = 'auto',
    optionMode = 'chip',
    fullAll = false,
    popupThreshold = { minCount: 4, maxTextLength: 20 },
    dicGroupMap,
    ...rest
  } = props;

  const [visible, setVisible] = React.useState(false);
  const [optValue, setOptValue] = React.useState<string | string[]>(
    mode === 'multiple' ? (value as string[]) || [] : (value as string) || ''
  );
  const [keyword, setKeyword] = React.useState('');
  const [tempValue, setTempValue] = React.useState<string | string[]>(optValue);
  const [loading, setLoading] = React.useState(false);

  // 防抖相关
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 处理选项数据
  const [allOptions, setAllOptions] = React.useState<IOptions7<any>[]>([]);
  const [originalOptions, setOriginalOptions] = React.useState<IOptions7<any>[]>([]);
  const [optEnum, setOptEnum] = React.useState<Record<string, any>>({});

  useEffect(() => {
    const loadOptions = async () => {
      let finalOptions: IOptions7<any>[] = [];

      if (request || dicGroupMap) {
        console.log('dicGroupMap', dicGroupMap);
        let requestFun: any = request;
        // 使用 request 异步加载数据
        setLoading(true);
        if (!request && dicGroupMap) {
          // 从配置获取
          requestFun = buildDictReq(dicGroupMap);
        }
        try {
          const requestResult = await requestFun();
          finalOptions = Array.isArray(requestResult) ? requestResult : [];
          const enumMap: Record<string, any> = {};
          finalOptions.forEach((item: IOptions7<any>) => {
            enumMap[item.value] = item;
          });
          setOptEnum(enumMap);
        } catch (error) {
          console.error('Request failed:', error);
          finalOptions = [];
        } finally {
          setLoading(false);
        }
      } else if (valueEnum) {
        // 使用 valueEnum
        finalOptions = ObjectUtils.enumToOptions(valueEnum);
        setOptEnum(valueEnum);
      } else if (options) {
        // 使用 options
        finalOptions = options;
        const enumMap: Record<string, any> = {};
        options.forEach((item: IOptions7<any>) => {
          enumMap[item.value] = item;
        });
        setOptEnum(enumMap);
      }

      if (finalOptions.length > 0) {
        setAllOptions(finalOptions);
        setOriginalOptions(finalOptions);
      }
    };

    loadOptions();
  }, [options, valueEnum, request]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mode === 'multiple') {
      const arrayValue = Array.isArray(value) ? value : [];
      const stringValue = arrayValue.map((item: string | number) => String(item));
      setOptValue(stringValue);
      setTempValue(stringValue);
    } else {
      const stringValue = String(value);
      setOptValue(stringValue);
      setTempValue(stringValue);
    }
  }, [value, mode]);

  // 单选处理
  const onSingleChange = (v: string, isOk?: boolean) => {
    if (rest.disabled) return;

    let finalValue: any = v;
    if (valueType === 'number') {
      finalValue = Number(v);
    }

    // 如果选择了相同的值，就反选
    if (optValue === v && !isOk) {
      finalValue = valueType === 'number' ? undefined : '';
    }

    setOptValue(finalValue);
    onChange?.(finalValue);
  };

  // 多选处理
  const onMultipleChange = (key: string) => {
    if (rest.disabled) return;

    const currentValue = optValue as string[];
    let newOptValue: string[];

    if (currentValue.includes(key)) {
      newOptValue = currentValue.filter(item => item !== key);
    } else {
      newOptValue = [...currentValue, key];
    }

    const finalValue = newOptValue.map(item => {
      return valueType === 'number' ? Number(item) : item;
    });

    setOptValue(newOptValue);
    onChange?.(finalValue);
  };

  // 多选弹窗模式下的临时选择处理
  const onMultipleTempChange = (key: string) => {
    if (rest.disabled) return;

    const currentValue = tempValue as string[];
    let newTempValue: string[];

    if (currentValue.includes(key)) {
      newTempValue = currentValue.filter(item => item !== key);
    } else {
      newTempValue = [...currentValue, key];
    }

    setTempValue(newTempValue);
  };

  // 实际的搜索处理函数
  const performSearch = useCallback(
    async (val: string) => {
      // 判断使用哪种搜索模式
      const shouldUseRemoteSearch = (() => {
        if (searchMode === 'local') return false;
        if (searchMode === 'remote') return true;
        // auto 模式：有 request 函数时使用远程搜索
        return searchMode === 'auto' && !!request;
      })();

      if (shouldUseRemoteSearch && request) {
        // 使用 request 进行远程搜索
        if (!val) {
          // 如果搜索词为空，重新加载所有数据
          setLoading(true);
          try {
            const requestResult = await request();
            const finalOptions = Array.isArray(requestResult) ? requestResult : [];
            setAllOptions(finalOptions);
          } catch (error) {
            console.error('Request failed:', error);
            setAllOptions([]);
          } finally {
            setLoading(false);
          }
        } else {
          // 带搜索关键词请求
          setLoading(true);
          try {
            const requestResult = await request({ keyword: val });
            const finalOptions = Array.isArray(requestResult) ? requestResult : [];
            setAllOptions(finalOptions);
          } catch (error) {
            console.error('Request failed:', error);
            setAllOptions([]);
          } finally {
            setLoading(false);
          }
        }
      } else {
        // 本地搜索逻辑
        if (!val) {
          setAllOptions(originalOptions);
          return;
        }

        const searchKeys = rest.searchKeys || ['label', 'text'];
        const filteredOptions = originalOptions.filter((item: IOptions7<any>) => {
          return searchKeys.some((key: string) => {
            const value = item[key as keyof typeof item];
            return value && String(value).toLowerCase().includes(val.toLowerCase());
          });
        });
        setAllOptions(filteredOptions || []);
      }
    },
    [request, originalOptions, rest.searchKeys, searchMode]
  );

  // 防抖搜索处理
  const onSearch = useCallback(
    (val: string) => {
      setKeyword(val);

      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 判断是否使用远程搜索
      const shouldUseRemoteSearch = (() => {
        if (searchMode === 'local') return false;
        if (searchMode === 'remote') return true;
        // auto 模式：有 request 函数时使用远程搜索
        return searchMode === 'auto' && !!request;
      })();

      // 如果是清空搜索，立即执行
      if (!val) {
        performSearch(val);
        return;
      }

      // 根据搜索模式设置不同的防抖延迟
      const debounceDelay = shouldUseRemoteSearch ? 300 : 150; // 远程搜索300ms，本地搜索150ms

      debounceTimerRef.current = setTimeout(() => {
        performSearch(val);
      }, debounceDelay);
    },
    [performSearch, request, searchMode]
  );

  // 恢复数据
  const recoverData = async () => {
    setKeyword('');

    if (request) {
      // 使用 request 重新加载数据
      setLoading(true);
      try {
        const requestResult = await request();
        const finalOptions = Array.isArray(requestResult) ? requestResult : [];
        setAllOptions(finalOptions);
      } catch (error) {
        console.error('Request failed:', error);
        setAllOptions([]);
      } finally {
        setLoading(false);
      }
    } else {
      // 恢复到原始选项
      setAllOptions(originalOptions);
    }
  };

  // 确认选择（单选模式）
  const handleConfirm = async () => {
    if (mode === 'single' && tempValue) {
      onSingleChange(tempValue as string, true);
    } else if (mode === 'multiple') {
      // 多选模式确认逻辑
      const finalValue = (tempValue as string[]).map(item => {
        return valueType === 'number' ? Number(item) : item;
      });
      setOptValue(tempValue);
      onChange?.(finalValue);
    }
    setVisible(false);
    await recoverData();
  };

  // 取消选择
  const handleCancel = async () => {
    setTempValue(optValue);
    setVisible(false);
    await recoverData();
  };

  // 单选时直接选择
  const handleItemClick = async (itemValue: string) => {
    setTempValue(itemValue);
    onSingleChange(itemValue, true);
    setVisible(false);
    await recoverData();
  };

  // 显示值处理
  const getDisplayValue = () => {
    if (mode === 'multiple') {
      const arrayValue = optValue as string[];
      return arrayValue.length > 0
        ? arrayValue.map(item => optEnum[item]?.text || optEnum[item]?.label).join('、')
        : '';
    }
    const singleValue = optValue as string;
    return singleValue ? optEnum[singleValue]?.text || optEnum[singleValue]?.label : '';
  };

  const displayValue = getDisplayValue();

  // 计算选项总字数
  const getTotalTextLength = () => {
    return originalOptions.reduce((total, option) => {
      const text = option.label || option.text || '';
      return total + String(text).length;
    }, 0);
  };

  // 判断是否需要弹窗显示：选项数量和总字数都超过阈值时使用弹窗
  const shouldShowPopup =
    !fullAll &&
    originalOptions.length > (popupThreshold.minCount || 4) &&
    getTotalTextLength() > (popupThreshold.maxTextLength || 20);

  // 如果是详情模式
  // 详情模式下，所有交互入口禁用，仅展示当前值
  if (rest.details) {
    return (
      <AhFromContent
        details
        layout={props.layout}
        rightDom={rightDom}
        setVisible={undefined} // 禁止弹窗
        placeholder="未选择"
        showValue
        valueRender={displayValue}
      />
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {shouldShowPopup && (
        <AhFromContent
          disabled={rest.disabled || rest.details}
          layout={props.layout}
          rightDom={rightDom}
          setVisible={rest.details ? undefined : setVisible}
          placeholder={rest.placeholder || '请选择'}
          showValue={Boolean(displayValue)}
          valueRender={displayValue}
        />
      )}

      {shouldShowPopup ? (
        mode === 'single' ? (
          <AhPopup
            visible={visible}
            onMaskClick={rest.details ? undefined : handleCancel}
            onCancel={rest.details ? undefined : handleCancel}
            onConfirm={rest.details ? undefined : handleConfirm}
            title="请选择"
            showSearch={!rest.details}
            searchValue={keyword}
            onSearchChange={rest.details ? undefined : onSearch}
            searchPlaceholder="搜索选项"
            forceRender
          >
            <List>
              {loading ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#999',
                    fontSize: '14px'
                  }}
                >
                  <SpinLoading style={{ '--size': '24px' }} />
                  <div style={{ marginTop: '8px' }}>加载中...</div>
                </div>
              ) : allOptions.length > 0 ? (
                allOptions.map(item => (
                  <List.Item
                    key={item.value}
                    onClick={rest.details || item.disabled ? undefined : () => handleItemClick(String(item.value))}
                    arrowIcon={false}
                    extra={
                      tempValue === String(item.value) ? (
                        <CheckOutlined style={{ color: '#dc6b08', fontSize: '18px' }} />
                      ) : null
                    }
                    style={{
                      cursor: rest.details || item.disabled ? 'not-allowed' : 'pointer',
                      opacity: rest.details || item.disabled ? 0.5 : 1,
                      backgroundColor: tempValue === String(item.value) ? '#f6ffed' : 'transparent'
                    }}
                  >
                    <div
                      style={{
                        color: rest.details || item.disabled ? '#999' : '#333',
                        fontSize: '16px'
                      }}
                    >
                      {item.label}
                    </div>
                  </List.Item>
                ))
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#999',
                    fontSize: '14px'
                  }}
                >
                  {keyword ? '暂无匹配的选项' : '暂无数据'}
                </div>
              )}
            </List>
          </AhPopup>
        ) : (
          <AhPopup
            visible={visible}
            onMaskClick={rest.details ? undefined : handleCancel}
            onCancel={rest.details ? undefined : handleCancel}
            onConfirm={rest.details ? undefined : handleConfirm}
            title="请选择"
            showSearch={!rest.details}
            searchValue={keyword}
            onSearchChange={rest.details ? undefined : onSearch}
            searchPlaceholder="搜索选项"
            forceRender
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: 12 }}>
              {loading ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#999',
                    fontSize: '14px'
                  }}
                >
                  <SpinLoading style={{ '--size': '24px' }} />
                  <div style={{ marginTop: '8px' }}>加载中...</div>
                </div>
              ) : allOptions.length > 0 ? (
                allOptions.map(item => (
                  <Checkbox
                    key={item.value}
                    checked={(tempValue as string[]).includes(String(item.value))}
                    onChange={rest.details ? undefined : () => onMultipleTempChange(String(item.value))}
                    disabled={rest.details || rest.disabled || item.disabled}
                  >
                    {item.label}
                  </Checkbox>
                ))
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#999',
                    fontSize: '14px'
                  }}
                >
                  {keyword ? '暂无匹配的选项' : '暂无数据'}
                </div>
              )}
            </div>
          </AhPopup>
        )
      ) : (
        <div style={ mode === 'single' ? {width: '100%'} : {display: 'flex', flexWrap: 'wrap', gap: 8}}>
          {mode === 'single' ? (
            optionMode === 'radio' ? (
              <Radio.Group
                value={optValue as string}
                onChange={rest.details ? undefined : val => onSingleChange(String(val))}
                disabled={rest.details || rest.disabled}
              >
                {originalOptions.map(item => (
                  <Radio
                    key={item.value}
                    value={String(item.value)}
                    disabled={rest.details || item.disabled}
                    style={{ marginBottom: 8, marginTop: 6 }}
                  >
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group>
            ) : (
              <Selector
                options={originalOptions.map(item => ({
                  label: item.label,
                  value: item.value,
                  disabled: rest.details || item.disabled
                }))}
                value={[optValue as string].filter(Boolean)}
                onChange={rest.details ? undefined : arr => onSingleChange(arr[0])}
                disabled={rest.details || rest.disabled}
              />
            )
          ) : (
            originalOptions.map(item => (
              <Checkbox
                key={item.value}
                checked={(optValue as string[]).includes(String(item.value))}
                onChange={rest.details ? undefined : () => onMultipleChange(String(item.value))}
                disabled={rest.details || rest.disabled || item.disabled}
              >
                {item.label}
              </Checkbox>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AhSelect;
