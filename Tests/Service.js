/**
 * Unittest for the service object
 */

/**
 * Reference to the service object
 *
 * @private
 * @type {$SERVICE}
 **/
var nodgineService = require('../Bootstrap.js').$SERVICE;

/*
* Tests the $SERVICE.registerService function
*/
exports.registerService = function(test) {
    'use strict';
    // register to get the serviceRegistered event once
    nodgineService.once('serviceRegistered', function(type) {
        test.ok(type === 'test', 'The type propagated by the serviceRegistered event should be \'test\', got ' + type);
        test.done();
    });

    // register zwei services
    var id1 = nodgineService.registerService('test', function(){}),
        id2 = nodgineService.registerService('test2', function(){});

    // check, whether services are set
    test.ok(nodgineService.getServiceById(id1), 'The service with the first id should be found');
    test.ok(nodgineService.getServiceById(id2), 'The service with the second id should be found');

    // cleanup all services
    nodgineService.clearServices();
};

/*
* Tests the $SERVICE.unregisterService function
*/
exports.unregisterService = function(test) {
    'use strict';
    // register two services for the test
    var id1 = nodgineService.registerService('test', function(){}),
        id2 = nodgineService.registerService('test2', function(){});

    //
    test.ok(nodgineService.getServiceById(id1), 'The service with the first id should be found');
    test.ok(nodgineService.getServiceById(id2), 'The service with the second id should be found');

    // register once for the serviceUnregistered event
    nodgineService.once('serviceUnregistered', function(type) {
        test.ok(type === 'test', 'The type propagated by the serviceUnregistered event should be \'test\', got ' + type);
        test.done();
    });

    // unregister both services
    nodgineService.unregisterService(id1);
    nodgineService.unregisterService(id2);

    // check whether both unregistered services are null, like expected
    test.equal(nodgineService.getServiceById(id1), null, 'The service with the first id shouldn\' be found');
    test.equal(nodgineService.getServiceById(id2), null, 'The service with the second id shouldn\' be found');

    // cleanup all services
    nodgineService.clearServices();
};

/*
* Tests the $SERVICE.getServicesByType function
*/
exports.getServicesByType = function(test) {
    'use strict';
    // setup some test services
    nodgineService.registerService('test', function(){});
    nodgineService.registerService('test2', function(){});
    nodgineService.registerService('test2', function(){});

    // test the length of arrays returned by the function
    test.equal(nodgineService.getServicesByType('notDefined').length, 0);
    test.equal(nodgineService.getServicesByType('test').length, 1);
    test.equal(nodgineService.getServicesByType('test2').length, 2);

    // cleanup all services
    nodgineService.clearServices();
    test.done();
};