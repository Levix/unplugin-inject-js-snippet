module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'refactor', 'fix', 'build', 'docs', 'style', 'test', 'ci', 'chore', 'revert'],
        ],
    },
};
