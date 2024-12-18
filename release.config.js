module.exports = {
    branches: ['main'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            "@semantic-release/changelog",
            {
                "changelogTitle": "# Changelog"
            }
        ],
        [
          "@semantic-release/npm",
            {
                "npmPublish": false
            }
        ],
        '@semantic-release/github',
        [
            "@semantic-release/git",
            {
                "message": "chore(release): ${nextRelease.version} [skip ci]",
                "assets": [
                    "CHANGELOG.md",
                    "package.json"
                ]
            }
        ]
    ],
};