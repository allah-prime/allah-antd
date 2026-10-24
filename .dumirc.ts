import { defineConfig } from 'dumi';

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
  base: '/allah-antd/',
  publicPath: '/allah-antd/',
  plugins: ['./.dumi/plugins/atom-route-prefix.ts']
});
