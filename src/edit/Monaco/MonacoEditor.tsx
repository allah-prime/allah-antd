import loader from '@monaco-editor/loader';
import type * as MonacoEditorApi from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { MonacoInstance, MonacoLoaderConfig } from './configMonaco';
import { ensureMonacoLoaderConfig } from './configMonaco';
import { getLanguageConfig } from './lgConfig';

type MonacoEditorInstance = MonacoEditorApi.editor.IStandaloneCodeEditor;
type MonacoChangeEvent = MonacoEditorApi.editor.IModelContentChangedEvent;

export type IMonacoEditorProps = {
  /** 语言类型，如 'javascript', 'typescript', 'json', 'html' 等 */
  language?: string;
  /** 编辑器内容（受控模式） */
  value?: string;
  /** 初始默认值（非受控模式） */
  defaultValue?: string;
  /** 编辑器宽度 */
  width?: number | string;
  /** 编辑器高度 */
  height?: number | string;
  /** 自定义样式类名 */
  className?: string;
  /** 编辑器主题，如 'vs', 'vs-dark', 'hc-black' */
  theme?: string;
  /** 加载中显示的内容 */
  loading?: React.ReactNode;
  /** Monaco 编辑器配置选项 */
  options?: MonacoEditorApi.editor.IStandaloneEditorConstructionOptions;
  /** 内容变化回调 */
  onChange?: (value: string | undefined, event: MonacoChangeEvent) => void;
  /** 编辑器挂载完成回调 */
  onMount?: (editor: MonacoEditorInstance, monaco: MonacoInstance) => void;
  /** Monaco 加载完成但编辑器未创建时的回调 */
  beforeMount?: (monaco: MonacoInstance) => void;
  /** 内容变化回调（简化版） */
  onValueChange?: (value: string | undefined) => void;
  /** Monaco loader 配置 */
  loaderConfig?: MonacoLoaderConfig;
  /** 是否有边框 */
  border?: boolean;
};
const DEFAULT_EDITOR_OPTIONS: MonacoEditorApi.editor.IStandaloneEditorConstructionOptions = {
  minimap: {
    enabled: false
  },
  wordWrap: 'on',
  formatOnType: true,
  formatOnPaste: true,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true
};

const EMPTY_EDITOR_OPTIONS: MonacoEditorApi.editor.IStandaloneEditorConstructionOptions = {};

/**
 * 统一的 Monaco 编辑器组件
 * 支持通过 language 参数配置不同的语言模式
 * @param language - 语言类型，可选，默认为 'text'
 */
const MonacoEditor: React.FC<IMonacoEditorProps> = ({
  language = 'text',
  value,
  defaultValue,
  onChange,
  onMount,
  beforeMount,
  width = '100%',
  height = 200,
  className,
  theme,
  loading = 'Loading...',
  options,
  onValueChange,
  loaderConfig,
  border = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const monacoRef = useRef<MonacoInstance | null>(null);
  const modelRef = useRef<MonacoEditorApi.editor.ITextModel | null>(null);
  const isApplyingValueRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const onValueChangeRef = useRef(onValueChange);
  const onMountRef = useRef(onMount);
  const beforeMountRef = useRef(beforeMount);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  ensureMonacoLoaderConfig(loaderConfig);
  const config = getLanguageConfig(language);
  const editorOptions = options || EMPTY_EDITOR_OPTIONS;
  const mergedOptions = useMemo(
    () => ({
      ...DEFAULT_EDITOR_OPTIONS,
      ...config.options,
      ...editorOptions
    }),
    [config.options, editorOptions]
  );
  const resolvedTheme = theme || config.theme;

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    onMountRef.current = onMount;
  }, [onMount]);

  useEffect(() => {
    beforeMountRef.current = beforeMount;
  }, [beforeMount]);

  useEffect(() => {
    let disposed = false;
    let changeDisposable: MonacoEditorApi.IDisposable | null = null;

    const mountEditor = async () => {
      if (!containerRef.current) {
        return;
      }

      try {
        setLoadError(null);
        setIsReady(false);
        const monacoInstance = await loader.init();

        if (disposed || !containerRef.current) {
          return;
        }

        monacoRef.current = monacoInstance;
        beforeMountRef.current?.(monacoInstance);
        monacoInstance.editor.setTheme(resolvedTheme);

        const initialValue = value ?? defaultValue ?? config.defaultValue;
        const model = monacoInstance.editor.createModel(initialValue, config.id);
        modelRef.current = model;

        const editor = monacoInstance.editor.create(containerRef.current, {
          ...mergedOptions,
          model
        });

        editorRef.current = editor;
        changeDisposable = editor.onDidChangeModelContent((event) => {
          if (isApplyingValueRef.current) {
            return;
          }

          const nextValue = editor.getValue();
          onChangeRef.current?.(nextValue, event);
          onValueChangeRef.current?.(nextValue);
        });

        try {
          config.onMount?.(editor, monacoInstance);
          onMountRef.current?.(editor, monacoInstance);
          setIsReady(true);
        } catch (error) {
          console.error('[MonacoEditor] native mount failed', error);
          setLoadError(error instanceof Error ? error.message : 'Monaco 初始化失败');
          setIsReady(false);
        }
      } catch (error) {
        console.error('[MonacoEditor] native loader init failed', error);
        setLoadError(error instanceof Error ? error.message : 'Monaco 资源加载失败');
        setIsReady(false);
      }
    };

    mountEditor();

    return () => {
      disposed = true;
      changeDisposable?.dispose();
      editorRef.current?.dispose();
      modelRef.current?.dispose();
      editorRef.current = null;
      modelRef.current = null;
      monacoRef.current = null;
      setIsReady(false);
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) {
      return;
    }

    monacoRef.current.editor.setTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    editorRef.current?.updateOptions(mergedOptions);
  }, [mergedOptions]);

  useEffect(() => {
    const model = modelRef.current;

    if (!model) {
      return;
    }

    const nextLanguage = config.id;

    if (model.getLanguageId() !== nextLanguage && monacoRef.current) {
      monacoRef.current.editor.setModelLanguage(model, nextLanguage);
    }
  }, [config.id]);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor || value === undefined) {
      return;
    }

    if (editor.getValue() === value) {
      return;
    }

    isApplyingValueRef.current = true;
    editor.setValue(value);
    isApplyingValueRef.current = false;
  }, [value]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        border: border ? '1px solid #e0e0e0' : 'none'
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: loadError ? 'none' : 'block'
        }}
      />
      {(loadError || !isReady) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff'
          }}
        >
          {loadError || loading}
        </div>
      )}
    </div>
  );
};

export default MonacoEditor;
