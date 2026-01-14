// eslint.config.js
import vuetify from 'eslint-config-vuetify'

export default [
  ...vuetify(),

  {
    files: ['**/*.vue'],
    rules: {
      'vue/attributes-order': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },
]
