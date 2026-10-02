import allahjsConfig from '@allahjs/eslint';

export default [
  {
    ignores: [
      'src/theling-utils/**',
      'dist/**',
      'docs-dist/**',
      '.dumi/**',
      'node_modules/**'
    ]
  },
  ...allahjsConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      // 要求使用模板字面量而非字符串连接
      'prefer-template': 2,
      // 允许在 useEffect 中调用 setState（关闭警告）
      'react-hooks/set-state-in-effect': 0,
      // 要求 useEffect 中的依赖项是不可变的
      'react-hooks/immutability': 0,
      // 历史代码存在渲染期随机数/动态组件等写法（迁移自 @theling/antd，原配置无 react-compiler 规则）
      'react-hooks/purity': 0,
      'react-hooks/refs': 0,
      'react-hooks/components': 0,
      // 组件 props 由 TypeScript 校验，无需 runtime propTypes
      'react/prop-types': 0,
      // 透传 antd 类型时常需要 any
      '@typescript-eslint/no-explicit-any': 0,
      camelcase: 0
    }
  }
];
