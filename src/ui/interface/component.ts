import React from 'react';
import type { IOptions6, IOptions7 } from '@allahjs/utils';
import type { SelectProps } from 'antd/lib/select';

export interface PasswordLoginFun {
  // 刷新验证码
  refreshVerCode: () => void;
}

export type IPasswordLoginProps = {
  /**
   * 输入框的样式
   */
  inputStyle: React.CSSProperties;
  /**
   * 获取验证码的回调
   */
  getVerCode?: () => Promise<string>;
  /**
   * 是否显示验证码
   */
  showVerCode?: boolean;
  /**
   * 自定义外壳样式
   */
  style?: React.CSSProperties;
  /**
   * 忘记密码的点击回调
   */
  forgotPassword?: () => void;
  /**
   * 记住密码的文字样式
   */
  spanStyle?: React.CSSProperties;
  /**
   * 密码框的ref
   */
  pwdRef?: React.MutableRefObject<PasswordLoginFun | undefined>;
  /**
   * 记住密码的提示
   */
  rememberPwdTip?: string;
  children?: React.ReactNode;
  /**
   * 用户名占位
   */
  usernamePlaceholder?: string;
};

export interface ISelectSearchProps {
  /**
   * 事件变化的回调
   * @param value 值，单选是string，多选是string[]
   */
  onChange?: (value: string | string[], option: any | any[]) => void;
  /**
   * 选项；异步模式下可作为首次加载前的初始选项
   */
  options: IOptions7<string>[];
  /**
   * 异步获取选项的方法，传入后进入异步模式：面板内搜索框输入时防抖调用，挂载及 refreshDepend 变化时以空关键字自动请求一次
   * @param search 搜索关键字
   */
  fetchOptions?: (search: string) => Promise<IOptions7<string>[]>;
  /**
   * 异步搜索的防抖毫秒数，默认 800
   */
  debounceTimeout?: number;
  /**
   * 依赖刷新的字段，变化时以空关键字重新请求
   */
  refreshDepend?: any[];
  /**
   * 异步模式下根据 value 反查选项（用于默认值回显 label）：当前列表解析不了 value 时自动调用，返回的选项会合并进列表
   * @param value 解析不了的 value 数组
   */
  fetchByValue?: (value: string | string[]) => Promise<IOptions7<string>[]>;
  /**
   * 自定义item渲染
   * @param item
   * @param index
   */
  itemRender?: (item: IOptions6<string>, index: number) => React.ReactNode;
  /**
   * 添加事件，如果传递了这个方法的话，就会显示新增的按钮
   */
  addItem?: () => void;
  /**
   * 下拉选项的props
   */
  selectProps?: SelectProps;
  /**
   * 提示信息
   */
  placeholder?: string;
  /**
   *  默认值，这是受控组件
   */
  value?: string | string[];
  /**
   * 选择模式 multiple 多选
   */
  mode?: 'multiple' | 'tags';
}
