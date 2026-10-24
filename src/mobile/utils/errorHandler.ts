import { Toast } from 'antd-mobile';

/**
 * 通用错误处理函数
 */
export const mbHandleError = (
  error: any,
  options: {
    defaultMessage?: string;
    duration?: number;
    logError?: boolean;
    showToast?: boolean;
  } = {}
): string => {
  const {
    defaultMessage = '操作失败，请重试',
    duration = 3000,
    logError = true,
    showToast = true
  } = options;

  if (logError) {
    console.error('Error handled:', error);
  }

  let errorMessage = defaultMessage;

  try {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      // 处理表单校验错误
      if (error.errorFields && Array.isArray(error.errorFields) && error.errorFields.length > 0) {
        const firstError = error.errorFields[0];
        if (firstError.errors && firstError.errors.length > 0) {
          errorMessage = firstError.errors[0];
        } else {
          errorMessage = '请检查表单填写是否完整';
        }
      }
      // 处理API错误响应
      else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.code) {
        const errorCodeMap: Record<string, string> = {
          NETWORK_ERROR: '网络连接异常，请检查网络后重试',
          TIMEOUT: '请求超时，请重试',
          VALIDATION_ERROR: '数据验证失败，请检查输入信息',
          UPLOAD_ERROR: '文件上传失败，请重试',
          PERMISSION_DENIED: '权限不足，请联系管理员',
          SERVER_ERROR: '服务器异常，请稍后重试',
          NOT_FOUND: '请求的资源不存在',
          UNAUTHORIZED: '登录已过期，请重新登录'
        };
        errorMessage = errorCodeMap[error.code] || '操作失败，请重试';
      }
    }
  } catch (parseError) {
    if (logError) {
      console.error('Error parsing failed:', parseError);
    }
    errorMessage = defaultMessage;
  }

  if (showToast) {
    Toast.show({
      icon: 'fail',
      content: errorMessage,
      duration
    });
  }

  return errorMessage;
};

/**
 * 表单提交错误处理
 */
export const mbHandleSubmitError = (
  error: any,
  options: Omit<Parameters<typeof mbHandleError>[1], 'defaultMessage'> & {
    defaultMessage?: string;
  } = {}
): string => {
  return mbHandleError(error, { defaultMessage: '提交失败，请重试', ...options });
};

/**
 * 网络请求错误处理
 */
export const mbHandleApiError = (
  error: any,
  options: Omit<Parameters<typeof mbHandleError>[1], 'defaultMessage'> & {
    defaultMessage?: string;
  } = {}
): string => {
  return mbHandleError(error, { defaultMessage: '请求失败，请重试', ...options });
};

export default mbHandleError;
