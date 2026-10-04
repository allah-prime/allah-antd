import { Form, Input } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

export type IProFormSearchProps = {
  name?: string;
  label?: string;
  placeholder?: string;
  size?: SizeType;
};

/**
 * 搜索组件
 */
const ProFormSearch: React.FC<IProFormSearchProps> = ({
  name = 'keyword',
  label,
  placeholder = '请输入关键字查询',
  size = 'medium'
}) => {
  return (
    <Form.Item name={name} label={label}>
      <Input.Search placeholder={placeholder} size={size} style={{ width: 200 }} />
    </Form.Item>
  );
};

export default ProFormSearch;
