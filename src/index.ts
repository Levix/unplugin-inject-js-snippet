import { createUnplugin } from 'unplugin';
import type { Options, InjectTypes } from './types';
import path from 'node:path';

export default createUnplugin<Options<InjectTypes>>((options: Options<InjectTypes>) => {
    const { inject } = options;
    return {
        name: 'unplugin-inject-js-snippet',
        transformInclude(id) {
            let shouldTransform = false;
            if (inject === 'html' && id.endsWith('.html')) {
                const covertTemplates =
                    options.templates?.map(template => path.resolve(process.cwd(), template).replace(/\\/g, '/')) ?? [];
                if (!covertTemplates?.length || covertTemplates.includes(id)) {
                    shouldTransform = true;
                }
            }
            if (inject === 'js' && /\.(js|ts)$/.test(id)) {
                const covertTemplates = options.templates.map(template =>
                    path.resolve(process.cwd(), template).replace(/\\/g, '/'),
                );
                if (covertTemplates.includes(id)) {
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
