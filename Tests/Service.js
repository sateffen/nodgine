
var nodgineService = require('../Bootstrap.js').$SERVICE;

exports.registerService = function(test) {
    'use strict';
    nodgineService.once('serviceRegistered', function(type) {
        test.ok(type === 'test');
        test.done();
    });

    var id1 = nodgineService.registerService('test', function(){}),
        id2 = nodgineService.registerService('test2', function(){});
    
    test.ok(nodgineService.getServiceById(id1));
    test.ok(nodgineService.getServiceById(id2));
    
    nodgineService.clearServices();
};

exports.unregisterService = function(test) {
    'use strict';
    var id1 = nodgineService.registerService('test', function(){}),
        id2 = nodgineService.registerService('test2', function(){});
    
    test.ok(nodgineService.getServiceById(id1));
    test.ok(nodgineService.getServiceById(id2));

    nodgineService.once('serviceUnregistered', function(type) {
        test.ok(type === 'test');
        test.done();
    });

    nodgineService.unregisterService(id1);
    nodgineService.unregisterService(id2);
    
    test.equal(nodgineService.getServiceById(id1), null);
    test.equal(nodgineService.getServiceById(id2), null);
    
    nodgineService.clearServices();
};

exports.getServicesByType = function(test) {
    'use strict';
    nodgineService.registerService('test', function(){});
    nodgineService.registerService('test2', function(){});
    nodgineService.registerService('test2', function(){});
    
    test.equal(nodgineService.getServicesByType('notDefined').length, 0);
    test.equal(nodgineService.getServicesByType('test').length, 1);
    test.equal(nodgineService.getServicesByType('test2').length, 2);
    
    nodgineService.clearServices();
    test.done();
};

exports.clearServices = function(test) {
    'use strict';
    nodgineService.registerService('test', function(){});
    nodgineService.once('servicesCleared', function() {
        test.equal(nodgineService.getServicesByType('test').length, 0);
        test.done();
    });
    test.equal(nodgineService.getServicesByType('test').length, 1);
    nodgineService.clearServices();
};