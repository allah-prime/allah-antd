import { FileUpload2Fun } from '../../theling-utils';
import { IFileObjVoBase } from '../../theling-utils/@types/IBase';
import { Button, Card, Divider } from 'antd';
import { Form, Button as MobileButton } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';
import MobileShell from '../MobileShell';
import AhFormItem from '../AhFormItem';
import AhMobileConfig from '../utils/AhMobileConfig';
import {
  areaOptions,
  mealPeopleOptions,
  mockFileKeyRequest,
  mockUploadRequest,
  requestDishesData,
  valueEnum
} from './data';

export default () => {
  const [form] = Form.useForm();
  const [submittedData, setSubmittedData] = useState(null);
  const [editableJson, setEditableJson] = useState('');

  // 使用 useCallback 优化 uploadRef 函数，避免无限循环
  const fileUploadRef = useRef<FileUpload2Fun>(undefined);

  const onFinish = async (values: any) => {
    console.log('表单提交开始:', values);

    try {
      // 如果有文件上传组件，先处理文件上传
      let uploadedFiles: IFileObjVoBase[] = [];
      if (fileUploadRef && values.image && values.image.length > 0) {
        console.log('开始处理文件上传...');
        uploadedFiles = await fileUploadRef.current!.startUpload();
        console.log('文件上传完成:', uploadedFiles);
      }
      // 合并表单数据和上传文件信息
      const finalData = {
        ...values,
        uploadedFiles: uploadedFiles || []
      };

      console.log('表单提交成功:', finalData);
      setSubmittedData(finalData);
    } catch (error) {
      console.error('表单提交失败:', error);
    }
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    setEditableJson(JSON.stringify(allValues, null, 2));
  };

  // 同步JSON数据到表单
  const syncJsonToForm = () => {
    try {
      const parsedData = JSON.parse(editableJson);
      form.setFieldsValue(parsedData);
    } catch (error) {
      alert('JSON 格式错误，请检查格式后重试');
      console.error('JSON 格式错误:', error);
    }
  };

  // 设置预设值
  const setPresetValues = () => {
    const presetData = {
      mealTimes: '1',
      mealPeople: ['person_001', 'person_002'], // 添加用餐人预设值
      dinnerNote: '今日晚餐为特色菜品，请注意保温',
      quantity: 51,
      temperature: 65.5,
      remarks: '留样完整，符合标准要求',
      sampleDate: '2024-01-15',
      sampleTime: '18:30',
      recordDateTime: '2024-01-15 18:30:00',
      isQualified: 'true',
      area: ['beijing', 'chaoyang', 'sanlitun'],
      dishes: ['gongbao_chicken', 'mapo_tofu', 'braised_pork'] // 添加菜品预设值
    };
    form.setFieldsValue(presetData);
    setEditableJson(JSON.stringify(presetData, null, 2));
  };

  useEffect(() => {
    // 配置全局上传设置
    AhMobileConfig.setUploadConfig({
      fileKeyRequest: mockFileKeyRequest,
      uploadRequest: mockUploadRequest
    });

    // 初始化可编辑JSON
    setEditableJson(
      JSON.stringify(
        {
          workLocation: ['tech', 'frontend'],
          dishes: ['gongbao_chicken'],
          mealPeople: ['person_001']
        },
        null,
        2
      )
    );
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
      <MobileShell title="表单示例">
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          layout="vertical"
          initialValues={{
            workLocation: ['tech', 'frontend'],
            dishes: ['gongbao_chicken'],
            mealPeople: ['person_001']
          }}
        >
          <AhFormItem
            title="留样餐次"
            dataIndex="mealTimes"
            valueEnum={valueEnum}
            valueType="select"
            formItemProps={{
              usage: 'form',
              rules: [
                {
                  required: true,
                  message: '请选择留样餐次'
                }
              ]
            }}
          />
          <AhFormItem
            title="晚餐特殊说明"
            dataIndex="dinnerNote"
            valueType="textarea"
            dependent={[
              {
                field: 'mealTimes',
                value: '2',
                show: true,
                required: false
              }
            ]}
            formItemProps={{
              usage: 'form',
              placeholder: '请输入晚餐的特殊说明'
            }}
          />
          <AhFormItem
            title="留样量(整数)"
            dataIndex="quantity"
            valueType="stepper"
            formItemProps={{
              usage: 'form',
              rules: [
                {
                  required: true,
                  message: '请填写留样量',
                  type: 'integer'
                }
              ]
            }}
            fieldProps={{
              usage: 'form',
              min: 1,
              max: 100,
              step: 1
            }}
          />
          <AhFormItem
            title="温度(小数)"
            dataIndex="temperature"
            valueType="digit"
            dependent={[
              {
                field: 'quantity',
                regexp: '^([5-9]|[1-9][0-9]+)$', // 匹配大于4的数字
                show: true,
                required: true
              }
            ]}
            formItemProps={{
              usage: 'form',
              placeholder: '请输入温度(支持小数)'
            }}
            fieldProps={{
              usage: 'form',
              step: 0.1,
              min: -50,
              max: 100
            }}
          />
          <AhFormItem
            title="备注信息"
            dataIndex="remarks"
            valueType="textarea"
            formItemProps={{
              usage: 'form',
              placeholder: '请输入备注信息'
            }}
          />
          <AhFormItem
            title="用餐人"
            dataIndex="mealPeople"
            options={mealPeopleOptions}
            valueType="select"
            formItemProps={{
              usage: 'form',
              rules: [
                {
                  required: true,
                  message: '请选择用餐人'
                }
              ]
            }}
          />
          {/*
            菜品选择器 - 支持多种搜索模式：
            - searchMode="auto" (默认): 有 request 时使用远程搜索，否则本地搜索
            - searchMode="remote": 强制远程搜索，需要配合 request 函数
            - searchMode="local": 强制本地搜索，即使有 request 函数也使用本地搜索

            防抖延迟：
            - 远程搜索: 300ms 防抖
            - 本地搜索: 150ms 防抖
            - 清空搜索: 立即执行
          */}
          <AhFormItem
            title="菜品选择"
            dataIndex="dishes"
            valueType="select"
            request={requestDishesData}
            formItemProps={{
              usage: 'form',
              placeholder: '请选择菜品',
              rules: [
                {
                  required: true,
                  message: '请选择菜品'
                }
              ]
            }}
            fieldProps={{
              usage: 'form',
              mode: 'multiple', // 支持多选
              showSearch: true, // 支持搜索
              filterOption: false // 禁用本地过滤，使用远程搜索
            }}
          />
          <AhFormItem
            title="留样日期"
            dataIndex="sampleDate"
            valueType="date"
            formItemProps={{
              usage: 'form',
              rules: [
                {
                  required: true,
                  message: '请选择留样日期'
                }
              ]
            }}
          />
          <AhFormItem
            title="留样时间"
            dataIndex="sampleTime"
            valueType="time"
            formItemProps={{
              usage: 'form'
            }}
          />
          <AhFormItem
            title="留样秒"
            dataIndex="sampleSecond"
            valueType="second"
            formItemProps={{
              usage: 'form'
            }}
          />
          <AhFormItem
            title="记录日期时间"
            dataIndex="recordDateTime"
            valueType="datetime"
            formItemProps={{
              usage: 'form',
              rules: [
                {
                  required: true,
                  message: '请选择记录日期时间'
                }
              ]
            }}
          />
          <AhFormItem
            title="是否合格"
            dataIndex="isQualified"
            valueType="radio"
            formItemProps={{
              usage: 'form'
            }}
            valueEnum={{
              ok: { label: '合格', value: 'true', text: '合格' },
              no: { label: '不合格', value: 'false', text: '不合格' }
            }}
          />
          <AhFormItem
            title="不合格原因"
            dataIndex="unqualifiedReason"
            valueType="textarea"
            dependent={[
              {
                field: 'isQualified',
                value: 'false',
                show: true,
                required: true
              }
            ]}
            formItemProps={{
              usage: 'form',
              placeholder: '请说明不合格的具体原因'
            }}
          />

          {/* ========== 级联选择器示例区域 ========== */}
          {/* 1. 三级级联，选项较多，展示完整的省市区选择 */}
          <AhFormItem
            title="所在区域(三级级联-多选项)"
            dataIndex="area"
            valueType="cascader"
            options={areaOptions}
            formItemProps={{
              usage: 'form',
              placeholder: '请选择所在区域',
              rules: [
                {
                  required: true,
                  message: '请选择所在区域'
                }
              ]
            }}
          />
          {/* 新增视频上传组件 */}
          <AhFormItem
            title="视频上传"
            dataIndex="video"
            valueType="file"
            formItemProps={{
              usage: 'form'
            }}
            fieldProps={{
              fileKeyRequest: mockFileKeyRequest,
              uploadRequest: mockUploadRequest,
              maxNum: 2,
              fileSize: 100 * 1024 * 1024, // 100MB
              usage: 'demo',
              fileType: 'video',
              busiType: 'form_demo',
              bucket: 'demo-bucket',
              permission: '0',
              accept: 'video/*'
            }}
          />
          {/* 文件上传组件 */}
          <AhFormItem
            title="文件上传"
            dataIndex="image"
            valueType="image"
            formItemProps={{
              usage: 'form'
            }}
            fieldProps={{
              uploadRef: fileUploadRef,
              fileKeyRequest: mockFileKeyRequest,
              uploadRequest: mockUploadRequest,
              maxNum: 5,
              fileSize: 10 * 1024 * 1024, // 10MB
              usage: 'demo',
              fileType: 'document',
              busiType: 'form_demo',
              bucket: 'demo-bucket',
              permission: '0',
              accept: 'image/*,.pdf,.doc,.docx,.xls,.xlsx'
            }}
          />
          {/* 底部留白，避免被固定按钮遮挡 */}
          <div style={{ height: '80px' }} />
        </Form>

        {/* 固定在底部的提交按钮 */}
        <div
          style={{
            position: 'absolute',
            bottom: '42px', // 距离手机壳底部指示器的距离
            left: '8px',
            right: '8px',
            padding: '16px',
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            borderRadius: '0 0 32px 32px',
            zIndex: 10
          }}
        >
          <MobileButton
            type="submit"
            color="primary"
            size="large"
            block
            onClick={() => form.submit()}
          >
            提交表单
          </MobileButton>
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
          title="📝 表单数据实时预览"
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
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <textarea
              value={editableJson}
              onChange={(e) => setEditableJson(e.target.value)}
              style={{
                flex: 1,
                resize: 'none',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                padding: '12px',
                border: '1px solid #e9ecef',
                fontSize: '12px',
                lineHeight: '1.5',
                color: '#495057',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                outline: 'none'
              }}
              placeholder="在此编辑 JSON 数据，点击同步按钮更新到表单"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>
                💡 提示：编辑 JSON 数据后，点击同步按钮更新到左侧表单
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="default" size="small" onClick={setPresetValues}>
                  设置值
                </Button>
                <Button type="primary" size="small" onClick={syncJsonToForm}>
                  同步到表单
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Divider style={{ margin: 0 }} />

        {/* 表单数据提交预览 */}
        <Card
          title="🚀 表单数据提交预览111"
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
