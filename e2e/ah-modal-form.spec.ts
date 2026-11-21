import { expect, test } from '@playwright/test';

const DEMO_URL = '/allah-antd/~demos/ahmodalform-demo-columnsdemo';

const modal = (page: import('@playwright/test').Page) => page.locator('[data-testid="demo-modal"]');
const dialog = (page: import('@playwright/test').Page) => page.getByRole('dialog');

test.beforeEach(async ({ page }) => {
  await page.goto(DEMO_URL);
  await expect(page.getByTestId('row-USD')).toBeVisible();
});

test('点行进入详情态，宽度按 4 个字段取一栏 400px，标题带灰色编码', async ({ page }) => {
  await page.getByTestId('row-USD').click();
  await expect(modal(page)).toHaveAttribute('data-mode', 'view');
  await expect(dialog(page).locator('.ant-modal-title')).toContainText('美元');
  await expect(dialog(page).locator('.ant-modal-title')).toContainText('USD');
  const width = await dialog(page).locator('.ant-modal-container').evaluate((el) => el.getBoundingClientRect().width);
  expect(Math.round(width)).toBe(400);
  await expect(page.getByTestId('demo-edit')).toBeVisible();
  await expect(page.getByTestId('modal-ok')).toHaveCount(0);
});

test('编辑后取消回到详情态且不残留草稿，保存后详情态显示新值', async ({ page }) => {
  await page.getByTestId('row-USD').click();
  await page.getByTestId('demo-edit').click();
  await expect(modal(page)).toHaveAttribute('data-mode', 'edit');

  const name = dialog(page).getByRole('textbox').nth(1);
  await name.fill('美元-草稿');
  await page.getByTestId('modal-cancel').click();
  await expect(modal(page)).toHaveAttribute('data-mode', 'view');
  await expect(dialog(page)).toContainText('美元');
  await expect(dialog(page)).not.toContainText('美元-草稿');

  await page.getByTestId('demo-edit').click();
  await expect(dialog(page).getByRole('textbox').nth(1)).toHaveValue('美元');
  await dialog(page).getByRole('textbox').nth(1).fill('美元-改');
  await page.getByTestId('modal-ok').click();
  await expect(modal(page)).toHaveAttribute('data-mode', 'view');
  await expect(dialog(page).locator('.ant-modal-title')).toContainText('美元-改');
  await expect(page.getByTestId('row-USD')).toContainText('美元-改');
});

test('新增态直接是表单，必填校验保留输入，保存后关闭并出现新记录', async ({ page }) => {
  await page.getByTestId('add').click();
  await expect(modal(page)).toHaveAttribute('data-mode', 'create');
  await page.getByTestId('modal-ok').click();
  await expect(dialog(page).getByText('请填写编码')).toBeVisible();
  await expect(dialog(page).getByText('请填写汇率')).toBeVisible();

  const inputs = dialog(page).getByRole('textbox');
  await inputs.nth(0).fill('JPY');
  await inputs.nth(1).fill('日元');
  await inputs.nth(3).fill('0.05');
  await page.getByTestId('modal-ok').click();
  await expect(dialog(page)).toBeHidden();
  await expect(page.getByTestId('row-JPY')).toContainText('日元');
});

test('新增取消直接关闭；连续打开两条记录不串数据', async ({ page }) => {
  await page.getByTestId('add').click();
  await page.getByTestId('modal-cancel').click();
  await expect(dialog(page)).toBeHidden();

  await page.getByTestId('row-USD').click();
  await expect(dialog(page)).toContainText('美元');
  await page.getByTestId('modal-cancel').click();
  await expect(dialog(page)).toBeHidden();
  await page.getByTestId('row-EUR').click();
  await expect(dialog(page)).toContainText('欧元');
  await expect(dialog(page)).not.toContainText('美元');
});
