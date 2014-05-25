/**
 * Unittest for the global nodgine
 */

/**
 * Reference to the router object
 *
 * @private
 * @type {Nodgine}
 **/
var mNodgine = require('../Bootstrap.js'),
    mPath = require('path');

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

    var http = require('http'),
        options = {
            host: 'localhost',
            port: 1235,
            path: '/testroute',
            method: 'GET'
        };

    test.ok($SERVICE.getServiceById('testId'), 'Service with id "testId" should be found, cause it was configured');
    test.equal($SERVICE.getServicesByType('testType').length, 1, 'There should be one service found by type, cause it was configured');

    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){data+=chunk;});
        res.on('end', function() {
            test.equal(res.statusCode, 200);
            test.equal(data, 'success');
            test.done();
        });
    });
}