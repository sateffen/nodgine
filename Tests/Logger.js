/**
 * Unittest for the logger
 */

var Logger   = require('../Controller/Logger.js'),
    fs  = require('fs'),
    path = require('path');

exports.writeToConsole = function(test) {
    var data = [],
        tmpLogFunc = console.log;
    console.log = function(obj) {
        data.push(obj);
    };
    
    Logger.writeToFile(false);
    Logger.writeToConsole(false);
    Logger.log("hallo1");
    Logger.writeToConsole(true);
    Logger.log("hallo2");
    
    console.log = tmpLogFunc;
    
    test.equal(data.length, 1);
    test.notEqual(data[0].match(/hallo2/), null);
    test.done();
};

exports.writeToFile = function(test) {
    var filePath = path.resolve('test.log');
    Logger.setLogFile(filePath);
    Logger.writeToFile(false);
    Logger.writeToConsole(false);
    Logger.log("hallo1");
    Logger.writeToFile(true);
    Logger.log("hallo2");
    
    process.nextTick(function(){
        try {
            var fileContent = fs.readFileSync(filePath, {encoding: "utf-8"});
            test.equal(fileContent.match(/hallo1/), null);
            test.notEqual(fileContent.match(/hallo2/), null);
        }
        catch (e) {
            test.ok(false, e.message);
        }
        test.done();
        fs.unlink(filePath);
    });
};