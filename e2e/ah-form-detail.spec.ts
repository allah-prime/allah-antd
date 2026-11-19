import { expect, test, type Page } from '@playwright/test';

/**
 * AhFormDetail 单字段编辑 E2E 回归
 *
 * 目标页面为 dumi 的 ~demos 独立路由（只渲染 demo 本身，无文档站导航干扰）：
 * - /allah-antd/~demos/ahformdetail-demo-editabledemo  可编辑详情（editable + onFieldSave mock）
 * - /allah-antd/~demos/ahformdetail-demo-requestdemo   非 editable 的异步详情
 */

const EDITABLE_URL = '/allah-antd/~demos/ahformdetail-demo-editabledemo';
const REQUEST_URL = '/allah-antd/~demos/ahformdetail-demo-requestdemo';
const CONFIG_URL = '/allah-antd/~demos/ahformdetail-demo-configdemo';

/** 查看态各字段（read 模式）的预期文本 */
const EXPECTED_VIEW = {
  姓名: '张三',
  状态: '未解决',
  日期: '2024-01-15',
  年龄: '28',
  是否启用: '是',
  备注: '这是一段备注信息，点击铅笔后可以直接编辑'
} as const;

/** 按列 label 定位 read/edit 单元格的值文本 */
async function readCellByLabel(page: Page, label: string): Promise<string> {
  const row = page.locator('tr', { has: page.locator('th', { hasText: label }) });
  const td = row.locator('td').nth(await getTdIndex(row, label));
  return (await td.locator('.ant-form-item-control-input-content').innerText()).trim();
}

/** 行内 label 在第几列（th 下标即 td 下标） */
async function getTdIndex(row: ReturnType<Page['locator']>, label: string): Promise<number> {
  const ths = await row.locator('th').allInnerTexts();
  return ths.findIndex((t) => t.trim() === label);
}

/** 点击指定列的编辑铅笔 */
async function clickPencilByLabel(page: Page, label: string): Promise<void> {
  const row = page.locator('tr', { has: page.locator('th', { hasText: label }) });
  const tdIdx = await getTdIndex(row, label);
  await row.locator('td').nth(tdIdx).locator('.ah-form-detail-edit-icon').click();
}

/** 设置 React 受控输入的值（native setter + input 事件） */
async function setInput(page: Page, selector: string, value: string): Promise<void> {
  await page.locator(selector).evaluate((el: HTMLElement, v) => {
    const proto =
      el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value')?.set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

/** 点操作栏的确认（先点空白处收起日期面板等浮层） */
async function confirmBar(page: Page): Promise<void> {
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.locator('.ah-form-detail-edit-bar button', { hasText: '确' }).click();
}

test.describe('AhFormDetail JSON 配置', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CONFIG_URL);
    await expect(page.getByText('SUP-001', { exact: true })).toBeVisible();
  });

  test('渲染选项与注册字段，复用校验、取消和保存', async ({ page }) => {
    await expect(page.getByText('启用', { exact: true })).toBeVisible();
    await expect(page.locator('.ant-tag')).toHaveText('手工录入');
    await expect(page.getByText('南通', { exact: true })).toBeVisible();
    await expect(page.getByText('常用供应商', { exact: true })).toBeVisible();
    await expect(page.locator('.ah-form-detail-edit-icon')).toHaveCount(2);

    await clickPencilByLabel(page, '供应商编码');
    const input = page.getByRole('textbox', { name: '供应商编码' });
    await expect(input).toHaveValue('SUP-001');
    await input.fill('');
    await confirmBar(page);
    await expect(page.getByText('请输入供应商编码')).toBeVisible();
    await page.locator('.ah-form-detail-edit-bar button', { hasText: '取' }).click();
    await expect(page.getByText('SUP-001', { exact: true })).toBeVisible();

    await clickPencilByLabel(page, '供应商编码');
    await input.fill('SUP-002');
    await confirmBar(page);
    await expect(page.getByText('SUP-002', { exact: true })).toBeVisible();
    await expect(page.locator('pre[aria-label="保存结果"]')).toContainText('"code": "SUP-002"');
  });

  test('相同 formId 下切换配置和数据，清空旧草稿及缺失字段', async ({ page }) => {
    await clickPencilByLabel(page, '供应商编码');
    await page.getByRole('textbox', { name: '供应商编码' }).fill('旧草稿');
    await page.getByRole('button', { name: '切换新供应商' }).click();
    await expect(page.getByText('新供应商', { exact: true })).toBeVisible();
    await expect(page.getByText('供应商状态', { exact: true })).toBeVisible();
    await expect(page.getByText('未分配编码', { exact: true })).toBeVisible();
    await expect(page.getByText('南通', { exact: true })).toHaveCount(0);
    await expect(page.locator('.ah-form-detail-edit-bar')).toHaveCount(0);
    await clickPencilByLabel(page, '供应商编码');
    await expect(page.getByRole('textbox', { name: '供应商编码' })).toHaveValue('');
  });

  test('忽略切换记录前启动的请求和保存结果', async ({ page }) => {
    await page.getByRole('button', { name: '加载远程供应商' }).click();
    await expect(page.locator('.ant-skeleton')).toBeVisible();
    await page.getByRole('button', { name: '查看本地供应商' }).click();
    await expect(page.getByText('本地供应商', { exact: true })).toBeVisible();

    await clickPencilByLabel(page, '供应商编码');
    await page.getByRole('textbox', { name: '供应商编码' }).fill('过期编码');
    await confirmBar(page);
    await expect(page.locator('.ah-form-detail-edit-bar .ant-btn-loading')).toBeVisible();
    await page.getByRole('button', { name: '切换新供应商' }).click();
    // 等待示例中的两个模拟请求完成，再确认当前记录未被覆盖。
    await page.waitForTimeout(1300);
    await expect(page.getByText('新供应商', { exact: true })).toBeVisible();
    await expect(page.getByText('未分配编码', { exact: true })).toBeVisible();
    await expect(page.locator('pre[aria-label="保存结果"]')).toHaveCount(0);
  });
});

