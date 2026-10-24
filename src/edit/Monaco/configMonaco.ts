import loader from '@monaco-editor/loader';

const DEFAULT_MONACO_VS_PATH =
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.56.0/min/vs';
let currentLoaderConfigSignature = '';
let hasExplicitLoaderConfig = false;

/**
 * Monaco 编辑器的 loader 配置类型
 * 与 @monaco-editor/loader 的 loader.config 参数一致
 */
export interface MonacoLoaderConfig {
  /** 自定义 vs 资源路径，指向 monaco-editor 的 min/vs 目录 */
  paths?: {
    vs?: string;
  };
  /** 国际化语言，例如 'zh-cn' */
  'vs/nls'?: {
    availableLanguages?: Record<string, string>;
  };
  [key: string]: any;
}

export type MonacoInstance = Awaited<ReturnType<typeof loader.init>>;

function normalizeMonacoLoaderConfig(config?: MonacoLoaderConfig): MonacoLoaderConfig {
  return {
    ...config,
    paths: {
      vs: config?.paths?.vs || DEFAULT_MONACO_VS_PATH,
      ...config?.paths
    }
  };
}

function applyMonacoLoaderConfig(
  config: MonacoLoaderConfig | undefined,
  explicit: boolean
): MonacoLoaderConfig {
  if (!explicit && hasExplicitLoaderConfig && currentLoaderConfigSignature) {
    return JSON.parse(currentLoaderConfigSignature) as MonacoLoaderConfig;
  }

  const normalizedConfig = normalizeMonacoLoaderConfig(explicit ? config : undefined);
  const nextSignature = JSON.stringify(normalizedConfig);

  if (nextSignature !== currentLoaderConfigSignature) {
    loader.config(normalizedConfig);
    currentLoaderConfigSignature = nextSignature;
  }

  if (explicit) {
    hasExplicitLoaderConfig = true;
  }

  return normalizedConfig;
}

/**
 * 配置 Monaco 编辑器的 CDN 地址
 *
 * 默认使用 jsDelivr 外网 CDN，网络不稳定时可切换到自己的 CDN。
 * 建议在应用入口处（如 main.tsx / app.tsx）提前调用，确保在编辑器挂载前生效。
 *
 * @example
 * // 使用自定义 CDN（指向 monaco-editor 的 min/vs 目录）
 * configMonacoCDN('https://your-cdn.com/monaco-editor/0.56.0/min/vs');
 *
 * @example
 * // 使用完整 loader 配置
 * configMonacoLoader({
 *   paths: { vs: 'https://your-cdn.com/monaco-editor/0.56.0/min/vs' },
 * });
 */
export function configMonacoCDN(vsPath: string): void {
  applyMonacoLoaderConfig({ paths: { vs: vsPath } }, true);
}

/**
 * 使用完整的 loader 配置项来配置 Monaco 编辑器
 * 适合需要同时配置多个选项（如 CDN + 国际化）的场景
 *
 * @example
 * configMonacoLoader({
 *   paths: { vs: 'https://your-cdn.com/monaco-editor/0.56.0/min/vs' },
 *   'vs/nls': { availableLanguages: { '*': 'zh-cn' } },
 * });
 */
export function configMonacoLoader(config: MonacoLoaderConfig): void {
  applyMonacoLoaderConfig(config, true);
}

export function ensureMonacoLoaderConfig(config?: MonacoLoaderConfig): MonacoLoaderConfig {
  return applyMonacoLoaderConfig(config, config != null);
}
