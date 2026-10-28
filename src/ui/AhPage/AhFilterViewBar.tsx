import { CheckOutlined, DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Popover, message } from 'antd';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { IAhFilterView, IAhFilterViewsConfig } from '../ahAntdTypes';
import './filterBar.less';

const STORAGE_PREFIX = 'ah-page-views:';

type IStored = { views: IAhFilterView[]; activeId?: string };

const readStorage = (key: string): IStored => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as IStored;
      return { views: parsed.views ?? [], activeId: parsed.activeId };
    }
  } catch {
    // 存储不可用或数据损坏：当作空
  }
  return { views: [] };
};

const writeStorage = (key: string, data: IStored) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // 忽略写入失败（隐私模式/配额）
  }
};

/**
 * 筛选视图状态：默认 localStorage，传入 config.views 则受控。
 */
export function useFilterViews(config?: IAhFilterViewsConfig | false, autoEnable = false) {
  const enabled = config !== false && (config !== undefined || autoEnable);
  const cfg: IAhFilterViewsConfig = config || {};
  const controlled = enabled && cfg.views !== undefined;
  const storageKey =
    STORAGE_PREFIX +
    (cfg.storageKey ?? (typeof window === 'undefined' ? '' : window.location.pathname));

  const [stored, setStored] = useState<IStored>(() =>
    enabled && !controlled && typeof window !== 'undefined' ? readStorage(storageKey) : { views: [] }
  );

  const views = controlled ? cfg.views! : stored.views;
  const rawActiveId = cfg.activeViewId !== undefined ? cfg.activeViewId : stored.activeId;
  const activeId = views.some((v) => v.id === rawActiveId) ? rawActiveId : undefined;
  const activeView = views.find((v) => v.id === activeId);

  useEffect(() => {
    if (enabled && !controlled) {
      writeStorage(storageKey, stored);
    }
  }, [stored, enabled, controlled, storageKey]);

  const save = useCallback(
    (view: IAhFilterView) => {
      cfg.onSave?.(view);
      if (!controlled) {
        setStored((prev) => {
          const exists = prev.views.some((v) => v.id === view.id);
          return {
            views: exists
              ? prev.views.map((v) => (v.id === view.id ? view : v))
              : [...prev.views, view],
            activeId: prev.activeId
          };
        });
      }
    },
    [cfg.onSave, controlled]
  );

  const remove = useCallback(
    (id: string) => {
      cfg.onDelete?.(id);
      if (!controlled) {
        setStored((prev) => ({
          views: prev.views.filter((v) => v.id !== id),
          activeId: prev.activeId === id ? undefined : prev.activeId
        }));
      }
    },
    [cfg.onDelete, controlled]
  );

  const select = useCallback(
    (id?: string) => {
      cfg.onSelect?.(id);
      if (!controlled) {
        setStored((prev) => ({ ...prev, activeId: id }));
      }
    },
    [cfg.onSelect, controlled]
  );

  return { enabled, views, activeId, activeView, save, remove, select };
}

type IAhFilterViewBarProps = {
  views: IAhFilterView[];
  activeId?: string;
  defaultViewName?: string;
  /** 当前筛选相对所选视图是否有变更 */
  dirty: boolean;
  /** 是否显示「清除变更」 */
  showClear?: boolean;
  /** 保存为新视图：返回 false 表示保存失败 */
  onCreate: (name: string) => void;
  onUpdate: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id?: string) => void;
  onClear: () => void;
};

/**
 * 筛选视图栏：视图下拉 / 保存为新视图 / 更新当前视图 / 清除变更（即重置）
 */
