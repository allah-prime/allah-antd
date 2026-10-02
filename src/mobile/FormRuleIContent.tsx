import { useEffect, useState } from 'react';
import { IFormRuleObjKey, IJsonRuleListItem, validateRules } from '../theling-utils';

/**
 * 表单规则组件，根据规则的变化，来判断是否要显示组件
 * @constructor
 */
const FormRuleIContent = ({
  rules = [],
  data,
  children,
  type
}: {
  rules: IJsonRuleListItem[];
  data: any;
  children: any;
  type: IFormRuleObjKey;
}) => {
  // 定义一个显示和隐藏组件的状态
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      validate();
    }, 0);
  }, [data]);

  // 校验规则
  const validate = () => {
    console.log('字段规则校验开始');
    // 如果没有规则，就直接返回
    if (rules.length === 0) {
      setShow(true);
      return;
    }
    // 校验规则
    const result = validateRules(rules, data);
    // 设置显示和隐藏组件的状态
    if (result.includes('show')) {
      setShow(true);
    } else if (result.includes('hide')) {
      setShow(false);
    } else {
      // 取出rules里面的全部event字段，如果全部是hide，就显示，否则隐藏
      const eventList = rules.map(item => item.event);
      const hideList = eventList.filter(item => item === 'hide');
      // 这里要和规则的event字段相反
      setShow(hideList[0] === 'hide');
    }
  };

  if (!show) {
    return null;
  }

  return children;
};

export default FormRuleIContent;
