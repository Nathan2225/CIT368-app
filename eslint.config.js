export default [
    {
      files: ['**/*.js'],
      languageOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      rules: {
        'no-eval': 'error',
        'no-unused-vars': 'warn',
        'no-console': 'off', 
      },
    },
  ];