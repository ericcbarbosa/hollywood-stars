var webpack = require('webpack');
var path = require('path');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: ['./src/app/app.js', './src/app/styles/main.less'],
        vendor: ['angular']
    },
    output: {
        path: path.join(__dirname, '/assets/js'),
        filename: 'app.bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './',
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader?exportAsEs6Default',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }, {
                test: /\.less$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].css',
                            outputPath: '../css/'
                        }
                    }, {
                        loader: 'extract-loader'
                    }, {
                        loader: 'css-loader'
                    }, {
                        loader: 'less-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.bundle.js"
        })
    ]
};