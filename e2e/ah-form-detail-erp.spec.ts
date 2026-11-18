import { expect, test, type Page } from '@playwright/test';

const DEMO_URL = '/allah-antd/~demos/ahformdetail-demo-erpeditorsdemo';

function field(page: Page, label: string) {
  return page.getByRole('row').filter({
    has: page.getByRole('rowheader', { name: label, exact: true })
  });
}

async function edit(page: Page, label: string) {
  const row = field(page, label);
  await row.locator('.ah-form-detail-edit-icon').click();
  return row;
}

function confirm(page: Page) {
  return page.locator('.ah-form-detail-edit-bar').getByRole('button', { name: /确\s*认/ }).click();
}

function cancel(page: Page) {
  return page.locator('.ah-form-detail-edit-bar').getByRole('button', { name: /取\s*消/ }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto(DEMO_URL);
  await expect(field(page, '附件')).toBeVisible();
});

test('弹窗选择保留对象草稿，支持取消、保存和清空；可同时保存自定义嵌套字段', async ({ page }) => {
  const warehouse = await edit(page, '仓库');
  await warehouse.getByRole('button', { name: '请选择' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '成品仓' }).click();
  await expect(warehouse.getByRole('button', { name: '成品仓' })).toBeVisible();
  await cancel(page);
  await expect(warehouse.getByText('暂无数据')).toBeVisible();

  await edit(page, '仓库');
  await warehouse.getByRole('button', { name: '请选择' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '原料仓' }).click();
  const quantity = await edit(page, '限额');
  await quantity.getByRole('spinbutton').fill('');
  await confirm(page);
  await expect(quantity.getByText('请输入限额')).toBeVisible();
  await quantity.getByRole('spinbutton').fill('13');
  await confirm(page);
  await expect(warehouse.getByText('原料仓')).toBeVisible();
  await expect(quantity.getByText('13')).toBeVisible();

  await edit(page, '仓库');
  await warehouse.getByRole('button', { name: /清\s*空/ }).click();
  await confirm(page);
  await expect(warehouse.getByText('暂无数据')).toBeVisible();
});

test('附件取消时不上传，确认失败后只重试未完成的文件，并可删除已保存的附件', async ({ page }) => {
  const file = (name: string) => ({ name, mimeType: 'text/plain', buffer: Buffer.from(name) });
  const transfers = (count: number) => page.getByText(`模拟上传次数：${count}`, { exact: true });
  const attachment = await edit(page, '附件');
  await attachment.locator('input[type=file]').setInputFiles(file('discard.txt'));
  await cancel(page);
  await expect(attachment.getByText('暂无数据')).toBeVisible();
  await expect(transfers(0)).toBeVisible();

  await edit(page, '附件');
  await attachment.locator('input[type=file]').setInputFiles([file('first.txt'), file('retry.txt')]);
  await expect(transfers(0)).toBeVisible();
  await confirm(page);
  await expect(attachment.getByText('模拟网络中断，请重试')).toBeVisible();
  await expect(transfers(1)).toBeVisible();
  await confirm(page);
  await expect(attachment.getByText('first.txt、retry.txt', { exact: true })).toBeVisible();
  await expect(transfers(2)).toBeVisible();

  await edit(page, '附件');
  await attachment.locator('.ant-upload-list-item').filter({ hasText: 'first.txt' })
    .getByRole('button', { name: 'Remove file' }).click();
  await confirm(page);
  await expect(attachment.getByText('retry.txt', { exact: true })).toBeVisible();
  await expect(transfers(2)).toBeVisible();
});

test('树选择、级联、远程搜索下拉和多选字段保存后回显', async ({ page }) => {
  const department = await edit(page, '部门');
  await department.getByRole('combobox').click();
  await page.locator('.ant-select-tree-switcher').first().click();
  await page.locator('.ant-select-tree-title').getByText('南通', { exact: true }).click();

  const area = await edit(page, '送货地区');
  await area.getByRole('combobox').click();
  await page.getByRole('menuitemcheckbox', { name: /^华东/ }).click();
  await page.getByRole('menuitemcheckbox', { name: /^南通/ }).click();

  const contact = await edit(page, '联系人');
  await contact.getByRole('combobox').click();
  await page.getByPlaceholder('搜索', { exact: true }).fill('王');
  await page.locator('.ant-select-item-option-content').getByText('王平', { exact: true }).click();

  const channelView = await field(page, '渠道').locator('.ah-form-detail-cell').boundingBox();
  const channels = await edit(page, '渠道');
  const checkbox = await channels.locator('.ant-checkbox').first().boundingBox();
  expect(channelView).not.toBeNull();
  expect(checkbox).not.toBeNull();
  expect(Math.abs(channelView!.x - checkbox!.x)).toBeLessThan(1);
  await channels.getByRole('checkbox', { name: '线下' }).check();
  await confirm(page);
  await expect(department.getByText('南通')).toBeVisible();
  await expect(area.getByText(/华东.*南通/)).toBeVisible();
  await expect(contact.getByText('王平')).toBeVisible();
  await expect(channels.getByText(/线下/)).toBeVisible();
});

test('异步树弹窗和异步级联写入业务字段', async ({ page }) => {
  const group = await edit(page, '负责小组');
  await group.getByText('新增', { exact: true }).click();
  const tree = page.getByRole('dialog');
  await tree.getByRole('checkbox', { name: /采购组/ }).click();
  await tree.getByRole('button', { name: '完成选择' }).click();

  const region = await edit(page, '服务地区');
  const delivery = await edit(page, '送货地区');
  const regionBox = await region.locator('.ant-select').boundingBox();
  const deliveryBox = await delivery.locator('.ant-select').boundingBox();
  expect(regionBox).not.toBeNull();
  expect(deliveryBox).not.toBeNull();
  expect(Math.abs(regionBox!.x - deliveryBox!.x)).toBeLessThan(1);
  expect(Math.abs(regionBox!.width - deliveryBox!.width)).toBeLessThan(1);
  await region.getByRole('combobox').click();
  await page.getByRole('menuitemcheckbox', { name: /^中国/ }).click();
  await page.getByRole('menuitemcheckbox', { name: /^江苏/ }).click();
  await page.keyboard.press('Escape');
  await confirm(page);
  await expect(group.getByText('采购组', { exact: true })).toBeVisible();
  await expect(region.getByText('江苏', { exact: true })).toBeVisible();
});
