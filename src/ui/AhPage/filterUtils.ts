import React from 'react';

/**
 * key 排序后的稳定 JSON 序列化。
 * 与 JSON.stringify 的差异：对象 key 顺序不影响结果，适合做参数比较的依赖。
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value && typeof value === 'object' && value.constructor === Object) {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortValue((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * 判断值是否为「空筛选值」：undefined / null / 空字符串 / 空数组。
 * false 与 0 是有效筛选值，不剔除。
 */
export function isEmptyFilterValue(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string' && value === '') {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  return false;
}

/**
 * 剔除空筛选值后的请求参数。
 * 空字符串、空数组不再发给后端；pageNum / pageSize 为数字不受影响。
 */
export function pickEffectiveParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  const result: Record<string, unknown> = {};
  if (!params) {
    return result as Partial<T>;
  }
  for (const key of Object.keys(params)) {
    const value = params[key];
    if (!isEmptyFilterValue(value)) {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

/**
 * 筛选参数写回 URL：保留不属于本次托管 key 的既有 query，再写入当前有效参数。
 * 值为对象（日期区间、sort）时 JSON 编码。
 */
export function writeUrlParams(params: Record<string, unknown>, keys?: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  const url = new URL(window.location.href);
  const payload = pickEffectiveParams(params ?? {});
  const managed = keys
    ? new Set(Object.keys(payload).filter((k) => keys.includes(k)))
    : new Set(Object.keys(payload));
  // 清掉上一次写入、本次已失效的托管 key（不碰非托管 key，如路由参数）
  for (const existingKey of Array.from(url.searchParams.keys())) {
    if (keys ? keys.includes(existingKey) : true) {
      url.searchParams.delete(existingKey);
    }
  }
  for (const key of managed) {
    url.searchParams.set(key, encodeUrlValue(payload[key]));
  }
  window.history.replaceState(window.history.state, '', url);
}

/** 从 URL query 还原筛选参数（数字还原为 number，对象 JSON 还原） */
export function readUrlParams(keys?: string[]): Record<string, unknown> {
  if (typeof window === 'undefined') {
    return {};
  }
  const search = new URLSearchParams(window.location.search);
  const result: Record<string, unknown> = {};
  for (const [key, raw] of search.entries()) {
    if (keys && !keys.includes(key)) {
      continue;
    }
    if (raw === '') {
      continue;
    }
    result[key] = decodeUrlValue(raw);
  }
  return result;
}

function encodeUrlValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

function decodeUrlValue(raw: string): unknown {
  if (
    (raw.startsWith('{') && raw.endsWith('}')) ||
    (raw.startsWith('[') && raw.endsWith(']'))
  ) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  if (raw !== '' && !Number.isNaN(Number(raw))) {
    return Number(raw);
  }
  return raw;
}

/**
 * 类型辅助：为筛选表单项绑定参数 key，编译期校验 name 必须属于 Filter 类型。
 *
 * ```tsx
 * type F = IBaseFilter & { store?: string };
 * searchForm={[createFilterItem<F>('store', <ProFormSelect name="store" options={...} />)]}
 * ```
 * 运行时会通过 cloneElement 把 name 注入元素（元素已带 name 时保持原值）。
 */
export function createFilterItem<F, K extends keyof F & string>(
  name: K,
  node: React.ReactNode
): React.ReactNode {
  if (React.isValidElement(node)) {
    return React.cloneElement(node as React.ReactElement<Record<string, unknown>>, {
      name: (node.props as Record<string, unknown>).name ?? name
    });
  }
  return node;
}
