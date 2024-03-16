import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { builder: 'mkdist', input: './src/lib', pattern: ['**/*.vue'], loaders: ['vue'] },
    { builder: 'mkdist', input: './src/lib', pattern: ['**/*.ts'], format: 'cjs', loaders: ['js'] },
    { builder: 'mkdist', input: './src/lib', pattern: ['**/*.ts'], format: 'esm', loaders: ['js'] },
  ],
  declaration: true,
  clean: true,
  externals: ["vue", "radix-vue", "unocss"]
})