import {
  ProForm,
  ProFormDigit,
  ProFormItem,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import { Button, FormInstance, message, Typography } from 'antd';
import React, { useRef, useState } from 'react';
// 依赖需要安装
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios'; // 引入 axios 用于默认实现
import MonacoJson from '../Monaco/MonacoJson';

// ... (接口定义 ApiParam, ApiConfig, DebugPanelProps 保持不变) ...
export interface ApiParam {
  /** 参数位置 */
  in: 'path' | 'query' | 'body' | 'header';
  /** 参数名称 */
  name: string;
  /** 参数类型 */
  type: string;
  /** 是否必填 */
  required?: boolean;
  /** 参数描述 */
  description?: string;
}
export interface ApiConfig {
  /** API 路径 */
  path?: string;
  /** 请求方法 */
  method?: string;
}

type DebugValues = Record<string, unknown>;

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || '请求失败 (默认)';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error during debug';
};

const getErrorDetails = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data || error;
  }

  return error;
};

// --- Debug Function Type Definition ---
type DebugFunction = (
  debugValues: DebugValues,
  apiConfig: { url?: string; method?: string },
  paramDefinitions: ApiParam[]
) => Promise<unknown>;

// --- Default Debug Implementation (using axios) ---
const defaultDebugImplementation: DebugFunction = async (
  debugValues,
  apiConfig,
  _paramDefinitions // paramDefinitions 暂时未在默认实现中使用
) => {
  console.log('Using default Axios debugger with:', { debugValues, apiConfig });
  if (typeof axios === 'undefined') {
    message.error('Axios 未找到，无法使用默认调试器。请确保已安装 axios 或提供自定义 debug 函数。');
    throw new Error('Axios not found for default debugger.');
  }
  const loadingKey = 'defaultDebugApi';
  message.loading({ content: '正在请求 (默认)...', key: loadingKey });

  const config: AxiosRequestConfig = {
    method: apiConfig.method || 'GET',
    url: apiConfig.url,
    ...(apiConfig.method?.toUpperCase() === 'GET'
      ? { params: debugValues }
      : { data: debugValues }),
    timeout: 10000 // 默认超时 10 秒
  };

  try {
    const response = await axios(config);
    message.success({ content: '请求成功 (默认)！', key: loadingKey, duration: 2 });
    return response.data;
  } catch (error: unknown) {
    console.error('Default API Debug Error:', error);
    const errorMessage = getErrorMessage(error);
    // Ensure loading message is removed before showing error
    message.destroy(loadingKey);
    message.error({ content: `请求出错: ${errorMessage}`, key: loadingKey, duration: 3 });
    throw error; // Re-throw the original error structure if possible, or a new one
  }
};

// --- Component Props Interface (Corrected) ---
export interface DebugPanelProps {
  /** API 配置信息 */
  apiConfig: ApiConfig;
  /** API 参数定义列表 */
  paramDefinitions: ApiParam[];
  /**
   * (可选) 执行 API 调试的函数。
   * 如果未提供，将使用内置的 axios 实现。
   * @param debugValues 表单收集到的参数值
   * @param apiConfig 当前 API 的配置 (url, method)
   * @param paramDefinitions 参数定义列表
   * @returns Promise<any> API 的响应数据或在出错时 reject
   */
  debug?: DebugFunction; // <-- Correct: Optional function prop directly
  layout?: 'horizontal' | 'vertical';
}

/**
 * 一个用于 API 接口调试的面板组件。
 * 用户可以输入参数，点击运行测试，查看接口返回结果。
 */
