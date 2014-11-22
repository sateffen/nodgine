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

        beforeEach(function () {
            console.log = chai.spy(function (arg1) { originalConsoleLogArgument = arg1; });
        });

        afterEach(function () {
            console.log = originalConsoleLog;
            originalConsoleLogArgument = '';
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

});
