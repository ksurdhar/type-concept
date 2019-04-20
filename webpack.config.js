module.exports = {
    mode: "development",
    entry: "./renderer-components/index.js",
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js"
    }
};
