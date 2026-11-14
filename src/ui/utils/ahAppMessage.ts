import type { MessageInstance } from 'antd/es/message/interface';
import AhAntdConfig from './AhAntdConfig';

function bindApi<T extends keyof MessageInstance>(
  api: MessageInstance,
  prop: T,
): MessageInstance[T] {
  const value = api[prop];
  return typeof value === 'function'
    ? (value as (...args: unknown[]) => unknown).bind(api) as MessageInstance[T]
    : value;
}

/** 使用 App.useApp() 注入的 message，避免 antd 静态 message 无法消费动态主题。 */
export const ahMessage = new Proxy({} as MessageInstance, {
  get(_target, prop) {
    const api = AhAntdConfig.getMessage();
    if (api) {
      return bindApi(api, prop as keyof MessageInstance);
    }
    console.warn('Message实例未初始化，请先调用setMessage方法');
    return () => undefined;
  },
});