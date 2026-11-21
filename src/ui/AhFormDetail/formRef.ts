import type { FormInstance } from 'antd';
import type { IAhFormRef } from './types';

/** 把表单实例写入 formRef（回调 ref 与对象 ref 都支持） */
export function assignFormRef(ref: IAhFormRef | undefined, value: FormInstance | undefined): void {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  (ref as { current: FormInstance | null | undefined }).current = value;
}

/** 读取 formRef 当前持有的表单实例 */
export function readFormRef(ref: IAhFormRef | undefined): FormInstance | undefined {
  if (!ref || typeof ref === 'function') return undefined;
  return ref.current ?? undefined;
}

/**
 * 校验整张表单。通过返回整份值；校验失败返回 `undefined`（错误已显示在字段上，
 * 调用方直接 return 即可），非校验类异常照常抛出。
 *
 * @example
 * const values = await validateForm<Head>(formRef);
 * if (!values) return;
 */
export async function validateForm<V = Record<string, unknown>>(
  ref: IAhFormRef | undefined
): Promise<V | undefined> {
  const form = readFormRef(ref);
  if (!form) return undefined;
  try {
    return (await form.validateFields()) as V;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'errorFields' in error) {
      return undefined;
    }
    throw error;
  }
}
