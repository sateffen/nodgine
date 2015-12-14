
'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            test: ['test/results']
        },
        mochaTest: {
            default: {
                options: {
                    reporter: 'spec',
                    captureFile: 'test/results/result.txt',
                    require: [
                        'test/setup/blanket',
                        'test/setup/chai',
                        'test/setup/chaispies'
                    ]
                },
                src: ['./test/tests/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'test/results/coverage.html'
                },
                src: ['test/tests/**/*.js']
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: ['./src/**/*.js', './test/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('test', ['clean:test', 'eslint', 'mochaTest']);
};
