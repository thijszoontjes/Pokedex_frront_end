module.exports = {
  extends: [
    'expo',
  ],
  rules: {
    // Basic rules for clean code
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    // Disable problematic import rules that conflict with TypeScript 5.9
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
  },
};