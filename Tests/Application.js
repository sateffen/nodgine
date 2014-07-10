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
var mPath = require('path');

/*
* This Test checks, whether the $APPLICATION.load() function works properly, in conjunction with the addLoadPath function
*/
module.exports.load = function(test) {
    'use strict';
    var $APPLICATION = require('../Bootstrap.js').$APPLICATION,
        path = mPath.resolve('./Tests/ApplicationTest/');
    $APPLICATION.addLoadPath(path);

    // test whether the loaded object and the directly required object is the same
    test.equal($APPLICATION.load('TestObject')(), require('./ApplicationTest/TestObject.js')(), '$APPLICATION.load: ' +
        'Required and loaded object should be the same');
    test.done();
};