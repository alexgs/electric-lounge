var webpack = require( 'webpack' );
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

module.exports = {

    devtool: 'source-map',

    output: {
        path: './dist',
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin( '[name].css' ),
        new webpack.HotModuleReplacementPlugin()
    ],

};
