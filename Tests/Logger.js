/**
 * Unittest for the logger
 */

var nodgineLogger = require('../Controller/Logger.js'),
    fs  = require('fs'),
    path = require('path');

exports.writeToConsole = function(test) {
    'use strict';
    var data = [],
        tmpLogFunc = console.log;
    console.log = function(obj) {
        data.push(obj);
    };
    
    nodgineLogger.writeToFile(false);
    nodgineLogger.writeToConsole(false);
    nodgineLogger.log('hallo1');
    nodgineLogger.writeToConsole(true);
    nodgineLogger.log('hallo2');
    
    console.log = tmpLogFunc;
    
    test.equal(data.length, 1);
    test.notEqual(data[0].match(/hallo2/), null);
    test.done();
};

exports.writeToFile = function(test) {
    'use strict';
    var filePath = path.resolve('test.log');
    nodgineLogger.setLogFile(filePath);
    nodgineLogger.writeToFile(false);
    nodgineLogger.writeToConsole(false);
    nodgineLogger.log('hallo1');
    nodgineLogger.writeToFile(true);
    nodgineLogger.log('hallo2');
    
    process.nextTick(function(){
        try {
            var fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'});
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