import type { ProFormSelectProps } from '@ant-design/pro-components';
import { ProFormSelect } from '@ant-design/pro-components';
import './index.less';

export type AhProFormSelectProps = Omit<ProFormSelectProps, 'fieldProps'> & {
  fieldProps?: Omit<ProFormSelectProps['fieldProps'], 'popupMatchSelectWidth'>;
};

const AhProFormSelect: React.FC<AhProFormSelectProps> = ({ fieldProps, ...rest }) => {
  return (
    <ProFormSelect
      className="ah-select-disabled"
      {...rest}
      fieldProps={{
        ...fieldProps,
        popupMatchSelectWidth: false
      }}
    />
  );
};

export default AhProFormSelect;
