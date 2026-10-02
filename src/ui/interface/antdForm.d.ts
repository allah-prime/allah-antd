import type { DeepNamePath } from 'rc-field-form/lib/namePathType';

export type ProFormInstanceType<T> = {
  /**
   * 获取被 ProForm 格式化后的所有数据
   * @param nameList boolean
   * @returns T
   *
   * @example  getFieldsFormatValue() ->返回所有数据
   * @example  getFieldsFormatValue(true) ->返回所有数据，即使没有被 form 托管的
   */
  getFieldsFormatValue?: (nameList?: true, omitNil?: boolean) => T;
  /**
   * 获取被 ProForm 格式化后的单个数据
   * @param nameList (string|number)[]
   * @returns T
   *
   * @example {a:{b:value}} -> getFieldFormatValue(['a', 'b']) -> value
   */
  getFieldFormatValue?: (nameList?: NamePath) => T;
  /**
   * 获取被 ProForm 格式化后的单个数据, 包含他的 name
   * @param nameList (string|number)[]
   * @returns T
   *
   * @example {a:{b:value}}->getFieldFormatValueObject(['a','b'])->{a:{b:value}}
   */
  getFieldFormatValueObject?: (nameList?: NamePath) => T;
  /**
   *验字段后返回格式化之后的所有数据
   * @param nameList (string|number)[]
   * @returns T
   *
   * @example validateFieldsReturnFormatValue -> {a:{b:value}}
   */
  validateFieldsReturnFormatValue?: (nameList?: NamePath[]) => Promise<T>;
};

type ProFormInstance<T = any> = FormInstance<T> & ProFormInstanceType<T>;

export interface InternalFieldData extends Meta {
  value: any;
}

/**
 * Used by `setFields` config
 */
export interface FieldData extends Partial<Omit<InternalFieldData, 'name'>> {
  name: NamePath;
}

export type InternalNamePath = (string | number)[];

export interface Meta {
  touched: boolean;
  validating: boolean;
  errors: string[];
  warnings: string[];
  name: InternalNamePath;
  validated: boolean;
}

export interface FieldError {
  name: InternalNamePath;
  errors: string[];
  warnings: string[];
}

export type FilterFunc = (meta: Meta) => boolean;

export type NamePath<T = any> = DeepNamePath<T>;

export interface ValidateOptions {
  /**
   * Validate only and not trigger UI and Field status update
   */
  validateOnly?: boolean;
  /**
   * Recursive validate. It will validate all the name path that contains the provided one.
   * e.g. [['a']] will validate ['a'] , ['a', 'b'] and ['a', 1].
   */
  recursive?: boolean;
  /** Validate when a field is dirty (validated or touched) */
  dirty?: boolean;
}

export type GetFieldsValueConfig = {
  strict?: boolean;
  filter?: FilterFunc;
};

export type ValidateFields<Values = any> = {
  (opt?: ValidateOptions): Promise<Values>;
  (nameList?: NamePath[], opt?: ValidateOptions): Promise<Values>;
};

export interface RcFormInstance<Values = any> {
  getFieldValue: (name: NamePath) => any;
  getFieldsValue: (() => Values) &
    ((nameList: NamePath[] | true, filterFunc?: FilterFunc) => any) &
    ((config: GetFieldsValueConfig) => any);
  getFieldError: (name: NamePath) => string[];
  getFieldsError: (nameList?: NamePath[]) => FieldError[];
  getFieldWarning: (name: NamePath) => string[];
  isFieldsTouched: ((nameList?: NamePath[], allFieldsTouched?: boolean) => boolean) &
    ((allFieldsTouched?: boolean) => boolean);
  isFieldTouched: (name: NamePath) => boolean;
  isFieldValidating: (name: NamePath) => boolean;
  isFieldsValidating: (nameList?: NamePath[]) => boolean;
  resetFields: (fields?: NamePath[]) => void;
  setFields: (fields: FieldData[]) => void;
  setFieldValue: (name: NamePath, value: any) => void;
  setFieldsValue: (values: any) => void;
  validateFields: ValidateFields<Values>;
  submit: () => void;
}

export interface FormInstance<Values = any> extends RcFormInstance<Values> {
  scrollToField: (name: NamePath, options?: ScrollOptions) => void;
  getFieldInstance: (name: NamePath) => any;
}

export type IAntdForm = FormInstance<any>;

/**
 * @name 获取 ProFormInstance
 *
 * ProFormInstance 可以用来获取当前表单的一些信息
 *
 * @example 获取 name 的值 formRef.current.getFieldValue("name");
 * @example 获取所有的表单值 formRef.current.getFieldsValue(true);
 */
export type IAntdFormRef =
  | React.MutableRefObject<ProFormInstance<any> | undefined>
  | React.RefObject<ProFormInstance<any> | undefined>;
