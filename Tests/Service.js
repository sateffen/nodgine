/**
 * Unittest for the service object
 */

/**
 * Reference to the service object
 *
 * @private
 * @type {$SERVICE}
 **/
var nodgineService = require('../bootstrap.js').$SERVICE;

/*
 * Tests the $SERVICE.clearServices function
 */
exports.clearServices = function(test) {
    'use strict';

    // register two services
    nodgineService.registerService('testid', 'testtype', function(){})
        .registerService('testid2', 'testtype2', function(){});

    // check, whether services are set
    test.ok(nodgineService.getServiceById('testid'), 'The service with the first id should be found');
    test.ok(nodgineService.getServiceById('testid2'), 'The service with the second id should be found');

    // cleanup all services
    nodgineService.clearServices();

    // check whether the services are gone
    test.ok(!nodgineService.getServiceById('testid'), 'The service with the first id should not be found');
    test.ok(!nodgineService.getServiceById('testid2'), 'The service with the second id should not be found');

    test.done();
};

/*
* Tests the $SERVICE.registerService function
*/
exports.registerService = function(test) {
    'use strict';
    // register to get the serviceRegistered event once
    nodgineService.once('serviceRegistered', function(type, id) {
        test.ok(type === 'testtype', 'The type propagated by the serviceRegistered event should be \'testtype\', got ' + type);
        test.ok(id === 'testid', 'The type propagated by the serviceRegistered event should be \'testid\', got ' + id);
        test.done();
    });

    // register two services
    nodgineService.registerService('testid', 'testtype', function(){})
        .registerService('testid2', 'testtype2', function(){});

    // check, whether services are set
    test.ok(nodgineService.getServiceById('testid'), 'The service with the first id should be found');
    test.ok(nodgineService.getServiceById('testid2'), 'The service with the second id should be found');

    // cleanup all services
    nodgineService.clearServices();
};

/*
* Tests the $SERVICE.unregisterService function
*/
exports.unregisterService = function(test) {
    'use strict';
    // register two services for the test
    nodgineService.registerService('testid', 'testtype', function(){})
        .registerService('testid2', 'testtype2', function(){});

    //
    test.ok(nodgineService.getServiceById('testid'), 'The service with the first id should be found');
    test.ok(nodgineService.getServiceById('testid2'), 'The service with the second id should be found');

    // register once for the serviceUnregistered event
    nodgineService.once('serviceUnregistered', function(type, id) {
        test.ok(type === 'testtype', 'The type propagated by the serviceUnregistered event should be \'test\', got ' + type);
        test.ok(id === 'testid', 'The type propagated by the serviceUnregistered event should be \'test\', got ' + type);
        test.done();
    });

    // unregister both services
    nodgineService.unregisterService('testid');
    nodgineService.unregisterService('testid2');

    // check whether both unregistered services are null, like expected
    test.equal(nodgineService.getServiceById('testid'), null, 'The service with the first id shouldn\' be found');
    test.equal(nodgineService.getServiceById('testid2'), null, 'The service with the second id shouldn\' be found');

    // cleanup all services
    nodgineService.clearServices();
};

/*
* Tests the $SERVICE.getServicesByType function
*/
exports.getServicesByType = function(test) {
    'use strict';
    // setup some test services
    nodgineService.registerService('testid', 'test', function(){})
        .registerService('testid2', 'test2', function(){})
        .registerService('testid3','test2', function(){});

    // test the length of arrays returned by the function
    test.equal(nodgineService.getServicesByType('notDefined').length, 0);
    test.equal(nodgineService.getServicesByType('test').length, 1);
    test.equal(nodgineService.getServicesByType('test2').length, 2);

    // cleanup all services
    nodgineService.clearServices();
    test.done();
};