import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  outputPath: 'docs-dist',
  title: 'AAntd',
  themeConfig: {
    name: 'AAntd',
    footer: 'Copyright © 2026 allah-prime',
    nav: [
      { title: '首页', link: '/' },
      { title: '指南', link: '/guide' },
      { title: 'UI 组件', link: '/ui' },
      { title: '编辑器', link: '/edit' },
      { title: '拖拽', link: '/drag' },
      { title: '移动端', link: '/mobile' }
    ]
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [
      { type: 'ui', dir: 'src/ui' },
      { type: 'edit', dir: 'src/edit' },
      { type: 'drag', dir: 'src/drag' },
      { type: 'mobile', dir: 'src/mobile' }
    ]
  },
  // 安全网：个别 demo 若仍引用旧包名，映射到平铺后的目录
  alias: {
    '@theling/ui': path.resolve(__dirname, 'src/ui'),
    '@theling/drag': path.resolve(__dirname, 'src/drag'),
    '@theling/edit': path.resolve(__dirname, 'src/edit'),
    '@theling/mobile': path.resolve(__dirname, 'src/mobile'),
    '@theling/types': path.resolve(__dirname, 'src/types')
  },
  base: '/allah-antd/',
  publicPath: '/allah-antd/'
});
