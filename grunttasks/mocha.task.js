'use strict';
module.exports = function(grunt) {
    require('./coverage.task.js')(grunt);

    grunt.config('mochaTest', {
        run: {
            options: {
                reporter: 'spec',
                captureFile: 'test/results/result.txt',
                require: [
                    'test/setup/chai',
                    'test/setup/chaispies',
                ],
            },
            src: ['./test/tests/**/*.js'],
        },
        runDry: {
            options: {
                reporter: 'spec',
                require: [
                    'test/setup/chai',
                    'test/setup/chaispies',
                ],
            },
            src: ['./test/tests/**/*.js'],
        },
    });

    grunt.registerTask('coveredMocha', ['startCoverageCollection', 'mochaTest:run', 'stopCoverageCollection:lcov']);
    grunt.registerTask('dryCoveredMocha', ['startCoverageCollection', 'mochaTest:runDry', 'stopCoverageCollection:text']);

    grunt.loadNpmTasks('grunt-mocha-test');
};
