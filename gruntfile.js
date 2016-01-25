'use strict';
module.exports = function (grunt) {
    // load all task configurations
    require('./grunttasks/clean.task.js')(grunt);
    require('./grunttasks/eslint.task.js')(grunt);
    require('./grunttasks/coverage.task.js')(grunt);
    require('./grunttasks/mocha.task.js')(grunt);
    require('./grunttasks/watch.task.js')(grunt);

    // and register main tasks
    grunt.registerTask('test', ['clean:test', 'eslint', 'coveredMocha']);
    grunt.registerTask('dryTest', ['eslint', 'dryCoveredMocha']);
};
