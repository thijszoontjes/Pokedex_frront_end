module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['react', 'react-hooks', 'react-native', '@typescript-eslint'],
  env: {
    'react-native/react-native': true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Clean code rules
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off', // Not needed in React Native with new JSX transform
    'react/prop-types': 'off', // We use TypeScript for prop validation
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'react/no-unescaped-entities': 'off', // Allow apostrophes in JSX text
    'react-hooks/rules-of-hooks': ['error', { 
      // Allow useMove from BattleContext (it's actually a function, not a hook)
    }],
  },
};