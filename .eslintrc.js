module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/essential',
    'plugin:vue/vue3-recommended',
    'plugin:nuxt/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'max-len': ['error', {
      code: 120,
      ignorePattern: 'd="([\\s\\S]*?)"',
    }],
    'vue/max-len': ['error', {
      code: 120,
      template: 100,
      ignorePattern: 'd="([\\s\\S]*?)"',
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 3,
      },
      multiline: {
        max: 3,
      },
    }],
    'linebreak-style': 0,
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-v-bind-sync': 'off',
    'vue/no-deprecated-router-link-tag-prop': 'off',
  },
  settings: {
    'import/resolver': {
      nuxt: {
        extensions: ['.js', '.vue'],
      },
    },
  },
};