const AhFilterViewBar = ({
  views,
  activeId,
  defaultViewName = '全部',
  dirty,
  showClear = true,
  onCreate,
  onUpdate,
  onRename,
  onDelete,
  onSelect,
  onClear
}: IAhFilterViewBarProps) => {
  const [listOpen, setListOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState('');
  const [renameId, setRenameId] = useState<string | undefined>(undefined);
  const [renameValue, setRenameValue] = useState('');

  const activeName = useMemo(
    () => views.find((v) => v.id === activeId)?.name ?? defaultViewName,
    [views, activeId, defaultViewName]
  );

  const submitCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      message.warning('请输入视图名称');
      return;
    }
    onCreate(trimmed);
    setName('');
    setSaveOpen(false);
  };

  const submitRename = () => {
    const trimmed = renameValue.trim();
    if (renameId && trimmed) {
      onRename(renameId, trimmed);
    }
    setRenameId(undefined);
  };

  const listContent = (
    <div className="ah-view-list">
      <div
        className={`ah-view-item${activeId === undefined ? ' ah-view-item-active' : ''}`}
        onClick={() => {
          onSelect(undefined);
          setListOpen(false);
        }}
      >
        <span className="ah-view-item-name">{defaultViewName}</span>
        {activeId === undefined && <CheckOutlined />}
      </div>
      {views.map((view) => (
        <div
          key={view.id}
          className={`ah-view-item${activeId === view.id ? ' ah-view-item-active' : ''}`}
          onClick={() => {
            if (renameId === view.id) {
              return;
            }
            onSelect(view.id);
            setListOpen(false);
          }}
        >
          {renameId === view.id ? (
            <Input
              size="small"
              autoFocus
              value={renameValue}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setRenameValue(e.target.value)}
              onPressEnter={submitRename}
              onBlur={submitRename}
            />
          ) : (
            <span className="ah-view-item-name">{view.name}</span>
          )}
          <span className="ah-view-item-actions" onClick={(e) => e.stopPropagation()}>
            <EditOutlined
              aria-label="重命名视图"
              onClick={() => {
                setRenameId(view.id);
                setRenameValue(view.name);
              }}
            />
            <DeleteOutlined aria-label="删除视图" onClick={() => onDelete(view.id)} />
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Popover
        trigger="click"
        placement="bottomLeft"
        arrow={false}
        open={listOpen}
        onOpenChange={setListOpen}
        content={listContent}
      >
        <button type="button" className="ah-view-title" aria-label="切换筛选视图">
          <span>{activeName}</span>
          <DownOutlined className="ah-view-title-caret" />
        </button>
      </Popover>
      <Popover
        trigger="click"
        placement="bottomLeft"
        open={saveOpen}
        onOpenChange={setSaveOpen}
        content={
          <div className="ah-view-save">
            <Input
              autoFocus
              placeholder="视图名称"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onPressEnter={submitCreate}
            />
            <Button type="primary" onClick={submitCreate}>
              保存
            </Button>
          </div>
        }
      >
        <Button size="small">保存为新视图</Button>
      </Popover>
      {activeId !== undefined && dirty && (
        <Button size="small" onClick={onUpdate}>
          更新当前视图
        </Button>
      )}
      {showClear && dirty && (
        <Button size="small" onClick={onClear}>
          清除变更
        </Button>
      )}
    </>
  );
};

type IAhFilterHeaderBarProps = {
  /** 功能名称，显示在视图名称左侧 */
  title?: ReactNode;
  /** 功能解释，显示在视图栏右侧 */
  description?: ReactNode;
  /** 自定义右侧渲染，位于描述之后 */
  rightRender?: () => ReactNode;
  /** 视图控件（AhFilterViewBar），无视图时可不传 */
  children?: ReactNode;
};

/**
 * 头部顶栏：[功能名称][视图控件 ...] ……… [功能描述][自定义右侧]
 */
export const AhFilterHeaderBar = ({ title, description, rightRender, children }: IAhFilterHeaderBarProps) => {
  const right = rightRender?.();
  return (
    <div className="ah-view-bar">
      {title && <div className="ah-view-bar-title">{title}</div>}
      {children}
      {(description || right) && (
        <div className="ah-view-bar-aside">
          {description && <span className="ah-view-bar-desc">{description}</span>}
          {right}
        </div>
      )}
    </div>
  );
};

export default AhFilterViewBar;
