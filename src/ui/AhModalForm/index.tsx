import { ProForm, ProFormInstance, type ProFormProps } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import './index.less';
import AhModal, { IAhModalProps } from '../AhModal';
import { modelSize } from '..';
import AhModalFormColumns, { type IAhModalFormColumnsProps } from './ColumnsModal';

export type {
  IAhModalFormColumnsContext,
  IAhModalFormColumnsProps,
  IAhModalFormMode
} from './ColumnsModal';

/** 经典用法：children 放 ProForm 字段 */
export type IAhModalFormClassicProps<T> = {
  /** 经典用法下没有列配置；传 `columns` 会进入一体弹窗的列配置模式 */
  columns?: undefined;
  /**
   * 覆盖弹窗设置
   */
  modalProps?: IAhModalProps;
  width?: IAhModalProps['width'];
  height?: IAhModalProps['height'];
  /**
   * 弹窗的大小
   */
  size?: SizeType;
  title?: IAhModalProps['title'];
  visible?: boolean;
  /**
   * 设置显示和隐藏的状态
   * 如果你要监听关闭的回调，请使用onCancel
   * @param v
   */
  setVisible?: (v: boolean) => void;
  onOk?: () => void;
  /**
   * 弹出关闭后的回调
   */
  onCancel?: () => void;
  /**
   * 提交表单的操作
   * @param v
   */
  onFinish: (v: T) => Promise<boolean>;
  /**
   * 为例防止第一次渲染没有值，这个默认值必须传！
   */
  initialValues: T;
  children?: React.ReactNode;
  trigger?: React.ReactElement;
  formRef?: React.MutableRefObject<ProFormInstance | undefined>;
  /**
   * @name 表单初始化成功，比如布局，label等计算完成
   * @example  (values)=>{ console.log(values) }
   */
  onInit?: (values: T, form: ProFormInstance<any>) => void;
  /**
   * 值变化
   */
  onValuesChange?: (changedValues: Partial<T>, values: T) => void;
  /**
   * proFormProps
   */
  proFormProps?: Omit<
    ProFormProps<T, any>,
    'formRef' | 'initialValues' | 'onFinish' | 'onInit' | 'onValuesChange' | 'submitter'
  >;
  /**
   * 关闭后是否重置表单
   */
  resetOnClose?: boolean;
  /**
   * 其他dom，不在表单内的 - 这个样式需要自己写css来调整
   */
  otherDom?: React.ReactNode;
  /**
   * 父级div的style
   */
  style?: React.CSSProperties;
};

/** AhModalForm 属性：传 `columns` 为一体弹窗（详情、编辑、新增），否则为经典 ProForm 弹窗 */
export type IAhModalFormProps<T> = IAhModalFormClassicProps<T> | IAhModalFormColumnsProps<T>;

/**
 * 这个是对ModalForm的封装
 */
const ClassicModalForm = <T,>(props: IAhModalFormClassicProps<T>): React.ReactElement => {
  const {
    modalProps = {},
    trigger,
    onValuesChange,
    visible: propsVisible,
    setVisible: propsSetVisible,
    proFormProps,
    resetOnClose = true,
    otherDom
  } = props;

  // 弹窗的弹出和隐藏
  const [visible, setVisible] = React.useState<boolean | undefined>(propsVisible);
  // 提交的loading
  const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setVisible(propsVisible);
  }, [propsVisible]);

  const openChange = (nextVisible: boolean) => {
    visibleChange(nextVisible);
    if (nextVisible) {
      props.onOk?.();
    } else if (resetOnClose) {
      props.onCancel?.();
      reset();
    }
  };

  // 重置表单
  const reset = () => {
    if (props.initialValues) {
      const defValues: Record<string, undefined> = {};
      Object.keys(props.initialValues).forEach((key) => {
        defValues[key] = undefined;
      });
      formRef.current?.setFieldsValue(defValues);
    } else {
      // 表单重置
      formRef.current?.resetFields();
    }
  };

  const visibleChange = (v: boolean) => {
    if (propsSetVisible) {
      propsSetVisible(v);
    } else {
      setVisible(v);
    }
  };

  const onFinish = async (v: T) => {
    try {
      setSubmitLoading(true);
      const flag = await props.onFinish(v);
      reset();
      setSubmitLoading(false);
      if (flag) {
        visibleChange(false);
        props.onCancel?.();
      }
      return flag;
    } catch (e) {
      console.error(e);
      setSubmitLoading(false);
      return false;
    }
  };

  const formRef = useRef<ProFormInstance>(undefined);

  useImperativeHandle(
    props.formRef,
    () => {
      return formRef.current;
    },
    [formRef.current]
  );

  const triggerDom = useMemo(() => {
    if (!trigger) {
      return null;
    }

    return React.cloneElement(trigger as React.ReactElement<any>, {
      key: 'trigger',
      onClick: async (e: any) => {
        visibleChange(!visible);
        (trigger.props as any)?.onClick?.(e);
      }
    });
  }, [trigger, visible]);

  const modelSizeObj = props.size
    ? modelSize(props.size)
    : {
        width: props.width || '50%',
        height: props.height
      };

  return (
    <>
      <AhModal
        className="ah-form-modal2"
        title={props.title}
        forceRender
        open={visible}
        mask={{
          closable: false
        }}
        onCancel={() => openChange(false)}
        scrollY
        rightFooter={
          <Space>
            <Button
              disabled={submitLoading}
              onClick={() => {
                formRef.current?.resetFields();
                openChange(false);
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => {
                formRef?.current?.submit();
              }}
              loading={submitLoading}
            >
              确定
            </Button>
          </Space>
        }
        {...modelSizeObj}
        {...modalProps}
      >
        <div style={props.style}>
          <ProForm<any>
            className="ah-form-modal-form"
            formRef={formRef}
            autoFocusFirstInput
            onFinish={onFinish}
            initialValues={props.initialValues || {}}
            submitter={false}
            onValuesChange={onValuesChange}
            onInit={(_, form) => {
              if (props.formRef) {
                props.formRef.current = form;
              }
              props?.onInit?.(_, form);
              formRef.current = form;
            }}
            {...proFormProps}
          >
            {props.children}
          </ProForm>
          {otherDom}
        </div>
      </AhModal>
      {triggerDom}
    </>
  );
};

/**
 * 表单弹窗。
 * - 经典用法：`children` 放 ProForm 字段，`onFinish` 接收整份表单。
 * - 列配置模式：传 `columns` 和 `dataSource`，详情、编辑、新增共用同一个弹窗，见 IAhModalFormColumnsProps。
 */
const AhModalForm = <T,>(props: IAhModalFormProps<T>): React.ReactElement => {
  if (props.columns) {
    return <AhModalFormColumns {...(props as IAhModalFormColumnsProps<any>)} />;
  }
  return <ClassicModalForm<T> {...(props as IAhModalFormClassicProps<T>)} />;
};

export default AhModalForm;
