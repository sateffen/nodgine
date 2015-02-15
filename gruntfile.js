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
            all: ['./test/oldtests/*.js']
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'progress',
                    captureFile: 'test/results/tests.txt',
                    require: 'test/coverage/blanket'
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
        },
        jshint: {
            all: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['mochaTest:test', 'clean:dist', 'copy:dist']);
    grunt.registerTask('doc', ['clean:doc', 'jsdoc']);
    grunt.registerTask('test', ['mochaTest', 'jshint']);
};
