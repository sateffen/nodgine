
module.exports.load = function(test) {
    var a   = require("../Controller/Application.js"),
        path = "./Tests/ApplicationTest/";
    a.addLoadPath(path);
    
    test.equal(a.load("TestObject"), require("./ApplicationTest/TestObject.js"));
    test.done();
};

module.exports.create = function(test) {
    var a   = require("../Controller/Application.js"),
        path = "./Tests/ApplicationTest";
    a.addLoadPath(path);
    
    test.equal(typeof a.create("TestObject"), typeof (new (require("./ApplicationTest/TestObject.js"))()));
    test.done();
};