const DebugPanel: React.FC<DebugPanelProps> = ({
  apiConfig,
  paramDefinitions,
  debug,
  layout = 'horizontal'
}) => {
  // ... (useState, useRef, handleDebug 逻辑保持不变) ...
  const [debugResult, setDebugResult] = useState<unknown>(undefined);
  const [debugging, setDebugging] = useState<boolean>(false);
  const debugFormRef = useRef<FormInstance>(undefined);

  // --- Determine the actual debug function to use ---
  const actualDebugFunction: DebugFunction = debug || defaultDebugImplementation;

  const handleDebug = async () => {
    setDebugging(true);
    setDebugResult(undefined);
    const loadingKey = debug ? 'customDebugApi' : 'defaultDebugApi'; // Determine loading key based on prop presence

    try {
      const debugValues = (await debugFormRef.current?.validateFields()) as DebugValues;

      if (!apiConfig?.path || !apiConfig?.method) {
        message.warning('缺少 API 路径或请求方法配置。');
        setDebugging(false);
        return;
      }

      const currentApiConfig = { url: apiConfig.path, method: apiConfig.method };
      const currentParamDefinitions: ApiParam[] = Array.isArray(paramDefinitions)
        ? paramDefinitions
        : [];

      // --- 转换 object 和 array 类型的参数为 JSON 对象 ---
      const processedDebugValues = { ...debugValues };
      currentParamDefinitions.forEach((param) => {
        const fieldValue = processedDebugValues[param.name];

        if (
          (param.type === 'object' || param.type === 'array') &&
          typeof fieldValue === 'string' &&
          fieldValue
        ) {
          try {
            processedDebugValues[param.name] = JSON.parse(fieldValue);
          } catch (error) {
            console.warn(`无法解析参数 ${param.name} 的 JSON:`, error);
            // 如果解析失败，保持原值，让后续验证处理
          }
        }
      });

      // --- 调用实际的调试函数 (传入的或默认的) ---
      const result = await actualDebugFunction(
        processedDebugValues,
        currentApiConfig,
        currentParamDefinitions
      );

      setDebugResult(result);
    } catch (error: unknown) {
      // 错误处理: 优先使用原始错误信息
      const errorMessage = getErrorMessage(error);
      const errorOutput = {
        success: false,
        error: errorMessage,
        details: getErrorDetails(error) // Include more details if available
      };
      setDebugResult(errorOutput);
      // 确保对应的 loading 消息被移除
      message.destroy(loadingKey);
      message.error(`调试失败: ${errorMessage}`);
    } finally {
      setDebugging(false);
    }
  };

  const renderDebugFields = (params: ApiParam[] = []) => {
    console.log('params', params);
    if (!params || params.length === 0) {
      return <Typography.Text type="secondary">暂无需要调试的参数</Typography.Text>;
    }

    return params.map((param) => {
      const fieldProps = {
        name: param.name,
        key: `${param.in}-${param.name}`,
        label: param.description || param.name,
        placeholder: `请输入 ${param.name}`,
        rules: [
          { required: param.required, message: `${param.description || param.name} 是必填项` }
        ]
      };

      switch (param.type) {
        case 'number':
        case 'integer':
          return <ProFormDigit {...fieldProps} />;
        case 'boolean':
          return (
            <ProFormItem {...fieldProps} valuePropName="checked" rules={[]}>
              <ProFormSwitch />
            </ProFormItem>
          );
        case 'object':
        case 'array':
          // 对于 object 和 array 类型使用 Editor 提供 JSON 输入
          return (
            <ProFormItem
              {...fieldProps}
              rules={[
                {
                  required: param.required,
                  message: `${param.description || param.name} 是必填项`
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    try {
                      JSON.parse(value);
                      return Promise.resolve();
                    } catch (error) {
                      return Promise.reject(new Error('请输入有效的 JSON 格式'));
                    }
                  }
                }
              ]}
            >
              <MonacoJson
                height={80}
                options={{
                  formatOnPaste: true,
                  formatOnType: true,
                  minimap: { enabled: false },
                  lineNumbers: 'off',
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false
                }}
                defaultValue={param.type === 'object' ? '{}' : '[]'}
              />
            </ProFormItem>
          );
        case 'string':
        default:
          return <ProFormText {...fieldProps} />;
      }
    });
  };

  // ... (return 部分保持不变) ...
  return (
    <div>
      <ProForm
        formRef={debugFormRef}
        submitter={false}
        layout={layout}
        style={{ flexShrink: 0 }}
        labelAlign="left"
      >
        {renderDebugFields(paramDefinitions || [])}
      </ProForm>
      <div>
        <Button
          type="primary"
          onClick={handleDebug}
          loading={debugging}
          style={{ marginTop: 8, marginBottom: 16, alignSelf: 'flex-start' }}
        >
          运行测试
        </Button>
      </div>
      <Typography.Text strong>返回结果:</Typography.Text>
      <div
        style={{
          flex: 1,
          marginTop: 8,
          border: '1px solid #d9d9d9',
          borderRadius: '2px',
          overflow: 'auto',
          backgroundColor: '#f5f5f5' // 添加背景色以便区分
        }}
      >
        {debugging ? (
          '正在请求...'
        ) : debugResult ? (
          <MonacoJson
            height={500}
            value={JSON.stringify(debugResult, null, 2)}
            options={{
              formatOnPaste: true,
              formatOnType: true,
              readOnly: true
            }}
          />
        ) : (
          '暂无结果'
        )}
      </div>
    </div>
  );
};

export default DebugPanel;
