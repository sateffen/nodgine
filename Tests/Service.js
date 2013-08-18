
var s = require("../Controller/Service.js");

exports.registerService = function(test) {
    var id1 = s.registerService("test", function(){return;}),
        id2 = s.registerService("test2", function(){return;});
    
    test.ok(s.getServiceById(id1));
    test.ok(s.getServiceById(id2));
    
    s.clearServices();
    test.done();
};

exports.unregisterService = function(test) {
    var id1 = s.registerService("test", function(){return;}),
        id2 = s.registerService("test2", function(){return;});
    
    test.ok(s.getServiceById(id1));
    test.ok(s.getServiceById(id2));
    
    s.unregisterService(id1);
    s.unregisterService(id2);
    
    test.equal(s.getServiceById(id1), null);
    test.equal(s.getServiceById(id2), null);
    
    s.clearServices();
    test.done();
};

exports.getService = function(test) {
    s.registerService("test", function(){return;});
    s.registerService("test2", function(){return;});
    s.registerService("test2", function(){return;});
    
    test.equal(s.getService("notDefined").length, 0);
    test.equal(s.getService("test").length, 1);
    test.equal(s.getService("test2").length, 2);
    
    s.clearServices();
    test.done();
};