import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: {
    output: 'dist',
    input: 'src',
    platform: 'browser',
    transformer: 'babel',
    // 组件 demo 与 dumi 文档不进入构建产物
    ignores: ['**/demo/**', '**/demos/**', '**/*.md']
  }
});
