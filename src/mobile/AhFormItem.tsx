import { Form } from 'antd-mobile';
import { buildFormItem, IRenderFunObj } from './FormUtils';
import {
  buildNewFormItemPropsVer,
  IFormColumns,
  IFormRuleObjKey,
  IJsonRuleListItem
} from '../theling-utils';
import FormRuleIContent from './FormRuleIContent';

const defFormItemProps = {
  rules: []
};

export type IZlFormItemProps = IFormColumns & {
  /**
   * 自定义渲染函数
   * 一个key对应一个渲染函数
   * 例如：{ tag: (value) => <Tag color="blue">{value}</Tag> }
   * 这样在columns中，renderFunKey为tag的字段就会使用该函数进行
   */
  renderFunObj?: IRenderFunObj;
  /**
   * 是否显示那个顶部的线条
   */
  showTopLine?: boolean;
  /**
   * 是否是最后一个
   */
  isLast?: boolean;
};

const convertToAntdRules = (config: any): any[] => {
  const rules: any[] = [];

  const verRules = config.attrInfo?.verRules;
  if (!Array.isArray(verRules)) {
    return rules;
  }
  let verRulesOne: any = undefined;

  if (verRules.length > 0) {
    verRulesOne = verRules[0] || {};
  }

  if (!verRulesOne) {
    return [];
  }

  if (verRulesOne.required) {
    rules.push({
      required: true,
      message: '该字段为必填项'
    });
  }

  if (verRulesOne.pattern) {
    rules.push({
      pattern: new RegExp(verRulesOne.pattern),
      message: '格式不正确'
    });
  }

  if (verRulesOne.min || verRulesOne.max) {
    rules.push({
      type: verRulesOne.type || 'string', // 默认 string
      min: verRulesOne.min,
      max: verRulesOne.max,
      message: `长度应在 ${verRulesOne.min || 0} 到 ${verRulesOne.max || '∞'} 个字符之间`
    });
  }

  return rules;
};

const AhFormItem: React.FC<IZlFormItemProps> = props => {
  const formRules = convertToAntdRules(props);
  if (props.dependent || props.zlRules) {
    const { dependent = [], zlRules = [] } = props;

    const allDep: string[] = [];
    // 提取依赖字段名
    dependent.forEach(dep => {
      allDep.push(dep.field);
    });
    // 从zlRules提取依赖的字段名称
    zlRules.forEach((item: IJsonRuleListItem) => {
      return item.all.forEach(item1 => {
        allDep.push(item1.fact);
      });
    });

    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => {
          // 检查依赖字段是否发生变化
          return allDep.some(field => prevValues[field] !== currentValues[field]);
        }}
      >
        {form => {
          const values = form.getFieldsValue();
          const newConfig = buildNewFormItemPropsVer({ value: values }, props);
          if (newConfig.show === false) {
            return null;
          }
          if (newConfig.formItemProps === null) {
            return null;
          }
          return (
            <FormRuleIContent
              type={props.valueType as IFormRuleObjKey}
              key={props.dataIndex as string}
              rules={zlRules}
              data={values}
            >
              <Form.Item
                name={props.dataIndex as string}
                label={props.title}
                style={{
                  borderTop: props.showTopLine ? 'var(--border-inner)' : 'none'
                }}
                {...(newConfig.formItemProps || defFormItemProps)}
                rules={formRules}
              >
                {buildFormItem(newConfig, props.renderFunObj)}
              </Form.Item>
            </FormRuleIContent>
          );
        }}
      </Form.Item>
    );
  }
  return (
    <Form.Item
      name={props.dataIndex as string}
      label={props.title}
      style={{
        borderTop: props.showTopLine ? 'var(--border-inner)' : 'none'
      }}
      {...(props.formItemProps || defFormItemProps)}
      rules={formRules}
    >
      {buildFormItem(props, props.renderFunObj)}
    </Form.Item>
  );
};

export default AhFormItem;
