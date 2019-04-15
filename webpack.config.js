module.exports = {
    mode: "development",
    entry: "./index.js",
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.(ttf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'web-fonts/'
                    }
                }]
            }
        ],
    },
};
