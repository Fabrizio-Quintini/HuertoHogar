// babel-plugin-istanbul instrumenta cada modulo por separado, de modo que la
// cobertura queda atribuida al archivo original y no al bundle. Sin esto,
// karma-coverage solo puede medir los .spec.js (karma-webpack 5 no entrega los
// source maps que permitirían reasignar la cobertura del bundle a sus modulos).
// Las pruebas y el archivo de entorno se excluyen: se mide el codigo de la
// aplicacion, no el andamiaje de pruebas.
const instrumentacionCobertura = [
    'babel-plugin-istanbul',
    {
        exclude: [
            '**/*.spec.js',
            'src/test/**',
            'src/index.js',
            '**/node_modules/**'
        ]
    }
];

// Instrumentador inerte: deja el archivo tal cual. Se aplica a los .spec.js para
// que karma-coverage no genere una entrada espuria por cada prueba (la
// instrumentacion real ya la hace babel-plugin-istanbul modulo a modulo).
function sinInstrumentar() {
    return {
        instrument: function (contenido, ruta, callback) {
            callback(null, contenido);
        },
        lastSourceMap: function () {
            return null;
        },
        lastFileCoverage: function () {
            return null;
        }
    };
}

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

// El archivo de entorno se declara antes que los specs para que webpack lo
// empaquete en el mismo bundle: al ejecutarse en el mismo contexto, el
// `expect.extend` de los matchers queda disponible para todas las pruebas.
// Declararlo en `setupFiles` no alcanzaba, porque karma-webpack lo compilaba
// aparte y los matchers nunca llegaban al bundle de specs.
files: [
            { pattern: 'src/test/setup.js', watched: true },
            { pattern: 'src/**/*.spec.js', watched: true }
        ],

// 'coverage' se aplica despues de 'webpack' para instrumentar el codigo de la
// aplicacion (no el de las propias pruebas) y poder medir la cobertura.
preprocessors: {
            'src/test/setup.js': ['webpack'],
            'src/**/*.spec.js': ['webpack', 'coverage']
        },

        webpack: {
            mode: 'development',
            // Mapa de fuentes en linea para que los errores apunten al codigo original.
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
                                ],
                                plugins: [instrumentacionCobertura]
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
            // Cada spec se empaqueta por separado, sin extraer los modulos
            // compartidos a un bundle aparte.
            optimization: {
                splitChunks: false,
                runtimeChunk: false
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
            },
            clearContext: false
        },

// Un unico archivo (src/test/setup.js) levanta el entorno: matchers de
// jest-dom sobre el expect de Jasmine y reseteo de localStorage entre pruebas.

plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-webpack'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage')
        ],

        reporters: ['progress', 'kjhtml', 'coverage'],

        // Instrumentacion para el analisis de resultados. `check` hace fallar
        // la ejecucion si la cobertura baja del umbral, de modo que una
        // regresion de cobertura rompe el build en lugar de pasar inadvertida.
        coverageReporter: {
            dir: 'coverage',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'text-summary' },
                { type: 'lcovonly', subdir: 'lcov' }
            ],
            includeAllSources: false,
            instrumenters: {
                inerte: sinInstrumentar
            },
            instrumenter: {
                '**/*.spec.js': 'inerte'
            },
            check: {
                global: {
                    statements: 75,
                    branches: 70,
                    functions: 75,
                    lines: 75
                }
            }
        },

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