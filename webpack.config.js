const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, './src/main.js'),
    },
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'To-do List',
            filename: 'index.html',
            template: path.resolve(__dirname, './src/template.html')
        }),
    ],
}