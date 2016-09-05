module.exports = {

    'build-dev': {
        description: 'Build the project for development',
        tasks: [ 'webpack:dev' ]
    },

    default: [ 'build-dev' ],

    dev: {
        description: 'Start the Webpack dev server',
        tasks: [ 'webpack-dev-server:dev' ]
    }

};
