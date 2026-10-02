/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Skeleton } from 'antd-mobile';
import { FormInstance } from 'antd-mobile/es/components/form';
import AhFormItem, { IZlFormItemProps } from '../AhFormItem';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  FileUpload2Fun,
  groupColumnsByTitle,
  IFormColumns,
  showPicker,
  useYearTypeList,
  validateActions,
  zlDelay
} from '../../theling-utils';
import './index.less';
import { ZlPermissionEnum } from '../../theling-utils/@types/IZlData';
import AhMobileConfig from '../utils/AhMobileConfig';
import dayjs from 'dayjs';

export type AhFormInstance = FormInstance;

type MButtonProps = {
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | undefined;
  fill?: 'none' | 'solid' | 'outline' | undefined;
  size?: 'small' | 'large' | 'middle' | 'mini' | undefined;
  block?: boolean | undefined;
  loading?: boolean | 'auto' | undefined;
  loadingText?: string | undefined;
  loadingIcon?: ReactNode;
  disabled?: boolean | undefined;
  type?: 'reset' | 'submit' | 'button' | undefined;
  shape?: 'default' | 'rounded' | 'rectangular' | undefined;
};

export type SubmitterProps<T = Record<string, any>> = {
  /** 提交按钮的 props */
  submitButtonProps?:
    | false
    | (MButtonProps & {
        preventDefault?: boolean;
      });
  /** 提交按钮文本 */
  submitText?: React.ReactNode;
  /** 是否正在提交 */
  submitting?: boolean;
  /** 自定义操作的渲染 */
  render?:
    | ((
        props: SubmitterProps,
        dom: React.ReactElement[],
        formRef: React.RefObject<AhFormInstance | undefined>
      ) => React.ReactNode[] | React.ReactNode | false)
    | false;
};

type IGroupColumns<T> = Array<
  IFormColumns<T> & {
    columns: IFormColumns<T>[];
  }
>;

type IAhSchemaForm<T = any> = {
  onFinish?: (
    values: any,
    columns: IFormColumns<T>[],
    fileUploadRefs?: React.RefObject<Map<string, FileUpload2Fun>>
  ) => Promise<boolean | void>;
  /** 请求函数，用于异步获取数据 */
  request?: () => Promise<T>;
  /**
   * 表单组id
   */
  formId?: string;
  /**
   * 表单的请求
   */
  formGroupReq?: (formId?: string) => Promise<IFormColumns<T>[]>;
  onChange?: (changedValues: any, values: T) => void;
  formRef?: React.RefObject<AhFormInstance | undefined>;
  /**
   * 外部容器的样式
   */
  containerStyle?: React.CSSProperties;
  /**
   * 表单区域的div样式
   */
  formStyle?: React.CSSProperties;
  /**
   * 自定义渲染函数
   * 一个key对应一个渲染函数
   * 例如：{ tag: (value) => <Tag color="blue">{value}</Tag> }
   * 这样在columns中，renderFunKey为tag的字段就会使用该函数进行
   */
  renderFunObj?: IZlFormItemProps['renderFunObj'];
  /**
   * 提交按钮相关配置
   */
  submitter?: boolean | SubmitterProps;
  /**
   * 表单是否禁用
   */
  disabled?: boolean;
  /**
   * 是否是详情模式
   */
  details?: boolean;
  /**
   * 表单配置和详情组合的请求
   */
  allRequest?: (params?: {
    formId?: string;
    id?: string;
  }) => Promise<{ columns: IFormColumns<T>[]; data: T }>;
};

