/**
 * Unittest for the application object
 *
 * This tests only the load function and it's mechanisms, cause the other functions are trivial and hopefuly not buggy or to change
 */

/**
 * Reference to the path object
 *
 * @private
 * @type {path}
 **/
var mPath = require('path'),
    $APPLICATION = require('../bootstrap.js').$APPLICATION;

/*
* This Test checks, whether the $APPLICATION.load() function works properly, in conjunction with the addLoadPath function
*/
module.exports.load = function(test) {
    'use strict';
    var path = mPath.resolve('./Tests/ApplicationTest/');
    $APPLICATION.addLoadPath(path);

    // test whether the loaded object and the directly required object is the same
    test.equal($APPLICATION.load('TestObject')(), require('./ApplicationTest/TestObject.js')(), '$APPLICATION.load: ' +
        'Required and loaded object should be the same');
    test.done();
};

/*
 * This Test checks, whether the $APPLICATION.load() function works properly, in conjunction with the addLoadPath function
 */
module.exports.runApplication = function (test) {
    var timeout = setTimeout(function () {
        test.ok(false, '$APPLICATION.runApplication did not throw the "startApplication" event.');
        test.done();
    }, 100);

    $APPLICATION.on('startApplication', function () {
        clearTimeout(timeout);
        test.ok(true);
        test.done();
    });

    $APPLICATION.runApplication();
}

/*
 * This Test checks, whether the $APPLICATION.load() function works properly, in conjunction with the addLoadPath function
 */
module.exports.stopApplication = function (test) {
    var timeout = setTimeout(function () {
        test.ok(false, '$APPLICATION.stopApplication did not throw the "stopApplication" event.');
        test.done();
    }, 100);

    $APPLICATION.on('stopApplication', function () {
        clearTimeout(timeout);
        test.ok(true);
        test.done();
    });

    $APPLICATION.stopApplication();
}