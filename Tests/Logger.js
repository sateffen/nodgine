/**
 * Unittest for the logger
 */

var l   = require("../Controller/Logger.js"),
    fs  = require("fs");

exports.writeToConsole = function(test) {
    var data = [],
        tmpLogFunc = console.log;
    console.log = function(obj) {
        data.push(obj);
    };
    
    l.writeToFile(false);
    l.writeToConsole(false);
    l.log("hallo1");
    l.writeToConsole(true);
    l.log("hallo2");
    
    console.log = tmpLogFunc;
    
    test.equal(data.length, 1);
    test.notEqual(data[0].match(/hallo2/), null);
    test.done();
};

exports.writeToFile = function(test) {
    l.setLogFile("/tmp/test.log");
    l.writeToFile(false);
    l.writeToConsole(false);
    l.log("hallo1");
    l.writeToFile(true);
    l.log("hallo2");
    
    process.nextTick(function(){
        try {
            var fileContent = fs.readFileSync("/tmp/test.log", {encoding: "utf-8"});
            test.equal(fileContent.match(/hallo1/), null);
            test.notEqual(fileContent.match(/hallo2/), null);
        }
        catch (e) {
            test.ok(false, e.message);
        }
        test.done();
        fs.unlink("/tmp/test.log");
    });
};