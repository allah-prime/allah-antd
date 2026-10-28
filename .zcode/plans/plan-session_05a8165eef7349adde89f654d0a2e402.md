# AhPageContent 筛选功能全面修复方案

## 范围裁定（依据用户决策）
- 已分析的 17 项不足中：**标签回显不做**；**timeSearch 默认保持 true**（仅文档补使用建议）；其余全部修复。
- 设计原则：`params` 状态为唯一真相源，form 是它的投影；新能力以增量 props 提供，默认值保持现有行为；**不改 `@allahjs/utils` 共享包**（兼容逻辑在组件内做，影响面限定在本包）。

## 阶段 1：参数内核修复（AhPageContent.tsx / ahAntdTypes.ts）
1. **合并顺序修复**（`AhPageContent.tsx:85`）：`{...prevParams, ...defParams, ...updatedParams}` → `{...defParams, ...prevParams, ...updatedParams}`，默认值只在初始化生效，不再每次更新压回运行时状态。
2. **三源状态收敛**：ref `setParams` 补 `propsSetParams` 回调（受控父组件收到通知）；`propsParams` 响应 effect 的 `JSON.stringify` 依赖改为 key 排序的 stableStringify，且与当前 params 相等时跳过（防回声循环）。
3. **空值归一**：新增本地工具 `pickEffectiveParams`（剔除 undefined/null/''/空数组，保留 pageNum/pageSize），在 request 包装出口统一应用。keyword 清空后不再发送空串。
4. **排序双通道修复**：`normalizeSearchValues`（`:119-124`）增加 else 分支——timeSort 清空时 `sort: undefined`，消除残留；列头排序与内置排序改为 overlay 合并 `{...params.sort, ...列排序}`（request 包装内处理，不动 allah-utils 的 handleReqListParams）。
5. **defParams 表单值回显修复**（`:159`）：LightFilter `initialValues` 从 `propsParams` 改为 `{...defParams, ...初始 propsParams}`。

## 阶段 2：keyword 触发与查询模式
6. **参数层防抖**：onChange 只更新输入态并经 ahooks `useDebounceFn(debounceTime)` 防抖提交；onSearch（回车/搜索按钮/清空按钮）立即 flush 并取消挂起调用——消除双通道重复触发与每键父组件重渲染/setFieldsValue 抖动。
7. **`searchMode?: 'instant' | 'submit'`**（默认 instant，行为不变）：submit 模式下表单项与 keyword 变更只暂存，点「查询」（Input.Search 按钮）才统一提交，支持慢后端批量组条件。
8. keyword 输入框补 `aria-label`。

## 阶段 3：全局重置
9. SearchContent 头部新增「重置」按钮（无生效筛选时 disabled）：`form.resetFields()` + 清 LightFilter 折叠区暂存值 + 清 keyword + params 回到挂载时快照 `{...defParams, ...初始propsParams, pageNum:1}`。
10. LightFilter 新增 `resetSignal` prop（递增数值触发清空 `moreValues`）；`isEffective` 把 `''` 统一视为无效（高亮与空值判定一致）。

## 阶段 4：URL 同步
11. **`syncUrl?: boolean | { keys?: string[] }`**（默认 false）：挂载按 `defParams < url < propsParams` 合并初始值；params 变化经 replaceState 写入（不产生历史栈）；popstate 监听还原；对象值（时间区间、sort）JSON 编解码。刷新/分享/后退可还原筛选。

## 阶段 5：能力面扩展
12. **timeSearch 支持多日期区间**：`boolean | Array<{field, label}>`（boolean 保持单字段兼容），normalize 循环处理全部配置字段；并自动识别表单值中的 Dayjs 二元数组统一转换（自塞的日期字段免声明）。
13. **sortSearch 可配置**：`boolean | {name?, label?, options: Array<{label, value, sort}>}`，默认选项保持现有两项（向后兼容）。
14. **类型约束**：`searchForm` 支持 render-prop `(form) => ReactNode`；新增导出 `createFilterItem<F, K>(name: K, node)` 类型辅助，编译期校验表单项 name ∈ F。
15. timeSearch 默认 true 保持，index.md 显式标注「ERP 后端未实现 creTimeObj，建议关闭」。

## 阶段 6：健壮性（AhProTable.tsx / AhPageContent.tsx）
16. **错误处理**：request 包装内 try/catch；成功结果缓存 `lastSuccessRef`；失败时 `onError?.(e)`（默认 `message.error('加载失败，请重试')`）并返回 lastSuccess（无缓存返回空页）——表格保持旧数据 + 明确提示；`success:true` 语义由组件收口。
17. **total/空态竞态**：AhProTable 给传给 ProTable 的 `runAsync` 加请求序号守卫，仅最新序号结果更新 data 通道（分页 total 与空态样式不再被旧响应污染）。
18. **分页上行同步**：AhProTable 新增 `onParamsChange` 回调（分页 onChange 触发）；AhPageContent 静默合并 pageNum/pageSize 进 params（相等不写），消除父组件陈旧页码。

## 阶段 7：可达性（SearchContent.tsx）
19. 展开/收起开关从纯图标 span 改为真 `<button>`（保留样式类），带 `aria-expanded`，键盘可操作。
20. 新增 `searchCollapsible?: boolean`（默认 `= searchLayout === 'div'`），card/plugin 布局也可折叠。

## 阶段 8：demo、文档与验证
21. demoData.ts 补日期字段；更新 7 个现有 demo 适配；新增 **Demo8「筛选增强」**集中演示 submit 模式 + syncUrl + 重置 + 多日期 + 自定义排序 + 失败重试（内置可切换失败的 request）。
22. index.md：API 表新增上述 props 与 `createFilterItem`；FAQ 更新；显式标注三项行为变更（空串参数不再发送、ref setParams 通知受控父组件、防抖从请求层提前到参数层）。
23. `src/ui/index.ts` 导出 `createFilterItem`。

## 验证清单
- `pnpm type-check` 通过。
- 浏览器逐项实测：8 个 demo 渲染与高度正常；keyword 连续输入 Network 只发一次请求；筛选变更回第 1 页、翻页保留筛选且无双重请求；重置一键还原（含折叠区暂存）；timeSort 清空无 sort 残留（断言请求参数）；列排序与内置排序并存合并；syncUrl 刷新/后退还原；submit 模式批量提交；失败路径 toast + 旧数据保留。

## 风险
- 分页上行同步与 ProTable params 深比较叠加存在理论性双重请求风险：以相等守卫 + Network 实测兜底，若仍复现则退为只同步不回传。
- 三项行为变更已在文档标注，属修复性质而非破坏性接口变更。