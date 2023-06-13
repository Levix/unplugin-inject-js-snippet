import type HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Compiler } from 'webpack';

/**
 * 通过 HtmlWebpackPlugin 获取 html template 模板文件名
 *
 * @param compiler Compiler
 * @returns string[]
 */
export const getHtmlTemplateFilenames = (compiler: Compiler) => {
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
