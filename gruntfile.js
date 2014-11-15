module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            dist: {
                files: [
                    {expand: true, src: ['src/**/*'],     dest: 'dist/'},
                    {expand: true, src: ['package.json'], dest: 'dist/'},
                    {expand: true, src: ['LICENSE'],      dest: 'dist/'},
                    {expand: true, src: ['README.md'],    dest: 'dist/'}
                ]
            }
        },
        clean: {
            dist: ['dist/'],
            doc: ['docs/']
        },
        nodeunit: {
            all: ['Tests/*.js']
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'test/results/tests.txt',
                    require: 'test/coverage/blanket',
                    clearRequireCache: true
                },
                src: ['./test/tests/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'test/results/coverage.html'
                },
                src: ['./test/tests/**/*.js']
            }
        },
        jsdoc : {
            dist : {
                src: ['src/**/*.js'],
                options: {
                    destination: 'docs',
                    private: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['nodeunit:all', 'clean:dist', 'copy:dist']);
    grunt.registerTask('doc', ['clean:doc', 'jsdoc']);
    grunt.registerTask('test', ['nodeunit']);
};
