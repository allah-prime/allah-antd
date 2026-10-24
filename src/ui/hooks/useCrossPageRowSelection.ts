import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRequest } from 'ahooks';

interface UseCrossPageRowSelectionProps<T> {
  fetchAllKeys?: () => Promise<React.Key[]>;
  params?: { [key: string]: any };
  rowKey?: keyof T;
  targetKey?: keyof T;
  initialSelectedKeys?: React.Key[];
}

function useCrossPageRowSelection<T extends { [key: string]: any }>({
  fetchAllKeys,
  params,
  rowKey = 'id',
  targetKey,
  initialSelectedKeys = []
}: UseCrossPageRowSelectionProps<T>) {
  const [allRowKeys, setAllRowKeys] = useState<React.Key[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(initialSelectedKeys);
  const [selectedTargetKeyMap, setSelectedTargetKeyMap] = useState<Record<string, React.Key>>({});

  const getAllKeysReq = fetchAllKeys
    ? useRequest(() => fetchAllKeys(), {
        manual: true,
        onSuccess: (res) => {
          setAllRowKeys(res);
        }
      })
    : undefined;

  useEffect(() => {
    if (fetchAllKeys && getAllKeysReq) {
      getAllKeysReq.run();
    }
  }, [params]);

  useEffect(() => {
    setSelectedRowKeys((prev) => prev.filter((k) => allRowKeys.includes(k)));
  }, [allRowKeys]);

  useEffect(() => {
    if (!targetKey) {
      return;
    }
    const selectedKeySet = new Set(selectedRowKeys.map((key) => String(key)));
    setSelectedTargetKeyMap((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([key]) => selectedKeySet.has(key)))
    );
  }, [selectedRowKeys, targetKey]);

  const syncTargetKeyMap = (records: T[], selected: boolean) => {
    if (!targetKey) {
      return;
    }
    setSelectedTargetKeyMap((prev) => {
      const nextValues = { ...prev };
      records.forEach((item) => {
        const sourceKey = item[rowKey];
        const mappedKey = item[targetKey];
        if (selected && mappedKey !== undefined && mappedKey !== null) {
          nextValues[String(sourceKey)] = mappedKey;
          return;
        }
        delete nextValues[String(sourceKey)];
      });
      return nextValues;
    });
  };

  const selectAll = useCallback(() => {
    setSelectedRowKeys(allRowKeys);
  }, [allRowKeys]);

  const clearAll = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedTargetKeyMap({});
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onSelect: (record: T, selected: boolean) => {
      const key = record[rowKey];
      if (selected) {
        setSelectedRowKeys((prev) => [...prev, key]);
      } else {
        setSelectedRowKeys((prev) => prev.filter((k) => k !== key));
      }
      syncTargetKeyMap([record], selected);
    },
    onSelectAll: (selected: boolean, _selectedRows: T[], changeRows: T[]) => {
      const changeKeys = changeRows.map((row) => row[rowKey]);
      if (selected) {
        setSelectedRowKeys((prev) => Array.from(new Set([...prev, ...changeKeys])));
      } else {
        setSelectedRowKeys((prev) => prev.filter((k) => !changeKeys.includes(k as any)));
      }
      syncTargetKeyMap(changeRows, selected);
    },
    selections: false
  };

  const mappedSelectedKeys = useMemo(
    () => (targetKey ? Array.from(new Set(Object.values(selectedTargetKeyMap))) : selectedRowKeys),
    [targetKey, selectedRowKeys, selectedTargetKeyMap]
  );

  return {
    rowSelection,
    selectedRowKeys,
    mappedSelectedKeys,
    setSelectedRowKeys,
    selectAll,
    clearAll,
    allRowKeys
  };
}

export default useCrossPageRowSelection;
