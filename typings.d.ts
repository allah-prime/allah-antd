declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.module.less';

interface Window {
  WebKitMutationObserver?: any;
  reloadAuthorized: () => void;
  AMap: any;
}

declare module '@theling/antd' {
  export * from 'antd';
  export * from '@ant-design/pro-components';
  // 添加你的自定义组件类型
  export interface ThelingProps {
    // 你的组件属性类型
  }
}
