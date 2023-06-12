import { createUnplugin } from 'unplugin';
import type { Options, InjectTypes } from './types';
import path from 'node:path';

const formatPath = (path: string) => {
    return path.replace(/\\/g, '/');
};

export default createUnplugin<Options<InjectTypes>>((options: Options<InjectTypes>) => {
    const { inject } = options;
    return {
        name: 'unplugin-inject-js-snippet',
        transformInclude(id) {
            const formatId = formatPath(id);
            let shouldTransform = false;
            if (inject === 'html' && formatId.endsWith('.html')) {
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
            if (inject === 'html') {
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
                return `${injectJs}${code}`;
            }
        },
    };
});
