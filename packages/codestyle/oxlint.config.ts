import { defineConfig } from 'oxlint'

export default defineConfig({
    plugins: ['typescript', 'unicorn', 'oxc', 'import', 'vue'],
    categories: { correctness: 'error', suspicious: 'warn', pedantic: 'off' },
    rules: {
        'no-unexpected-multiline': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'typescript/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            },
        ],
        'no-explicit-any': 'error',
    },
    ignorePatterns: ['node_modules', 'dist', 'package-lock.json'],
})
