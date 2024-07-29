module.exports = {
  extends: ['expo', 'universe/shared/typescript-analysis'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
