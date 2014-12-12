'use strict';

var chai = require('chai'),
    expect = chai.expect,
    mPath = require('path'),
    mLogger = require('../../src/bootstrap.js').$LOGGER;

chai.use(require('chai-spies'));

describe('The $LOGGER should work as intended', function () {
    describe('All types of logging should work as intended, when {minLogLevel: ALL, console: true, file: false, file: testLogFile.txt}',
             function () {
        var originalConsoleLog = console.log,
            originalConsoleLogArgument = '';

        beforeEach(function () {
            console.log = chai.spy(function (arg1) { originalConsoleLogArgument = arg1; });
        });

        afterEach(function () {
            console.log = originalConsoleLog;
            originalConsoleLogArgument = '';
        });
        
        it ('should work setting the logger to write to console', function () {
            function doWriteToConsole() {
                mLogger.writeToConsole(true);
            }

            expect(doWriteToConsole).not.to.throw();
        });

        it('should work setting the logger not to write to file', function () {
            function doNotWriteToFile() {
                mLogger.writeToFile(false);
            }

            expect(doNotWriteToFile).not.to.throw();
        });

        it('should work setting the logfile to a new file', function () {
            var logFile = mPath.resolve(__dirname, './testLogFile.txt');

            function doSetFile() {
                mLogger.setLogFile(logFile);
            }

            expect(doSetFile).not.to.throw();
        });

        it('should work setting the minimum log level to all', function () {
            function setMinimumLogLevel() {
                mLogger.setMinimumLogLevel(mLogger.logLevelEnum['ALL']);
            }

            expect(setMinimumLogLevel).not.to.throw();
        });

        it('should log errors as intended', function () {
            var errorMsgRegex = /^\[ERROR\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) TestError$/;

            function logError() {
                mLogger.error('TestError');
            }

            expect(logError).to.throw();
            expect(console.log).to.be.called.once();
            expect(originalConsoleLogArgument).to.match(errorMsgRegex);
        });

        it('should log warnings as intended', function () {
            var warningMsgRegex = /^\[WARNING\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) TestWarning$/;

            function logWarning() {
                mLogger.warning('TestWarning');
            }

            expect(logWarning).not.to.throw();
            expect(console.log).to.be.called.once();
            expect(originalConsoleLogArgument).to.match(warningMsgRegex);
        });

        it('should log logmessages as intended', function () {
            var logMsgRegex = /^\[LOG\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) TestLog$/;

            function logLogMessage() {
                mLogger.log('TestLog');
            }

            expect(logLogMessage).not.to.throw();
            expect(console.log).to.be.called.once();
            expect(originalConsoleLogArgument).to.match(logMsgRegex);
        });

        it('should log debug as intended', function () {
            var debugMsgRegex = /^\[DEBUG\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) TestDebug$/;

            function logDebug() {
                mLogger.debug('TestDebug');
            }

            expect(logDebug).not.to.throw();
            expect(console.log).to.be.called.once();
            expect(originalConsoleLogArgument).to.match(debugMsgRegex);
        });
    });

    describe('Writing to a file should work as intended', function () {
        var logFile = mPath.resolve(__dirname, './testLogFile.txt'),
            fs = require('fs'),
            originalConsoleLog = console.log,
            originalConsoleLogArgument = '';

        before(function () {
            if (fs.existsSync(logFile)) {
                fs.unlinkSync(logFile);
            }
        });
        
        after(function () {
            if (fs.existsSync(logFile)) {
                fs.unlinkSync(logFile);
            }
        });
        
        beforeEach(function () {
            console.log = chai.spy(function (arg1) { originalConsoleLogArgument = arg1; });
        });

        afterEach(function () {
            console.log = originalConsoleLog;
            originalConsoleLogArgument = '';
        });
        
        it('should not throw an error setting logging to console to false', function () {
            function doNotWriteToConsole() {
                mLogger.writeToConsole(false);
            }
            
            expect(doNotWriteToConsole).not.to.throw();
        });
        
        it('should not throw an error setting logging to files to true', function () {
            function doWriteToFile() {
                mLogger.writeToFile(true);
            }
            
            expect(doWriteToFile).not.to.throw();
        });
        
        it('should work setting the logfile to a new file', function () {
            function doSetFile() {
                mLogger.setLogFile(logFile);
            }

            expect(doSetFile).not.to.throw();
        });
        
        it('should throw an exception logging errors', function () {
            function doLogError() {
                mLogger.error('fileError');
            }
            
            expect(doLogError).to.throw();
            expect(console.log).not.to.be.called();
        });
        
        it('should not throw an exception logging warnings', function () {
            function doLogWarning() {
                mLogger.warning('fileWarning');
            }
            
            expect(doLogWarning).not.to.throw();
            expect(console.log).not.to.be.called();
        });
        
        it('should not throw an exception logging warnings', function () {
            function doLogLog() {
                mLogger.log('fileLog');
            }
            
            expect(doLogLog).not.to.throw();
            expect(console.log).not.to.be.called();
        });
        
        it('should not throw an exception logging warnings', function () {
            function doLogDebug() {
                mLogger.debug('fileDebug');
            }
            
            expect(doLogDebug).not.to.throw();
            expect(console.log).not.to.be.called();
        });
        
        it('should exist a logfile', function() {
            var exists = fs.existsSync(logFile);
            
            expect(exists).to.be.true();
        });
        
        it('should contain all logged lines', function () {
            var lines = fs.readFileSync(logFile).toString().split('\n'),
                errorMsgRegex = /^\[ERROR\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) fileError$/,
                warningMsgRegex = /^\[WARNING\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) fileWarning/,
                logMsgRegex = /^\[LOG\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) fileLog$/,
                debugMsgRegex = /^\[DEBUG\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) fileDebug/;

            expect(lines.length).to.equal(5);
            expect(lines[0]).to.match(errorMsgRegex);
            expect(lines[1]).to.match(warningMsgRegex);
            expect(lines[2]).to.match(logMsgRegex);
            expect(lines[3]).to.match(debugMsgRegex);
        });
    });
    
    describe('Limiting the updates to only apply over minimum log level', function () {
        var originalConsoleLog = console.log,
            originalConsoleLogArgument = '';
        
        function doAllLoggings() {
            try {
                mLogger.debug('debug');
                mLogger.log('log');
                mLogger.warning('warning');
                mLogger.error('error');
            }
            catch (e) {
                // do nothing, because mLogger.error throws the error
            }
        }
        
        beforeEach(function () {
            console.log = chai.spy(function (arg1) { originalConsoleLogArgument = arg1; });
        });

        afterEach(function () {
            console.log = originalConsoleLog;
            originalConsoleLogArgument = '';
        });
        
        before(function () {
            mLogger.writeToConsole(true);
            mLogger.writeToFile(false);
        });
        
        it('should have 5 options on the log level enum', function () {
            var eRef = mLogger.logLevelEnum,
                enumCount = Object.getOwnPropertyNames(eRef).length;
            
            expect(enumCount).to.equal(5);
            expect(eRef.ALL).not.to.be.undefined();
            expect(eRef.DEBUG).not.to.be.undefined();
            expect(eRef.LOG).not.to.be.undefined();
            expect(eRef.WARNING).not.to.be.undefined();
            expect(eRef.ERROR).not.to.be.undefined();
        });
        
        it('should log all logs then minLogLevel = ALL', function () {
            mLogger.setMinimumLogLevel(mLogger.logLevelEnum.ALL);
            
            doAllLoggings();
            
            expect(console.log).to.be.called.exactly(4);
        });
        
        it('should log all logs then minLogLevel = DEBUG', function () {
            mLogger.setMinimumLogLevel(mLogger.logLevelEnum.DEBUG);
            
            doAllLoggings();
            
            expect(console.log).to.be.called.exactly(4);
        });
        
        it('should not log all logs then minLogLevel = LOG', function () {
            mLogger.setMinimumLogLevel(mLogger.logLevelEnum.LOG);
            
            doAllLoggings();
            
            expect(console.log).to.be.called.exactly(3);
        });
        
        it('should not log all logs then minLogLevel = WARNING', function () {
            mLogger.setMinimumLogLevel(mLogger.logLevelEnum.WARNING);
            
            doAllLoggings();
            
            expect(console.log).to.be.called.exactly(2);
        });
        
        it('should not log all logs then minLogLevel = ERROR', function () {
            mLogger.setMinimumLogLevel(mLogger.logLevelEnum.ERROR);
            
            doAllLoggings();
            
            expect(console.log).to.be.called.exactly(1);
        });
    });
    
    describe('Logging an object should inspect it to a string', function () {
        var originalConsoleLog = console.log,
            originalConsoleLogArgument = '';
        
        beforeEach(function () {
            console.log = chai.spy(function (arg1) { originalConsoleLogArgument = arg1; });
        });

        afterEach(function () {
            console.log = originalConsoleLog;
            originalConsoleLogArgument = '';
        });
        
        before(function () {
            mLogger.writeToConsole(true);
            mLogger.writeToFile(false);
            mLogger.setMinimumLogLevel(mLogger.logLevelEnum.ALL);
        });
        
        it('should stringify the logged object', function () {
            var debugMsgRegex = /^\[DEBUG\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) { test: 'success' }/;
            
            function doLogObject() {
                mLogger.debug({test: 'success'});
            }
            
            expect(doLogObject).not.to.throw();
            expect(originalConsoleLogArgument).to.match(debugMsgRegex);
        });
    });
    
    describe('Logging an object should inspect it to a string', function () {
        var originalConsoleLog = console.log,
            originalConsoleLogArgument = '';
        
        beforeEach(function () {
            console.log = chai.spy(function (arg1) { originalConsoleLogArgument = arg1; });
        });

        afterEach(function () {
            console.log = originalConsoleLog;
            originalConsoleLogArgument = '';
        });
        
        before(function () {
            mLogger.writeToConsole(true);
            mLogger.writeToFile(false);
            mLogger.setMinimumLogLevel(mLogger.logLevelEnum.ALL);
        });
        
        it('should stringify the logged object', function () {
            var debugMsgRegex = /^\[DEBUG\]\(\d{1,2}.\d{1,2}.\d{4} \d{1,2}:\d{1,2}:\d{1,2}\) { test: 'success' }/;
            
            function doLogObject() {
                mLogger.debug({test: 'success'});
            }
            
            expect(doLogObject).not.to.throw();
            expect(originalConsoleLogArgument).to.match(debugMsgRegex);
        });
    });
});
