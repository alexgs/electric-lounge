'use strict';
let gruntWebpack = require( '../config/grunt-webpack.js' );

module.exports = {
    options: gruntWebpack.devServer,
    dev: {
        webpack: gruntWebpack.dev
    }
};
