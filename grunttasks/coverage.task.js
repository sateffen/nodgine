'use strict';
module.exports = function(grunt) {
    const path = require('path');
    const istanbul = require('istanbul');

    grunt.registerTask('startCoverageCollection', '', function() {
        const srcDir = path.resolve(__dirname, '../src');
        const instrumenter = new istanbul.Instrumenter();
        const matcher = (aFileName) => {
            return path.resolve(aFileName).indexOf(srcDir) > -1;
        };

        istanbul.hook.hookRequire(matcher, instrumenter.instrumentSync.bind(instrumenter));
    });

    grunt.registerTask('stopCoverageCollection', function(aReporter) {
        istanbul.hook.unhookRequire();
        const targetDirectory = path.resolve(__dirname, '../test/results');
        const collector = new istanbul.Collector();
        const reporter = aReporter || 'text';
        let reporterOptions = undefined;

        collector.add(global.__coverage__);

        // and finally generate the report
        if (aReporter.substr(0, 4) !== 'text') {
            reporterOptions = {
                dir: targetDirectory,
            };
        }

        istanbul.Report
            .create(reporter, reporterOptions)
        // but do it sync (second param)
            .writeReport(collector, true);
    });
};