const AhSchemaForm = <T = any,>(props: IAhSchemaForm<T>): React.ReactElement => {
  const {
    onFinish,
    onChange,
    request,
    containerStyle,
    formStyle,
    submitter = true,
    details
  } = props;
  const formRef = useRef<AhFormInstance | null>(null);

  // 默认值
  const [currentData, setCurrentData] = React.useState<T | undefined>({} as T);
  const [loading, setLoading] = React.useState(false); // 提交的loading
  const [submitting, setSubmitting] = React.useState(false); // 提交按钮的loading状态

  const [groupColumns, setGroupColumns] = useState<IGroupColumns<any>>([]);

  const [currentColumns, setCurrentColumns] = useState<IFormColumns<T>[]>([]);

  // 使用 Map 管理文件上传的 ref，key 为 dataIndex，value 为 FileUpload2Fun
  const mainFileUploadRef = useRef<Map<string, FileUpload2Fun>>(new Map());

  // 创建 ref 回调函数
  const createRefCallback = useCallback((dataIndex: string) => {
    return (ref: FileUpload2Fun | null) => {
      if (ref) {
        // 直接设置到 Map 中，自动覆盖重复的 key
        mainFileUploadRef.current.set(dataIndex, ref);
      } else {
        // 如果 ref 为 null，从 Map 中删除
        mainFileUploadRef.current.delete(dataIndex);
      }
    };
  }, []);

  // 清理 ref Map 的函数
  const clearFileUploadRefs = useCallback(() => {
    mainFileUploadRef.current.clear();
  }, []);

  // 获取所有文件上传 ref 的函数
  const getAllFileUploadRefs = useCallback(() => {
    return Array.from(mainFileUploadRef.current.values());
  }, []);

  // 根据 dataIndex 获取特定的文件上传 ref
  const getFileUploadRefByKey = useCallback((dataIndex: string) => {
    return mainFileUploadRef.current.get(dataIndex);
  }, []);

  // 当 columns 变化时，清理旧的 ref
  useEffect(() => {
    clearFileUploadRefs();
  }, [groupColumns, clearFileUploadRefs]);

  /**
   * 初始化数据和表单配置
   * 使用Promise.all并行执行request和formGroupReq，提高加载性能
   */
  const initData = async () => {
    let newData: any = undefined;
    let newColumns: any = undefined;

    console.log('自定义表单初始化');

    const commReqConfig = AhMobileConfig.getCommReq();
    const formGroupReq = props.formGroupReq || commReqConfig.formGroupReq;
    if (props.allRequest) {
      const allRes = await props.allRequest({ formId: props.formId });
      newColumns = allRes.columns;
      newData = allRes.data;
    } else {
      // 创建并行执行的Promise数组
      const promises: Promise<any>[] = [];
      // 如果需要获取表单配置，添加到Promise数组
      if (formGroupReq) {
        promises.push(formGroupReq(props.formId));
      }
      // 如果需要获取数据，添加到Promise数组
      if (request) {
        promises.push(request());
      }
      // 并行执行所有请求
      const [columnsResult, dataResult] = await Promise.all(promises);
      // 根据请求结果赋值
      newColumns = columnsResult;
      newData = dataResult;
    }

    if (!newData || Object.keys(newData).length === 0) {
      // 使用默认值
      newData = newColumns.reduce(
        (acc: any, item: any) => {
          // 如果需要日期默认值
          if (showPicker.includes(item.valueType) && item.formItemProps?.fieldProps?.defNow) {
            acc[item.dataIndex] = dayjs().toDate();
          } else if (item.defaultValue) {
            // 如果是日期的，就转成dayjs对象
            if (useYearTypeList.includes(item.valueType)) {
              acc[item.dataIndex] = dayjs(item.defaultValue).toDate();
            } else {
              acc[item.dataIndex] = item.defaultValue;
            }
          }
          return acc;
        },
        {} as Record<string, any>
      );
    }
    setCurrentColumns(newColumns);
    // 对配置进行分组
    const groupColumns = groupColumnsByTitle<any>(newColumns);
    setGroupColumns(groupColumns);
    formRef.current?.setFieldsValue(newData);
    await zlDelay(100);
    setCurrentData(newData);
  };

  useEffect(() => {
    setLoading(true);
    initData()
      .then(() => {
        // 数据初始化完成后的操作
        setLoading(false);
      })
      .catch((e) => {
        console.error('自定义表单初始化失败', e);
        setLoading(false);
      });
  }, [props.formId]);

  useImperativeHandle(
    props.formRef,
    () => {
      const formInstance = formRef.current || undefined;
      // 扩展表单实例，添加文件上传相关方法
      if (formInstance) {
        return {
          ...formInstance,
          // 获取所有文件上传组件的 ref（返回数组，兼容旧版本）
          getAllFileUploadRefs,
          // 清理所有文件上传 ref
          clearFileUploadRefs,
          // 根据 dataIndex 获取特定的文件上传 ref
          getFileUploadRefByKey,
          // 获取文件上传 ref 数组（兼容旧版本）
          getFileUploadRefs: getAllFileUploadRefs,
          // 获取文件上传 ref Map（新增方法）
          getFileUploadRefMap: () => mainFileUploadRef.current
        };
      }
      return formInstance;
    },
    [formRef.current, getAllFileUploadRefs, clearFileUploadRefs, getFileUploadRefByKey]
  );

  const newSubmitter = useMemo(() => {
    if (props.details) {
      return false;
    }
    return submitter;
  }, [submitter, props.details]);

  const onValuesChange = (changedValues: any, values: T) => {
    onChange?.(changedValues, values);
    setCurrentData({
      ...currentData,
      ...changedValues
    });
  };

  /**
   * 渲染提交按钮区域
   */
  const renderSubmitter = () => {
    if (props.details) {
      return null;
    }
    // 如果 submitter 为 false，不显示按钮
    if (!submitter) {
      return null;
    }

    // 默认配置
    const defaultSubmitterProps: SubmitterProps = {
      submitText: '提交',
      submitting: submitting
    };

    // 合并配置
    const submitterConfig =
      typeof submitter === 'object'
        ? { ...defaultSubmitterProps, ...submitter }
        : defaultSubmitterProps;

    // 如果有自定义渲染函数
    if (submitterConfig.render) {
      const submitButton = (
        <Button
          key="submit"
          block
          type="submit"
          color="primary"
          onClick={() => formRef.current?.submit()}
          loading={submitterConfig.submitting || submitting}
          {...(submitterConfig.submitButtonProps !== false
            ? submitterConfig.submitButtonProps
            : {})}
        >
          {submitterConfig.submitText}
        </Button>
      );

      const buttons = [submitButton];

      return submitterConfig.render(submitterConfig, buttons, formRef as any);
    }

    // 默认渲染 - 只显示提交按钮
    return (
      <div className="submitBtnFixed">
        <Button
          block
          type="submit"
          color="primary"
          onClick={() => formRef.current?.submit()}
          loading={submitterConfig.submitting || submitting}
          {...(submitterConfig.submitButtonProps !== false
            ? submitterConfig.submitButtonProps
            : {})}
        >
          {submitterConfig.submitText}
        </Button>
      </div>
    );
  };

  const formValidateActions = (
    item: IFormColumns<any> & {
      columns: IFormColumns<any>[];
    }
  ) => {
    // 如果是详情页面，就从currentData中获取数据，否则从formRef中获取数据
    if (currentData) {
      return validateActions(item.zlRules || [], currentData);
    }
    const formValues = formRef.current?.getFieldsValue();
    return validateActions(item.zlRules || [], formValues);
  };

  return (
    <div
      style={{
        height: '100%',
        padding: 0, // 移除padding，让表单内容占满整个区域
        position: 'relative', // 为提交按钮提供定位参考
        display: 'flex',
        flexDirection: 'column',
        ...containerStyle
      }}
    >
      <div
        style={{
          padding: 20,
          height: '100%',
          display: loading ? 'block' : 'none'
        }}
      >
        <Skeleton.Title animated />
        <Skeleton.Paragraph lineCount={5} animated />
      </div>
      <div
        style={{
          height: newSubmitter ? 'calc(100% - 64px)' : '100%',
          overflowY: 'auto',
          scrollbarGutter: 'stable',
          display: loading ? 'none' : 'block'
        }}
      >
        <Form
          ref={formRef}
          onFinish={async (v) => {
            try {
              setSubmitting(true);
              await onFinish?.(v, currentColumns, mainFileUploadRef);
            } catch (error) {
              console.error('表单提交失败:', error);
            } finally {
              setSubmitting(false);
            }
          }}
          onValuesChange={onValuesChange}
          layout="vertical"
          initialValues={currentData || {}}
          className={`ah-schema-form ${details ? 'ah-schema-form-details' : ''}`}
        >
          <div
            className="ah-form-list-body"
            style={{
              padding: '12px 6px 12px 12px', // 将padding移到内容区域
              ...formStyle
            }}
          >
            {groupColumns?.map((item) => {
              if (item.dependent || item.zlRules) {
                const validateRes = formValidateActions(item);
                if (!validateRes.show) {
                  return null;
                }
              }
              return (
                <div
                  style={{
                    border: 'none',
                    backgroundColor: '#ffffff'
                  }}
                  className="ah-schema-form-card"
                  key={item.title || '1'}
                >
                  {item.title && (
                    <div
                      style={{
                        borderLeft: '4px solid #1890ff',
                        paddingLeft: 12,
                        fontSize: 16,
                        fontWeight: 500,
                        color: '#262626'
                      }}
                    >
                      {item.title}
                    </div>
                  )}
                  {item.columns.map((col: any, index) => {
                    // 如果是文件上传，就要更新ref
                    if (col.valueType === 'image') {
                      // 使用新的 ref 管理方式
                      col.fieldProps = {
                        uploadRef: createRefCallback(col.dataIndex as string),
                        busiScene: col.busiScene,
                        permission: ZlPermissionEnum.LOGIN,
                        fileSize: 10485760,
                        accept: 'image/jpg,image/jpeg,image/png',
                        multiple: true,
                        ...col.fieldProps
                      };
                      return (
                        <AhFormItem
                          key={col.dataIndex as string}
                          {...col}
                          showTopLine={index !== 0}
                          disabled={props.disabled}
                          details={props.details}
                          renderFunObj={props.renderFunObj}
                        />
                      );
                    }
                    // 如果是文件上传，就要更新ref
                    if (col.valueType === 'file') {
                      // 使用新的 ref 管理方式
                      col.fieldProps = {
                        uploadRef: createRefCallback(col.dataIndex as string),
                        busiScene: col.busiScene,
                        permission: ZlPermissionEnum.LOGIN,
                        fileSize: 20971520,
                        accept: 'image/*,video/*,audio/*,.xls,.xlsx,.doc,.docx,.pdf,.txt,.md',
                        multiple: true,
                        ...col.fieldProps
                      };
                      return (
                        <AhFormItem
                          key={col.dataIndex as string}
                          {...col}
                          showTopLine={index !== 0}
                          disabled={props.disabled}
                          details={props.details}
                          renderFunObj={props.renderFunObj}
                        />
                      );
                    }
                    return (
                      <AhFormItem
                        key={col.dataIndex as string}
                        {...col}
                        showTopLine={index !== 0}
                        disabled={props.disabled}
                        details={props.details}
                        renderFunObj={props.renderFunObj}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Form>
      </div>
      {renderSubmitter()}
    </div>
  );
};

export default AhSchemaForm;
