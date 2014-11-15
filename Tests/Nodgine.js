/**
 * Unittest for the global nodgine
 */
'use strict';
/* global $APPLICATION, $LOGGER, $ROUTER, $SERVICE*/
/**
 * Reference to the router object
 *
 * @private
 * @type {Nodgine}
 **/
var mNodgine = require('../src/bootstrap.js'),
    mPath = require('path');

/**
 * Define a setup, and clean up before every call
 */
exports.tearDown = function (done) {
    global.$APPLICATION = undefined;
    global.$LOGGER = undefined;
    global.$SERVICE = undefined;
    global.$ROUTER = undefined;

    done();
};

exports.globalize = function(test) {
    mNodgine.globalize();

    test.strictEqual($APPLICATION, mNodgine.$APPLICATION, 'The $APPLICATION object should be global.');
    test.strictEqual($LOGGER,      mNodgine.$LOGGER,      'The $LOGGER object should be global.');
    test.strictEqual($ROUTER,      mNodgine.$ROUTER,      'The $ROUTER object should be global.');
    test.strictEqual($SERVICE,     mNodgine.$SERVICE,     'The $SERIVCE object should be global.');

    test.done();
};

exports.loadFromFile = function(test) {
    mNodgine.loadFromFile(mPath.join(__dirname, './NodgineTest/TestNodgine.json'));

    test.strictEqual($APPLICATION, mNodgine.$APPLICATION, 'The $APPLICATION object should be global.');
    test.strictEqual($LOGGER,      mNodgine.$LOGGER,      'The $LOGGER object should be global.');
    test.strictEqual($ROUTER,      mNodgine.$ROUTER,      'The $ROUTER object should be global.');
    test.strictEqual($SERVICE,     mNodgine.$SERVICE,     'The $SERIVCE object should be global.');

    var http = require('http'),
        options = {
            host: 'localhost',
            port: 1235,
            path: '/nodginetestroute',
            method: 'GET'
        };

    test.ok($SERVICE.getServiceById('testId'), 'Service with id "testId" should be found, cause it was configured');
    test.equal($SERVICE.getServicesByType('testType').length, 1, 'There should be one service found by type, cause it was configured');

    var originalConsoleLog = console.log;
    var consoleLogData = null;
    console.log = function (message) {
        consoleLogData = message;
    };

    $LOGGER.log('LOG');
    test.equal(consoleLogData, null, 'console.log should not have been called');
    $LOGGER.warning('WARN');
    test.ok(consoleLogData.match(/WARN/), 'The console.log log should contain WARN');

    console.log = originalConsoleLog;

    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){data+=chunk;});
        res.on('end', function() {
            test.equal(res.statusCode, 200, 'Statuscode should be 200');
            test.equal(data, 'presuccesspost', 'Answer should be presuccesspost, a combination of preprocessor, route-controller and postprocessor');
            test.done();
        });
    });
};

module.exports.requireNodgine = function (test) {
    var nodgine;
    test.doesNotThrow(function () {
        nodgine = require('../');
    }, '$APPLICATION.requireNodgine: Nodgine could not be required');

    test.notEqual(nodgine, undefined, '$APPLICATION.requireNodgine: Nodgine should not be undefined');
    test.equal(typeof nodgine, 'object', '$APPLICATION.requireNodgine: Nodgine should have type "object", is' + (typeof nodgine));

    test.done();
};
