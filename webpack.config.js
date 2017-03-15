var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./entry.js",
    output: {
        path: path.join(__dirname),
        filename: "bundle.js"
    },
    module: {
        loaders: []
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin({minimize: false})
    ]
};