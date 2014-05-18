module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            dist: {
                files: [
                    {expand: true, src: ['Controller/*'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, src: ['Lib/**/*'],     dest: 'dist/'},
                    {expand: true, src: ['package.json'], dest: 'dist/'},
                    {expand: true, src: ['bootstrap.js'], dest: 'dist/'},
                    {expand: true, src: ['LICENSE'],      dest: 'dist/'},
                    {expand: true, src: ['README.md'],    dest: 'dist/'}
                ]
            }
        },
        clean: {
            dist: ['dist/']
        },
        nodeunit: {
            all: ['Tests/*.js']
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: [
                        "dist"
                    ],
                    outdir: 'Docs/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('default', ['nodeunit:all', 'clean:dist', 'copy:dist']);
    grunt.registerTask('doc', ['clean:dist', 'copy:dist', 'yuidoc']);
    grunt.registerTask('test', ['nodeunit']);
};