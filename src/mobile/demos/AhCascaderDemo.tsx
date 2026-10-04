import { Form, Button } from 'antd-mobile';
import { Card } from 'antd';
import { useState, useEffect } from 'react';
import AhFormItem from '../AhFormItem';
import MobileShell from '../MobileShell';
import {
  areaOptions,
  deepOptions,
  largeDataOptions,
  loadAsyncData,
  simpleOptions,
  singleLevelOptions
} from './data';

export default () => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({
    workLocation: ['tech', 'frontend'] // 设置工作地点的默认值
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [asyncOptions, setAsyncOptions] = useState<any[]>([]);

  const onFinish = (values: any) => {
    console.log('级联选择器表单提交:', values);
    setSubmittedData({
      ...values
    });
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    setFormValues(allValues);
  };

  // 模拟异步加载数据
  const loadAsyncDataLocal = async () => {
    const data = await loadAsyncData(1500); // 1.5秒延迟模拟网络请求
    setAsyncOptions(data);
  };

  // 组件挂载时加载异步数据
  useEffect(() => {
    loadAsyncDataLocal();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}
    >
      {/* 左侧手机壳 */}
      <MobileShell title="级联选择器示例">
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          layout="vertical"
          initialValues={{
            workLocation: ['tech', 'frontend']
          }}
        >
          {/* 1. 三级级联，选项较多，展示完整的省市区选择 */}
          <AhFormItem
            title="所在区域(三级级联)"
            dataIndex="area"
            valueType="cascader"
            options={areaOptions}
            formItemProps={{
              usage: 'form',
              placeholder: '请选择省市区',
              rules: [
                {
                  required: true,
                  message: '请选择所在区域'
                }
              ]
            }}
          />

          {/* 2. 二级级联，选项较少，适合部门职位等场景 */}
          <AhFormItem
            title="部门职位(二级级联)"
            dataIndex="department"
            valueType="cascader"
            options={simpleOptions}
            formItemProps={{
              usage: 'form',
              placeholder: '请选择部门和职位'
            }}
          />

          {/* 3. 单级选择，无子级，类似普通选择器 */}
          <AhFormItem
            title="直辖市(单级选择)"
            dataIndex="municipality"
            valueType="cascader"
            options={singleLevelOptions}
            formItemProps={{
              usage: 'form',
              placeholder: '请选择直辖市'
            }}
          />

          {/* 4. 四级级联，深层级联选择 */}
          <AhFormItem
            title="详细地址(四级级联)"
            dataIndex="detailAddress"
            valueType="cascader"
            options={deepOptions}
            formItemProps={{
              usage: 'form',
              placeholder: '地区-省-市-街道'
            }}
          />

          {/* 5. 支持清空和搜索功能 */}
          <AhFormItem
            title="备用区域(可清空搜索)"
            dataIndex="backupArea"
            valueType="cascader"
            options={areaOptions}
            formItemProps={{
              usage: 'form',
              placeholder: '支持清空和搜索'
            }}
            fieldProps={{
              allowClear: true,
              showSearch: true,
              usage: 'form'
            }}
          />

          {/* 6. 禁用状态，有默认值 */}
          <AhFormItem
            title="工作地点(禁用状态)"
            dataIndex="workLocation"
            valueType="cascader"
            options={simpleOptions}
            formItemProps={{
              usage: 'form',
              placeholder: '工作地点已锁定'
            }}
            fieldProps={{
              disabled: true,
              usage: 'form'
            }}
          />

          {/* 7. 大数据量场景，支持搜索过滤 */}
          <AhFormItem
            title="大数据量区域(支持搜索)"
            dataIndex="largeDataArea"
            valueType="cascader"
            options={largeDataOptions}
            formItemProps={{
              usage: 'form',
              placeholder: '数据量大，建议搜索'
            }}
            fieldProps={{
              showSearch: true,
              allowClear: true,
              usage: 'form',
              filter: (inputValue: string, path: any[]) => {
                return path.some(option =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                );
              }
            }}
          />

          {/* 8. 异步加载数据，显示加载状态 */}
          <AhFormItem
            title="异步加载区域(动态数据)"
            dataIndex="asyncArea"
            valueType="cascader"
            options={asyncOptions}
            formItemProps={{
              usage: 'form',
              placeholder: asyncOptions.length === 0 ? '数据加载中...' : '请选择异步加载的区域'
            }}
            fieldProps={{
              allowClear: true,
              usage: 'form',
              loading: asyncOptions.length === 0
            }}
          />

          {/* 底部留白，避免被固定按钮遮挡 */}
          <div style={{ height: '80px' }} />
        </Form>

        {/* 固定在底部的提交按钮 */}
        <div
          style={{
            position: 'absolute',
            bottom: '42px',
            left: '8px',
            right: '8px',
            padding: '16px',
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            borderRadius: '0 0 32px 32px',
            zIndex: 10
          }}
        >
          <Button type="submit" color="primary" size="large" block onClick={() => form.submit()}>
            提交表单
          </Button>
        </div>
      </MobileShell>

      {/* 右侧数据预览区域 */}
      <div
        style={{
          flex: 1,
          maxWidth: '450px',
          height: '822px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* 表单数据实时预览 */}
        <Card
          title="📝 级联选择器数据预览"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
          styles={{
            body: {
              flex: 1,
              padding: '16px',
              overflow: 'hidden'
            }
          }}
        >
          <div
            style={{
              height: 280,
              overflow: 'auto',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              padding: '12px',
              border: '1px solid #e9ecef'
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: '1.5',
                color: '#495057',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {Object.keys(formValues).length > 0
                ? JSON.stringify(formValues, null, 2)
                : '// 开始选择级联选项，数据将在此处实时显示\n{\n  "message": "暂无数据"\n}'}
            </pre>
          </div>
        </Card>

        {/* 表单数据提交预览 */}
        <Card
          title="🚀 提交数据预览"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
          styles={{
            body: {
              flex: 1,
              padding: '16px',
              overflow: 'hidden'
            }
          }}
        >
          <div
            style={{
              height: 280,
              overflow: 'auto',
              backgroundColor: submittedData ? '#f6ffed' : '#f8f9fa',
              borderRadius: '6px',
              padding: '12px',
              border: `1px solid ${submittedData ? '#b7eb8f' : '#e9ecef'}`
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: '1.5',
                color: submittedData ? '#389e0d' : '#495057',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {submittedData
                ? JSON.stringify(submittedData, null, 2)
                : '// 点击"提交表单"按钮，提交的数据将在此处显示\n{\n  "message": "等待提交数据..."\n}'}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};