test.describe('AhFormDetail 单字段编辑', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDITABLE_URL);
    await expect(page.locator('.ah-form-detail-cell')).toHaveCount(6);
  });

  test('查看态渲染与列宽统一', async ({ page }) => {
    const demo = page.locator('.ah-form-detail-cell').first().locator('xpath=ancestor::div[contains(@class,"ant-descriptions")]');

    for (const [label, expected] of Object.entries(EXPECTED_VIEW)) {
      await expect.poll(() => readCellByLabel(page, label)).toBe(expected);
    }
    // 铅笔数 6
    await expect(page.locator('.ah-form-detail-edit-icon')).toHaveCount(6);
    // 初始无操作栏、无编辑态
    await expect(page.locator('.ah-form-detail-edit-bar')).toHaveCount(0);
    await expect(page.locator('.ah-form-detail-edit')).toHaveCount(0);
    // read 模式无输入框
    await expect(page.locator('.ah-form-detail-cell input')).toHaveCount(0);
    // 列宽统一（value 列均分）
    const widths = await demo.locator('.ant-descriptions-item-content').evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().width))
    );
    expect(new Set(widths).size).toBe(1);
  });

  test('进入编辑：操作栏出现、聚焦、其他字段保持 read', async ({ page }) => {
    await clickPencilByLabel(page, '姓名');

    // edit 模式：input 可见且聚焦
    const input = page.locator('#name');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    // 编辑控件占满单元格、无确认/取消图标
    await expect(page.locator('.ah-form-detail-edit .anticon-check')).toHaveCount(0);
    await expect(page.locator('.ah-form-detail-edit .anticon-close')).toHaveCount(0);
    // 操作栏：文案 + 按钮 + 8px 间距
    const bar = page.locator('.ah-form-detail-edit-bar');
    await expect(bar).toBeVisible();
    await expect(bar).toContainText('数据编辑中');
    const cancel = bar.locator('button', { hasText: '取' });
    const confirm = bar.locator('button', { hasText: '确' });
    await expect(cancel).toBeVisible();
    await expect(confirm).toBeVisible();
    const cancelRight = await cancel.evaluate((el) => el.getBoundingClientRect().right);
    const confirmLeft = await confirm.evaluate((el) => el.getBoundingClientRect().x);
    expect(Math.round(confirmLeft - cancelRight)).toBe(8);
    // 其他字段保持 read（无输入框）
    await expect(page.locator('.ah-form-detail-cell input')).toHaveCount(0);
    // 行高对齐：编辑单元格与查看态单元格同高
    const editH = await page.locator('.ah-form-detail-edit').evaluate((el) => el.getBoundingClientRect().height);
    const readH = await page
      .locator('.ah-form-detail-cell')
      .first()
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(editH - readH)).toBeLessThanOrEqual(1);
  });

  test('日期编辑：自动聚焦 + 面板自动弹出', async ({ page }) => {
    await clickPencilByLabel(page, '日期');
    await expect(page.locator('#date')).toBeFocused();
    const dropdown = page.locator('.ant-picker-dropdown').first();
    await expect(dropdown).toBeVisible();
    // 点击外部收起面板，仍停留在编辑态
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('.ah-form-detail-edit')).toBeVisible();
    await expect(dropdown).toHaveClass(/dropdown-hidden/);
  });

  test('草稿显示与多字段同时编辑', async ({ page }) => {
    // 状态选「已解决」→ 切到姓名 → 状态保持编辑态（值不回退），姓名也进入编辑
    await clickPencilByLabel(page, '状态');
    await page.locator('.ah-form-detail-edit .ant-select-content').click();
    await page.locator('.ant-select-dropdown .ant-select-item-option', { hasText: '已解决' }).click();
    await expect(
      page.locator('.ah-form-detail-edit .ant-select-content-value')
    ).toHaveText('已解决');

    await clickPencilByLabel(page, '姓名');
    // 状态仍在编辑态：两个控件同时挂载
    await expect(page.locator('.ah-form-detail-edit')).toHaveCount(2);
    await expect.poll(() => readCellByLabel(page, '状态')).toBe('已解决');

    // 姓名输入草稿 → 切到日期编辑 → 三个字段同时处于编辑态，姓名草稿保留
    await setInput(page, '#name', '草稿保留');
    await clickPencilByLabel(page, '日期');
    await expect(page.locator('.ah-form-detail-edit')).toHaveCount(3);
    await expect(page.locator('#name')).toHaveValue('草稿保留');
    await expect.poll(() => readCellByLabel(page, '状态')).toBe('已解决');
  });

  test('确认：批量保存全部脏字段，onFieldSave 按列顺序触发', async ({ page }) => {
    const saveCalls: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('保存字段')) saveCalls.push(text);
    });

    await clickPencilByLabel(page, '姓名');
    await setInput(page, '#name', '批量保存测试');
    await clickPencilByLabel(page, '状态');
    await page.locator('.ah-form-detail-edit .ant-select-content').click();
    await page.locator('.ant-select-dropdown .ant-select-item-option', { hasText: '已解决' }).click();

    await confirmBar(page);

    // onFieldSave 按列顺序触发两次，值正确
    await expect.poll(() => saveCalls.length, { timeout: 5_000 }).toBe(2);
    expect(saveCalls[0]).toContain('保存字段 name: 批量保存测试');
    expect(saveCalls[1]).toContain('保存字段 state: closed');

    // 落库显示 + 退出编辑（全部回到 read）+ 操作栏消失
    await expect.poll(() => readCellByLabel(page, '姓名')).toBe('批量保存测试');
    await expect.poll(() => readCellByLabel(page, '状态')).toBe('已解决');
    await expect(page.locator('.ah-form-detail-edit')).toHaveCount(0);
    await expect(page.locator('.ah-form-detail-edit-bar')).toHaveCount(0);
  });

  test('校验：失败字段内联报错并停留编辑，修复后可保存', async ({ page }) => {
    // 场景1：姓名清空 → 确认 → 错误显示在姓名单元格下方、停留编辑、操作栏保留
    await clickPencilByLabel(page, '姓名');
    await setInput(page, '#name', '');
    await confirmBar(page);
    await expect(
      page.locator('.ah-form-detail-edit .ant-form-item-explain-error')
    ).toHaveText('请输入姓名');
    await expect(page.locator('.ah-form-detail-edit')).toBeVisible();
    await expect(page.locator('.ah-form-detail-edit-bar')).toBeVisible();

    // 场景2：切到日期编辑（姓名保持编辑态）→ 确认 → 姓名错误仍然内联可见
    await clickPencilByLabel(page, '日期');
    await expect(page.locator('.ah-form-detail-edit')).toHaveCount(2);
    await confirmBar(page);
    await expect(
      page.locator('.ah-form-detail-edit .ant-form-item-explain-error')
    ).toHaveText('请输入姓名');

    // 修复后确认成功
    await setInput(page, '#name', '校验修复');
    await confirmBar(page);
    await expect.poll(() => readCellByLabel(page, '姓名')).toBe('校验修复');
    await expect(page.locator('.ah-form-detail-edit')).toHaveCount(0);
  });

  test('校验：未触碰的字段不阻塞确认', async ({ page }) => {
    // 只编辑姓名（年龄等未触碰字段没有 required 问题，不参与校验）
    await clickPencilByLabel(page, '姓名');
    await setInput(page, '#name', '只校验脏字段');
    await confirmBar(page);
    await expect.poll(() => readCellByLabel(page, '姓名')).toBe('只校验脏字段');
    await expect(page.locator('.ah-form-detail-edit')).toHaveCount(0);
  });

  test('取消：丢弃全部草稿并还原', async ({ page }) => {
    await clickPencilByLabel(page, '姓名');
    await setInput(page, '#name', '将要丢弃A');
    await clickPencilByLabel(page, '状态');
    await page.locator('.ah-form-detail-edit .ant-select-content').click();
    await page.locator('.ant-select-dropdown .ant-select-item-option', { hasText: '已解决' }).click();

    await page.locator('.ah-form-detail-edit-bar button', { hasText: '取' }).click();

    await expect(page.locator('.ah-form-detail-edit')).toHaveCount(0);
    await expect(page.locator('.ah-form-detail-edit-bar')).toHaveCount(0);
    await expect.poll(() => readCellByLabel(page, '姓名')).toBe('张三');
    await expect.poll(() => readCellByLabel(page, '状态')).toBe('未解决');
  });
});

test.describe('AhFormDetail 非 editable 回归', () => {
  test('RequestDemo 正常渲染且无编辑能力', async ({ page }) => {
    await page.goto(REQUEST_URL);
    await expect(page.locator('.ant-descriptions')).toBeVisible();
    await expect(page.getByText('三防设施')).toBeVisible();
    await expect(page.locator('.ah-form-detail-edit-icon')).toHaveCount(0);
    await expect(page.locator('.ah-form-detail-edit-bar')).toHaveCount(0);
    await expect(page.locator('.ah-form-detail-cell')).toHaveCount(0);
  });
});
