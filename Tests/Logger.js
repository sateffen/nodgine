/**
 * Unittest for the logger object
 */

/**
 * Reference to the logger object
 *
 * @private
 * @type {$LOGGER}
 **/
var mNodgineLogger = require('../bootstrap.js').$LOGGER,
    /**
     * Reference to the fs object
     *
     * @private
     * @type {fs}
     **/
    mFs  = require('fs'),
    /**
     * Reference to the path object
     *
     * @private
     * @type {mPath}
     **/
    mPath = require('path');

/*
 * This test checks, whether the $LOGGER.writeToConsole function works the right way
 */
exports.writeToConsole = function(test) {
    'use strict';
    var data = [],
    // save console.log to revert the mock up
        tmpLogFunc = console.log;

    // mock up console.log function
    console.log = function(obj) {
        data.push(obj);
    };

    // configure logger to use not file nor console
    mNodgineLogger.writeToFile(false);
    mNodgineLogger.writeToConsole(false);
    // this shouldn't be recognized by the logger
    mNodgineLogger.log('hallo1');
    // set the logger to use the console
    mNodgineLogger.writeToConsole(true);
    // write something to the console
    mNodgineLogger.log('hallo2');

    // revert mock up
    console.log = tmpLogFunc;

    // test the content written to console
    test.equal(data.length, 1, 'The console.log function should only be called one time');
    test.ok(data[0].match(/hallo2/), 'The one entry in console.log should be "hallo2"');
    test.done();
};

/*
*  This test checks, whether the $LOGGER.writeToFile function works the right way
*/
exports.writeToFile = function(test) {
    'use strict';
    // setup the logfile to use
    var filePath = mPath.resolve('test.log');
    mNodgineLogger.setLogFile(filePath);
    // configure logger to use not file nor console
    mNodgineLogger.writeToFile(false);
    mNodgineLogger.writeToConsole(false);
    // this shouldn't be recognized by logger
    mNodgineLogger.log('hallo1');
    // now configure the logger to use the logfile
    mNodgineLogger.writeToFile(true);
    // write something to the file
    mNodgineLogger.log('hallo2');

    // at the next tick, execute the tests
    // this has to be on the next tick, cause so the writing to the file has finished
    process.nextTick(function() {
        // try to read the file syncronious
        try {
            // read the file content
            var encoding = (process.versions.uv === '0.8') ? 'utf8' : {encoding: 'utf8'};
            var fileContent = mFs.readFileSync(filePath, encoding);
            test.equal(fileContent.match(/hallo1/), null, 'The logfile shouldn\'t contain "hallo1", cause for the time this was deacitivated');
            test.notEqual(fileContent.match(/hallo2/), null, 'The logfile should contain "hallo2"');
        }
        catch (e) {
            test.ok(false, 'Can\' read the logfile: ' + e.message);
        }
        test.done();
        // unlink the logfile to clean up
        mFs.unlink(filePath);
    });
};