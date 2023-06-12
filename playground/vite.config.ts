import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import fs from 'node:fs';
import Unplugin from '../src/vite';

export default defineConfig({
    plugins: [
        Inspect(),
        Unplugin({
            inject: 'js',
            injectJs: fs.readFileSync('./inject.js', 'utf-8'),
            transformFilenames: ['./main.ts'],
        }),
    ],
});
