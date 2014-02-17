
module.exports.load = function(test) {
    "use strict";
    var a   = require("../Controller/Application.js"),
        path = "./Tests/ApplicationTest/";
    a.addLoadPath(path);
    
    test.equal(a.load("TestObject"), require("./ApplicationTest/TestObject.js"));
    test.done();
};