const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

describe('backend JavaScript files', () => {
    it('pass Node.js syntax validation', () => {
        const root = path.resolve(__dirname, '..');
        const files = [];

        function collect(directory) {
            for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
                const fullPath = path.join(directory, entry.name);
                if (entry.isDirectory() && entry.name !== 'node_modules') collect(fullPath);
                if (entry.isFile() && entry.name.endsWith('.js')) files.push(fullPath);
            }
        }

        collect(root);
        assert.ok(files.length > 0, 'No backend JavaScript files found');
        for (const file of files) execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    });
});
