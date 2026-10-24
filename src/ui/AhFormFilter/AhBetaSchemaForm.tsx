import { BetaSchemaForm, ProProvider } from '@ant-design/pro-components';
import React, { useContext } from 'react';
import AsyncCascader from '../AsyncCascader';
import AhAntdConfig from '../utils/AhAntdConfig';

/**
 * 自己的自定义表单生成
 * <br />
 * 支持使用adminCode生成地区选择表单
 */
const AhBetaSchemaForm: React.FC<any> = props => {
  const { columns, layoutType, ...other } = props;
  const values = useContext(ProProvider);
  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: {
          adminCode: {
            render: (text: any) => <a>{text}</a>,
            renderFormItem: (text: any, props2: any) => {
              const asyncTreeData = props2?.request || AhAntdConfig.getAreaReq().asyncTreeData;
              return <AsyncCascader asyncReq={asyncTreeData} {...props2?.fieldProps} />;
            }
          } as any
        }
      }}
    >
      <BetaSchemaForm<any, 'adminCode'> columns={columns} layoutType={layoutType} {...other} />
    </ProProvider.Provider>
  );
};

export default AhBetaSchemaForm;
