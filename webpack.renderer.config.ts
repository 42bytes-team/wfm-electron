import type { Configuration } from 'webpack';

import { plugins } from './webpack.plugins';
import { rules } from './webpack.rules';

rules.push(
    {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
    },
    {
        test: /\.module\.(scss|sass)$/,
        use: [
            { loader: 'style-loader' },
            {
                loader: require.resolve('css-loader'),
                options: {
                    sourceMap: true,
                    importLoaders: 1,
                    modules: {
                        mode: 'local',
                        localIdentName: '[local]--[hash:base64:5]',
                        exportLocalsConvention: 'camelCaseOnly',
                    },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    // sassOptions: {
                    //     includePaths: [env.scssApp, env.resourcesDir],
                    // },
                    additionalData: '$env: ' + process.env.npm_lifecycle_event + ';',
                    sourceMap: true,
                },
            },
        ],
    }
);

export const rendererConfig: Configuration = {
    module: {
        rules,
    },
    plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    },
};
