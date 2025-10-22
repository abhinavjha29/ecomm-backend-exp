module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'check-file', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js', 'node_modules', 'dist', '.gitignore'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // 'max-lines': [
    //   'error',
    //   { max: 500, skipBlankLines: true, skipComments: true },
    // ],
    '@typescript-eslint/naming-convention': [
      'error',
      // Enforcing camelCase for any type of variable and functions
      {
        selector: ['variable', 'function'],
        format: ['camelCase']
      },
      // Allow UPPER_SNAKE_CASE for const variables (constants)
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase', 'UPPER_CASE']
      },
      // Enforcing PascalCase for classes, interfaces, type aliases, class, enum)
      {
        selector: ['typeLike', 'class', 'enum'],
        format: ['PascalCase']
      },
      // Enforcing UPPER_SNAKE_CASE for enum members
      {
        selector: 'enumMember',
        format: ['UPPER_CASE']
      }
    ],
    // For file naming in kebab-case
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{js,ts}': 'KEBAB_CASE'
      },
      { ignoreMiddleExtensions: true }
    ],
    // For folder naming in kebab-case
    'check-file/folder-naming-convention': ['error', { '**/*': 'KEBAB_CASE' }],
    // Disallow console.log statements
    // 'no-console': ['error'],
    // Require semicolons
    semi: ['error', 'always'],
    // Enforce the use of === and !==
    eqeqeq: ['error', 'always'],
    // Disallow duplicate imports
    'no-duplicate-imports': 'error',
    'prettier/prettier': 'error',
    'comma-dangle': ['error', 'never'] // This disables trailing commas
  }
};
