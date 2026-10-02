import { Card, Divider, Button } from 'antd';
import { useState, useEffect, useRef } from 'react';
import AhSchemaForm, { AhFormInstance } from '../AhSchemaForm';
import AhMobileConfig from '../utils/AhMobileConfig';
import MobileShell from '../MobileShell';
import { mockFileKeyRequest, mockUploadRequest } from './data';
import { FileUpload2Fun } from '../../theling-utils';
import { IFileObjVoBase } from '../../theling-utils/@types/IBase';
import { columnsReq, dataRequest } from './requestDemo';

export default () => {
  const formRef = useRef<AhFormInstance | undefined>(undefined);
  const [submittedData, setSubmittedData] = useState(null);
  const [editableJson, setEditableJson] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isDetails, setIsDetails] = useState(false);

  // 使用 useCallback 优化 uploadRef 函数，避免无限循环
  const fileUploadRef = useRef<FileUpload2Fun>(undefined);

  /**
   * 切换表单禁用状态
   */
  const toggleFormDisabled = () => {
    setIsFormDisabled(!isFormDisabled);
  };

  /**
   * 切换详情模式
   */
  const toggleDetails = () => {
    setIsDetails(!isDetails);
  };

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
    return true;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    setEditableJson(JSON.stringify(allValues, null, 2));
  };

  // 同步JSON数据到表单
  const syncJsonToForm = () => {
    try {
      const parsedData = JSON.parse(editableJson);
      formRef.current?.setFieldsValue(parsedData);
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
    formRef.current?.setFieldsValue(presetData);
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
    <div>
      {/* 禁用/启用切换按钮 */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 500 }}>表单状态控制</div>
        <div>
          <Button
            type={isFormDisabled ? 'default' : 'primary'}
            onClick={toggleFormDisabled}
            style={{
              backgroundColor: isFormDisabled ? '#ff4d4f' : '#52c41a',
              borderColor: isFormDisabled ? '#ff4d4f' : '#52c41a',
              color: '#fff'
            }}
          >
            {isFormDisabled ? '🔒 表单已禁用' : '🔓 表单已启用'}
          </Button>
          {/* 详情模式切换按钮 */}
          <Button
            type={isDetails ? 'default' : 'primary'}
            onClick={toggleDetails}
            style={{
              backgroundColor: isDetails ? '#ff4d4f' : '#52c41a',
              borderColor: isDetails ? '#ff4d4f' : '#52c41a',
              color: '#fff',
              marginLeft: '10px'
            }}
          >
            {isDetails ? '📄 退出详情模式' : '📄 进入详情模式'}
          </Button>
        </div>
      </div>
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
          <AhSchemaForm
            formRef={formRef}
            onChange={onValuesChange}
            onFinish={onFinish}
            formGroupReq={columnsReq}
            request={dataRequest}
            disabled={isFormDisabled}
            details={isDetails}
          />
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
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
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
            title="🚀 表单数据提交预览"
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
    </div>
  );
};
