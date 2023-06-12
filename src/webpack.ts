import type HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Compiler } from 'webpack';
import { sources } from 'webpack';
import type { Options, InjectTypes } from './types';
import unplugin, { pluginName } from '.';

/**
 * 通过 HtmlWebpackPlugin 获取 html template 模板文件名
 *
 * @param compiler Compiler
 * @returns string[]
 */
const getHtmlTemplateFilenames = (compiler: Compiler) => {
    let htmlTemplateFilenames: string[] = [];
    const htmlWebpackPluginInfo = compiler.options.plugins.filter(
        plugin => plugin.constructor.name === 'HtmlWebpackPlugin',
    ) as HtmlWebpackPlugin[];
    if (htmlWebpackPluginInfo.length) {
        const userOptionFilenames = htmlWebpackPluginInfo.map(html => html.userOptions.filename);
        userOptionFilenames.forEach(userOptionFilename => {
            const filenameFunction =
                typeof userOptionFilename === 'function'
                    ? userOptionFilename
                    : (entryName: string) => userOptionFilename?.replace(/\[name\]/g, entryName);

            const entryNames = Object.keys(compiler.options.entry);
            const outputFileNames = Array.from(
                new Set((entryNames.length ? entryNames : ['main']).map(filenameFunction)),
            ).filter(item => item !== void 0) as string[];
            htmlTemplateFilenames = htmlTemplateFilenames.concat(outputFileNames);
        });
    }
    return htmlTemplateFilenames;
};

export default function (options: Options<InjectTypes>) {
    const webpackInstance = unplugin.webpack(options);
    webpackInstance.apply = async (compiler: Compiler) => {
        compiler.hooks.compilation.tap(pluginName, compilation => {
            compilation.hooks.processAssets.tap(
                {
                    name: pluginName,
                    additionalAssets: true,
                },
                assets => {
                    const htmlTemplateFilenames = getHtmlTemplateFilenames(compiler);
                    for (let name in assets) {
                        if (
                            name.endsWith('.html') &&
                            (!htmlTemplateFilenames.length ||
                                htmlTemplateFilenames.includes(name) ||
                                options.templates?.includes(name))
                        ) {
                            const injectScript = `
                                <script>
                                    ${options.injectJs}
                                </script>
                            `;
                            if (!options.templates?.length || options.templates.includes(name)) {
                                const asset = compilation.getAsset(name);
                                if (asset) {
                                    let originalSource = asset.source.source();
                                    if (originalSource instanceof Buffer) {
                                        originalSource = originalSource.toString();
                                    }
                                    const newSource = originalSource.replace('</head>', `${injectScript}</head>`);
                                    compilation.updateAsset(name, new sources.ConcatSource(newSource));
                                }
                            }
                        }
                    }
                },
            );
        });
    };

    return webpackInstance;
}
