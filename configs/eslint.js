module.exports = {
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'react/jsx-no-literals': 'off',
    'sort-keys': 'off',
    'no-use-before-define': 'off',
  },
  overrides: [
    {
      files: ['scripts/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'no-console': 'off',
        'unicorn/no-process-exit': 'off',
      },
    },
  ],
};
