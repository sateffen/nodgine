'use strict';
module.exports = function(grunt) {
    grunt.config('clean', {
        test: ['test/results'],
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
};
