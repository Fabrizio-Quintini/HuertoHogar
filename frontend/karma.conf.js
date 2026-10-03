module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        files: [{ pattern: 'src/**/*.spec.js', watched: true }],

        preprocessors: {
            'src/**/*.spec.js': ['webpack']
        },

        webpack: {
            mode: 'development',
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', { targets: { chrome: '90' } }],
                                    ['@babel/preset-react', { runtime: 'automatic' }]
                                ]
                            }
                        }
                    },
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader']
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.jsx']
            },
            performance: {
                hints: false
            }
        },

        webpackMiddleware: {
            stats: 'errors-only'
        },

        client: {
            jasmine: {
                random: false
            }
        },

        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
            }
        },
        singleRun: true,
        concurrency: 1,
        browserNoActivityTimeout: 60000,
        restartOnFileChange: true
    });
};
