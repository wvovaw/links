import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
  },
  vue: {
    overrides: {
      "vue/define-macros-order": "off",
    },
  },
})