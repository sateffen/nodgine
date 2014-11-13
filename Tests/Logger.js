/**
 * Unittest for the logger object
 */
'use strict';
/**
 * Reference to the logger object
 *
 * @private
 * @type {$LOGGER}
 **/
var mNodgineLogger = require('../src/bootstrap.js').$LOGGER,
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
    // wait 5ms for the timeout, so the writing to the file should be finished
    global.setTimeout(function() {
        // try to read the file synchronous
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
    }, 5);
};

exports.error = function (test) {
    mNodgineLogger.writeToFile(false);
    mNodgineLogger.writeToConsole(false);

    test.doesNotThrow(function () {
        mNodgineLogger.warning('TestWarning');
    });

    test.throws(function () {
        mNodgineLogger.error('TestError');
    });

    test.done();
};

exports.setMinimumLogLevel = function (test) {
    var data = [],
    // save console.log to revert the mock up
        tmpLogFunc = console.log;

    // mock up console.log function
    console.log = function(obj) {
        data.push(obj);
    };

    // configure logger
    mNodgineLogger.writeToFile(false);
    mNodgineLogger.writeToConsole(true);
    mNodgineLogger.setMinimumLogLevel(mNodgineLogger.logLevelEnum['ALL']);

    // log the first iteration, everything should be written to the console
    mNodgineLogger.debug('DEBUG1');
    mNodgineLogger.log('LOG1');
    mNodgineLogger.warning('WARNING1');

    test.equal(data.length, 3, '$LOGGER.setMinimumLogLevel: The data array should have 3 entries at this point, has ' + data.length);

    // set minimum log-level to warning
    mNodgineLogger.setMinimumLogLevel(mNodgineLogger.logLevelEnum['WARNING']);

    // log the second iteration, only the warning should be written
    mNodgineLogger.debug('DEBUG2');
    mNodgineLogger.log('LOG2');
    mNodgineLogger.warning('WARNING2');

    test.equal(data.length, 4, '$LOGGER.setMinimumLogLevel: The data array should have 4 entries, has ' + data.length);
    test.ok(data[0].match(/DEBUG1/), '$LOGGER.setMinimumLogLevel: First entry in console.log array should be "DEBUG1", is ' + data[0]);
    test.ok(data[1].match(/LOG1/), '$LOGGER.setMinimumLogLevel: Second entry in console.log array should be "LOG1", is ' + data[1]);
    test.ok(data[2].match(/WARNING1/), '$LOGGER.setMinimumLogLevel: Third entry in console.log array should be "WARNING1", is ' + data[2]);
    test.ok(data[3].match(/WARNING2/), '$LOGGER.setMinimumLogLevel: Fourth entry in console.log array should be "WARNING2", is ' + data[3]);

    // revert mock up
    console.log = tmpLogFunc;
    mNodgineLogger.setMinimumLogLevel(mNodgineLogger.logLevelEnum['ALL']);

    test.done();
};
