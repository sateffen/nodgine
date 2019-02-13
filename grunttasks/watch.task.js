'use strict';
module.exports = function(grunt) {
    grunt.config('watch', {
        test: {
            files: ['src/**/*.js', 'test/tests/**/*.js'],
            tasks: ['mochaTest:runDry'],
            options: {
                interrupt: true,
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};
