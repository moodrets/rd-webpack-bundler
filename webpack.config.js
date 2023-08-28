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
    entry: './src/js/app.ts',
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        ...initPages([
            {template: 'main.twig', filename: 'index.html'},
            {template: 'test.twig', filename: 'test.html'},
        ]),
        new MiniCssExtractPlugin({
            filename: "./css/[name].[hash].css"
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: isDev ? true: false,
            __VUE_PROD_DEVTOOLS__: isDev ? true: false,
        }),
        new SpriteLoaderPlugin({ 
            plainSprite: true,
            spriteAttrs: {
                'style': 'position: absolute; left: -9999px; top: -9999px;'
            }
         })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                exclude: /node_modules/
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
                test: /\.svg$/,
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, 'src/assets/icons'),
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
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: 'asset/resource',
                exclude: [
                    path.resolve(__dirname, 'src/assets/icons'),
                ],
                generator: {
                    filename: './img/[name][ext]',
                },
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.vue'],
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