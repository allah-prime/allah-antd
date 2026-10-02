import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Checkbox, Button, Tooltip, Spin, Tag, Input, Space } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import type { IAntTreeNode } from '../../theling-utils/@types/IZlData';

export interface SelectedDisplayItem {
  label: string;
  value: string;
  treeIds?: string[]; // 可选，保存原始 treeIds
  text?: string; // 原始 other.text
  other?: any;
}

export interface ITreeSelectProps {
  value?: string[];
  onChange?: (
    value: string[],
    selectedDisplay: SelectedDisplayItem[],
    extra?: {
      added: SelectedDisplayItem[];
      removed: SelectedDisplayItem[];
    }
  ) => void;
  request: (parentId?: string) => Promise<IAntTreeNode[]>;
  defValReq?: () => Promise<any[]>; // 你提供的 defValReq 返回的是复杂对象数组
  maxSelect?: number;
}

const TreeSelect: React.FC<ITreeSelectProps> = ({
  value = [],
  onChange,
  request,
  defValReq,
  maxSelect
}) => {
  // -------------------- 基础状态 --------------------
  const [treeData, setTreeData] = useState<IAntTreeNode[]>([]); // 树数据（由 request 提供）
  const [path, setPath] = useState<IAntTreeNode[]>([]); // 当前层级路径（用于面包屑）
  const [open, setOpen] = useState(false); // 弹窗是否打开
  const [loading, setLoading] = useState(false); // 异步加载状态（用于当前列表加载）
  const [search, setSearch] = useState(''); // 搜索关键字
  const leafCache = useRef<Map<string, string[]>>(new Map()); // 缓存节点到其叶子列表
  const [checkedValues, setCheckedValues] = useState<Set<string>>(new Set(value)); // 当前选中集合

  // -------------------- defVal 缓存 --------------------
  // 存放 defValReq 解析得到的默认展示项（来自 other.text & other.treeIds）
  const defaultDisplaysRef = useRef<SelectedDisplayItem[]>([]);
  // 标记是否已加载过 defVal（避免重复处理）
  const hasLoadedDefVal = useRef(false);

  // 计算由 defVal 带来的半选状态（针对未加载子级的父节点）
  const halfCheckedFromDef = useMemo(() => {
    const set = new Set<string>();
    defaultDisplaysRef.current.forEach((item) => {
      if (checkedValues.has(item.value) && item.treeIds) {
        item.treeIds.forEach((id) => {
          if (id !== item.value) {
            set.add(id);
          }
        });
      }
    });
    return set;
  }, [checkedValues]);

  // -------------------- 工具函数 --------------------
  /** 收集叶子节点（基于已存在的 treeData 结构） */
  const collectLeafValues = (node: IAntTreeNode): string[] => {
    if (leafCache.current.has(node.value)) return leafCache.current.get(node.value)!;
    if (node.isLeaf || !node.children || node.children.length === 0) {
      leafCache.current.set(node.value, [node.value]);
      return [node.value];
    }
    const res = node.children.flatMap(collectLeafValues);
    leafCache.current.set(node.value, res);
    return res;
  };

  /** 查找节点 */
  const findNode = (nodes: IAntTreeNode[], value: string): IAntTreeNode | undefined => {
    for (const n of nodes) {
      if (n.value === value) return n;
      if (n.children) {
        const res = findNode(n.children, value);
        if (res) return res;
      }
    }
    return undefined;
  };

  /** 通过 treeData 生成展示（仅基于树结构，可能找不到 defVal 中的未加载节点） */
  const computeSelectedDisplayFromTree = (vals: Set<string>): SelectedDisplayItem[] => {
    const result: SelectedDisplayItem[] = [];
    const dfs = (nodes: IAntTreeNode[], prefix: string[]) => {
      nodes.forEach((n) => {
        const currentPath = [...prefix, n.label];
        if (vals.has(n.value)) {
          result.push({ label: currentPath.join('/'), value: n.value, other: n.other });
        } else if (n.children) {
          // @ts-ignore
          dfs(n.children, currentPath);
        }
      });
    };
    dfs(treeData, []);
    return result;
  };

  /** 合并 tree 上的展示与 defVal 展示（避免重复） */
  const getMergedSelectedDisplay = (vals: Set<string>) => {
    const fromTree = computeSelectedDisplayFromTree(vals);
    const fromTreeValues = new Set(fromTree.map((i) => i.value));
    // defVal 中可能包含尚未加载到 tree 的项，保证只加入 checked 的那些
    // 关键修正：如果某个 defVal 的 ID 已经被“隐含”在 fromTree 的某个父级节点中（即父级被选中了），
    // 那么就不应该再单独显示这个子节点了。
    // fromTree 中包含的是所有被选中的节点（包括父节点）。
    // 如果 defVal 的 item.treeIds 中包含了 fromTree 中的任意一个 value，说明它的父级（或祖先）已经被选中并在 tree 中展示了。
    const fromDef = defaultDisplaysRef.current.filter((d) => {
      // 1. 必须是选中的
      if (!vals.has(d.value)) return false;
      // 2. 如果 tree 已经直接展示了这个值，跳过
      if (fromTreeValues.has(d.value)) return false;
      // 3. 如果它的任意祖先（treeIds）在 fromTreeValues 里，说明父级已被选中（折叠展示了），跳过
      if (d.treeIds && d.treeIds.some((ancestorId) => fromTreeValues.has(ancestorId))) {
        return false;
      }
      return true;
    });
    // 先 tree 上的、再 defVal 补充（顺序不是关键）
    return [...fromTree, ...fromDef];
  };

  /** 帮助判断某个 value 是否来源于 defVal（用于 onChange 中判断哪些 value 是已知叶子） */
  const isInDefaultDisplays = (v: string) => {
    return defaultDisplaysRef.current.some((d) => d.value === v);
  };

  // -------------------- 异步加载节点 --------------------
  const loadNodes = async (parent?: IAntTreeNode) => {
    if (!request) return [];
    setLoading(true);
    try {
      const data = await request(parent?.value);
      // 标准化：确保 children 字段为数组或 null，保留 other 字段
      const normalized = data?.map((d: any) => ({
        label: d.label ?? d.title,
        value: d.value ?? d.key,
        children: d.children ?? null,
        isLeaf: d.isLeaf ?? false,
        disabled: d.disabled ?? false,
        other: d.other ?? d
      })) as IAntTreeNode[];

      if (parent) {
        // 结构变化，清除缓存
        leafCache.current.clear();

        // 把加载到的子节点赋回 parent（注意：这里直接改 parent 引用并触发 setTreeData）
        parent.children = normalized.length ? normalized : [];
        if (!parent.children || parent.children.length === 0) parent.isLeaf = true;
        parent.children?.forEach((c) => collectLeafValues(c));
        // trigger react rerender: 因为 parent 是引用，浅拷贝触发
        setTreeData((prev) => [...prev]);

        // 如果父级在 checked 中，已经选中了父级，那么加载子级后应同步选中子节点（如你期望的行为）
        if (checkedValues.has(parent.value)) {
          const newChecked = new Set(checkedValues);
          parent.children?.forEach((c) => newChecked.add(c.value));
          updateParentStatus(treeData, newChecked);
          setCheckedValues(newChecked);
          // 回调外部（只包含已知叶子或 defVal 中的叶子）
          triggerChange(newChecked);
        }
      } else {
        // 结构变化，清除缓存
        leafCache.current.clear();
        // 顶层数据
        setTreeData(normalized || []);
        normalized?.forEach((c) => collectLeafValues(c));
      }
      return normalized || [];
    } finally {
      setLoading(false);
    }
  };

  // -------------------- 初始默认值处理（只解析 defValReq 的 other 字段，不合并树结构） --------------------
  useEffect(() => {
    if (hasLoadedDefVal.current) return;
    if (!defValReq) return;

    let mounted = true;
    (async () => {
      try {
        const res = await defValReq();
        if (!mounted || !Array.isArray(res) || res.length === 0) return;

        const parsed: SelectedDisplayItem[] = res
          .map((it: any) => {
            const other = it.other ?? {};
            const treeIds: string[] = Array.isArray(other.treeIds)
              ? other.treeIds
              : it.treeIds || [];
            const text: string = typeof other.text === 'string' ? other.text : it.text || '';
            const leafValue = treeIds && treeIds.length ? treeIds[0] : (it.value ?? it.id);
            const parts = text
              ? text
                  .split(';')
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : [];
            const label =
              parts.length > 1 ? parts.slice(1).join('/') : (parts[0] ?? it.label ?? '');
            return {
              label,
              value: leafValue,
              treeIds,
              text,
              other: it
            } as SelectedDisplayItem;
          })
          .filter((p: SelectedDisplayItem) => p.value);

        defaultDisplaysRef.current = parsed;

        setCheckedValues((prev) => {
          const next = new Set(prev);
          parsed.forEach((p) => next.add(p.value));

          // --- 新增：默认值加载完成后，主动触发 onChange ---
          const prevOutValues = Array.from(prev).filter(
            (v) => leafCache.current.has(v) || isInDefaultDisplays(v)
          );
          const nextOutValues = Array.from(next).filter(
            (v) => leafCache.current.has(v) || isInDefaultDisplays(v)
          );
          const prevOutSet = new Set(prevOutValues);
          const nextOutSet = new Set(nextOutValues);

          const addedIds = nextOutValues.filter((v) => !prevOutSet.has(v));
          const removedIds = prevOutValues.filter((v) => !nextOutSet.has(v));

          const addedDisplays = getMergedSelectedDisplay(new Set(addedIds));
          const removedDisplays = getMergedSelectedDisplay(new Set(removedIds));

          onChange?.(nextOutValues, getMergedSelectedDisplay(next), {
            added: addedDisplays,
            removed: removedDisplays
          });

          return next;
        });

        hasLoadedDefVal.current = true;
      } catch (e) {
        console.error('defValReq error', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // -------------------- 打开弹窗加载顶层（保证 request 一定会执行） --------------------
  useEffect(() => {
    if (open && treeData.length === 0) {
      loadNodes(); // 一定加载顶层
    }
  }, [open]);

  // -------------------- 父子选中状态更新（递归更新父级选中状态） --------------------
  const updateParentStatus = (nodes: IAntTreeNode[], checkedSet: Set<string>) => {
    nodes.forEach((n) => {
      if (n.children) {
        updateParentStatus(n.children, checkedSet);
        const childrenLeaves = n.children.flatMap(collectLeafValues);
        // 若子节点的所有叶子都被选中，则选中父节点
        if (childrenLeaves.length > 0 && childrenLeaves.every((v) => checkedSet.has(v))) {
          checkedSet.add(n.value);
        } else {
          // 子级部分/全未选 → 父级取消（不做半选的值保存，因为 UI 用 indeterminate 显示）
          checkedSet.delete(n.value);
        }
      }
    });
  };

  // -------------------- 选中逻辑 --------------------
  const triggerChange = (newChecked: Set<string>, prevChecked: Set<string> = checkedValues) => {
    // 1. Calculate previous output values
    const prevOutValues = Array.from(prevChecked).filter(
      (v) => leafCache.current.has(v) || isInDefaultDisplays(v)
    );
    const prevOutSet = new Set(prevOutValues);

    // 2. Calculate next output values
    const nextOutValues = Array.from(newChecked).filter(
      (v) => leafCache.current.has(v) || isInDefaultDisplays(v)
    );
    const nextOutSet = new Set(nextOutValues);

    // 3. Diff
    const addedIds = nextOutValues.filter((v) => !prevOutSet.has(v));
    const removedIds = prevOutValues.filter((v) => !nextOutSet.has(v));

    // 4. Get display items for diff
    const addedDisplays = getMergedSelectedDisplay(new Set(addedIds));
    const removedDisplays = getMergedSelectedDisplay(new Set(removedIds));

    onChange?.(nextOutValues, getMergedSelectedDisplay(newChecked), {
      added: addedDisplays,
      removed: removedDisplays
    });
  };

  const handleCheck = (node: IAntTreeNode) => {
    const newChecked = new Set(checkedValues);

    if (newChecked.has(node.value)) {
      // 取消父级：删除该节点本身
      newChecked.delete(node.value);
      // 同时删除所有已加载的子叶子
      const leafValues = collectLeafValues(node);
      leafValues.forEach((v) => newChecked.delete(v));
      // 同时删除相关的 defVal 选中项（如果该父级包含了 defVal 中的项）
      // 遍历所有 defaultDisplays，如果其 treeIds 包含当前 node.value，说明该 defVal 属于此父级下的子孙
      defaultDisplaysRef.current.forEach((d) => {
        if (d.treeIds && d.treeIds.includes(node.value)) {
          newChecked.delete(d.value);
        }
        // 尝试2：如果 d.value 本身就是这个 node.value（比如 defVal 本身就是一个父节点，虽然比较少见）
        if (d.value === node.value) {
          newChecked.delete(d.value);
        }
        // 尝试3：如果这个 node 是父级，我们需要把它的所有子孙（包括还没加载到 treeData 但存在于 defVal 中的）都删掉
        // 但是 treeData 里可能还没这个结构。
        // 我们只能依赖 d.treeIds。如果 d.treeIds 里包含了当前取消的 node.value，那说明这个 d 是 node 的后代。
        // 上面的 d.treeIds.includes(node.value) 逻辑应该是对的。
        //
        // 但有一种情况：默认值就是“调味料/辣椒”，它的 value 是“辣椒”的 ID。
        // 它的 treeIds 是 [调味料ID, 辣椒ID]。
        // 当我们取消“调味料”时，node.value 是“调味料ID”。
        // d.treeIds 确实包含“调味料ID”。所以 d.value (辣椒ID) 应该被删掉。
      });
    } else {
      // 选中父级 + 已加载子级
      newChecked.add(node.value);
      node.children?.forEach((c) => newChecked.add(c.value));
    }

    // 递归更新父节点选中状态
    updateParentStatus(treeData, newChecked);

    // 限制最大选择数
    if (maxSelect && newChecked.size > maxSelect) return;

    setCheckedValues(newChecked);

    // 触发回调
    triggerChange(newChecked);
  };

  // -------------------- 展开下级 --------------------
  const handleSelect = async (node: IAntTreeNode, level: number) => {
    if (!node.children && !node.isLeaf) {
      await loadNodes(node);
    }
    setPath((prev) => [...prev.slice(0, level), node]);
  };

  // -------------------- 删除 Tag（支持 defVal 中的项） --------------------
  const handleRemoveTag = (itemValue: string) => {
    const node = findNode(treeData, itemValue);
    const leafValues = node ? collectLeafValues(node) : [itemValue];
    const newChecked = new Set(checkedValues);
    leafValues.forEach((v) => newChecked.delete(v));
    // 同时删除该具体 value（保证 defVal 单独 value 也能被移除）
    newChecked.delete(itemValue);

    // 如果要同时移除 defaultDisplays 中对应项，则不必修改 defaultDisplaysRef（只是控制选中即可）
    updateParentStatus(treeData, newChecked);
    setCheckedValues(newChecked);
    triggerChange(newChecked);
  };

  // -------------------- 当前列表 --------------------
  const currentList = useMemo(() => {
    if (search) {
      const res: IAntTreeNode[] = [];
      const dfsSearch = (nodes: IAntTreeNode[]) => {
        nodes.forEach((n) => {
          // @ts-ignore
          if (n.label.includes(search)) res.push(n);
          if (n.children) dfsSearch(n.children);
        });
      };
      dfsSearch(treeData);
      return res;
    }
    if (!path.length) return treeData;
    return path[path.length - 1].children || [];
  }, [treeData, path, search]);

  // -------------------- Tag 列表渲染数据（合并 tree 与 defVal） --------------------
  const mergedSelectedDisplayForRender = useMemo(() => {
    return getMergedSelectedDisplay(checkedValues);
  }, [treeData, checkedValues, defaultDisplaysRef.current]);

  // -------------------- 渲染 --------------------
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Space wrap size={[8, 8]}>
        {mergedSelectedDisplayForRender.map((item) => (
          <Tag
            key={item.value}
            closable
            color={item.other?.other?.color || item.other?.color || '#1E40AF'}
            onClose={(e) => {
              e.preventDefault();
              handleRemoveTag(item.value);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1px 10px',
              maxWidth: 120,
              marginRight: 0
            }}
          >
            <Tooltip title={item.label} placement="topLeft">
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </Tooltip>
          </Tag>
        ))}
        <Button type="dashed" onClick={() => setOpen((o) => !o)} size="small">
          {open ? (
            '完成'
          ) : (
            <>
              <PlusOutlined style={{ fontSize: 12 }} /> 选择
            </>
          )}
        </Button>
      </Space>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: 420,
            marginTop: 8,
            padding: 16,
            zIndex: 999,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 6px 20px rgba(15,23,42,0.12)',
            border: '1px solid #edf0f5'
          }}
        >
          {!search && (
            <div style={{ marginBottom: 8 }}>
              {[{ label: '经营内容', value: '' }, ...path].map((it: any, idx) => {
                return (
                  <span
                    key={it.label}
                    style={{ cursor: 'pointer', color: it.other?.color || '#1E40AF' }}
                    onClick={() => setPath(idx === 0 ? [] : path.slice(0, idx))}
                  >
                    {idx !== 0 ? ' > ' : ''}
                    {it.label}
                  </span>
                );
              })}
            </div>
          )}

          <Input
            placeholder="搜索..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={{ marginTop: 10, maxHeight: 300, overflow: 'auto' }}>
            {loading ? (
              <div style={{ padding: 64, textAlign: 'center' }}>
                <Spin />
              </div>
            ) : currentList.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
                {search ? '未搜索到相关标签' : '暂无标签数据'}
              </div>
            ) : (
              currentList.map((item) => {
                const checked = checkedValues.has(item.value);
                const indeterminate =
                  (!checked && halfCheckedFromDef.has(item.value)) ||
                  (!!item.children &&
                    item.children.some((c) => checkedValues.has(c.value)) &&
                    !item.children.every((c) => checkedValues.has(c.value)));

                return (
                  <div
                    key={item.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 6,
                      cursor: item.disabled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Checkbox
                      checked={checked}
                      indeterminate={indeterminate}
                      disabled={item.disabled}
                      onChange={() => handleCheck(item)}
                    >
                      <Tooltip title={item.label} placement="topLeft">
                        {item.label}
                      </Tooltip>
                    </Checkbox>

                    {!item.isLeaf && !search && (
                      <span
                        style={{
                          color: item.other?.color || '#1E40AF',
                          marginLeft: 'auto',
                          padding: 0,
                          fontSize: 12
                        }}
                        onClick={() => handleSelect(item, path.length)}
                      >
                        下级 <RightOutlined style={{ fontSize: 12 }} />
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TreeSelect);
