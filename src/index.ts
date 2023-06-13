import { createUnplugin } from 'unplugin';
import path from 'node:path';
import type { Options, InjectTypes } from './types';

const formatPath = (path: string) => {
    return path.replace(/\\/g, '/');
};

export const pluginName = 'unplugin-inject-js-snippet';

export default createUnplugin<Options<InjectTypes>>((options: Options<InjectTypes>, meta) => {
    const { framework } = meta;
    const { inject } = options;
    return {
        name: pluginName,
        transformInclude(id) {
            const formatId = formatPath(id);
            let shouldTransform = false;

            // WARN: 目前 webpack 不支持这样直接注入 html，得改用 webpack(compiler) 写法，不然会报以下错误
            // You may need an additional loader to handle the result of these loaders.
            if (inject === 'html' && formatId.endsWith('.html') && framework !== 'webpack') {
                const covertTemplates =
                    options.templates?.map(template => formatPath(path.resolve(process.cwd(), template))) ?? [];
                if (!covertTemplates?.length || covertTemplates.includes(formatId)) {
                    shouldTransform = true;
                }
            }
            if (inject === 'js' && /\.(js|ts)$/.test(formatId)) {
                const covertTemplates = options.templates.map(template =>
                    formatPath(path.resolve(process.cwd(), template)),
                );
                if (covertTemplates.includes(formatId)) {
                    shouldTransform = true;
                }
            }
            return shouldTransform;
        },
        transform(code) {
            const { injectJs } = options;
            if (inject === 'html' && framework !== 'webpack') {
                const injectScript = `
                    <script>
                        ${injectJs}
                    </script>
                `;
                return code.replace('</head>', `${injectScript}</head>`);
            }
            if (inject === 'js') {
                if (options.injectTag) {
                    return code.replace(options.injectTag, injectJs);
                }
                return `${code}${injectJs}`;
            }
        },
    };
});
