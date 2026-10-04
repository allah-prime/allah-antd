/**
 * 路由的参数
 */
export interface IRouteParams<T = any> {
  params: T;
  key: string;
  name: string;
  path?: string | undefined;
}

export type TCheckListValue = string | number;
