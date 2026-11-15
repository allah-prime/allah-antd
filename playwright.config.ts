import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // 单条用例超时：dumi dev 首次编译路由可能较慢，给足余量
  timeout: 30_000,
  expect: { timeout: 5_000 },
  // 本地 0 重试快速反馈；CI 环境预留重试
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:9527',
    // 页面加载后 dumi 异步编译渲染 demo，全局等待窗口兜底
    actionTimeout: 10_000,
    navigationTimeout: 30_000
  },
  webServer: {
    // 复用已在运行的 dev server；没有则自动拉起 dumi dev
    command: 'pnpm dev',
    url: 'http://localhost:9527/allah-antd/~demos/ahformdetail-demo-editabledemo',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ]
});
