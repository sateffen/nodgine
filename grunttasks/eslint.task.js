'use strict';
module.exports = function (grunt) {
    grunt.config('eslint', {
        options: {
            configFile: '.eslintrc'
        },
        target: ['./src/**/*.js', './test/**/*.js', '!./test/results/**/*.js']
    });
    
    grunt.loadNpmTasks('grunt-eslint');
};