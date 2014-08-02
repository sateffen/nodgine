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
            dist: ['dist/'],
            doc: ['Docs/']
        },
        nodeunit: {
            all: ['Tests/*.js']
        },
        jsdoc : {
            dist : {
                src: ['bootstrap.js', 'Controller/*.js'],
                options: {
                    destination: 'Docs',
                    private: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['nodeunit:all', 'clean:dist', 'copy:dist']);
    grunt.registerTask('doc', ['clean:doc', 'jsdoc']);
    grunt.registerTask('test', ['nodeunit']);
};