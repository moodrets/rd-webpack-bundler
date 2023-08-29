const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const mode = process.argv.find(arg => arg.includes('development') || arg.includes('production'))
const isDev = mode === 'development'
const isProd = mode === 'production'

const webpackDevOptions = {}

if (isDev) {
    webpackDevOptions['devtool'] = 'source-map'
}

const initPages = (pages) => {
    return pages.map(page => new HtmlWebpackPlugin({
        filename: `${page.filename}`,
        template: path.resolve(__dirname, `src/pages/${page.template}`)
    }))
}

module.exports = {
    ...webpackDevOptions,
    entry: './src/scripts/app.ts',
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        ...initPages([
            {template: 'main.twig', filename: 'index.html'},
        ]),
        new MiniCssExtractPlugin({
            filename: "./css/[name].[contenthash].css"
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: isDev ? true: false,
            __VUE_PROD_DEVTOOLS__: isDev ? true: false,
        }),
        new SpriteLoaderPlugin({ 
            plainSprite: true,
            spriteAttrs: {
                style: 'position: absolute; left: -9999px; top: -9999px;',
                id: `svg_sprite_${Date.now()}`
            }
         })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                exclude: /node_modules/
            },
            {
                test: /\.ts?$/,
                use: {
                    loader:'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
                exclude: /node_modules/,
            },
            
            {
                test: /\.twig$/,
                use: ['raw-loader', 'twig-html-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: './fonts/[name][ext]',
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: 'asset/resource',
                exclude: [
                    path.resolve(__dirname, 'src/assets/icons'),
                ],
                generator: {
                    filename: './img/[name][ext]',
                },
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, 'src/assets/icons/'),
                ],
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`,
                            publicPath: '../src/assets/'
                        }
                    },
                    'svgo-loader'
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.vue', '.scss'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 3131,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
};