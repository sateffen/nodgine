/**
 * This is the Logger API for the nodgine module
 *
 * @module nodgine
 * @submodule $LOGGER
 * @class $LOGGER
 * @static
 **/

/**
 * The exporting object, which gets revealed
 *
 * @type {object}
 **/
var EXPORTOBJECT = {},

    /**
     * A reference to the fs-module
     *
     * @private
     * @type {mFs}
     **/
    mFs = require('fs'),

    /**
     * The name of logfile, where to save all logs
     *
     * @private
     * @type {string}
     * @default 'Log.txt'
     **/
    mLogFile = 'Log.txt',

    /**
     * Flag, whether logs should be written to the logfile
     *
     * @private
     * @type {boolean}
     * @default false
     **/
    mToFile = false,

    /**
     * Flag, whether logs should be written to console
     *
     * @private
     * @type {boolean}
     * @default boolean
     **/
    mToConsole = true,

    /**
     * An enum that contains all log level hardnesses
     *
     * @private
     * @type {Object}
     */
    mLogLevelEnum = {
        'ALL': 0,
        'DEBUG': 1,
        'LOG': 2,
        'WARNING': 3,
        'ERROR': 4
    },

    /**
     * The minimum log level to filter log messages
     *
     * @private
     * @type {Number}
     */
    mMinimumLogLevel = mLogLevelEnum['ALL'],

    /**
    * A reference to the util-module
    *
    * @private
    * @type {mUtil}
    **/
    mUtil = require('util');

/**
 * This function generates a readable timestamp of current time for the log
 *
 * @private
 * @return {string} readable timestamp of current time
 */
function mGetDateString() {
    'use strict';
    // generate a current date
    var d = new Date();
    // return a date string, looking like (dd.mm.yyy HH:MM:SS)
    return d.getDate() + '.' +
        (d.getMonth()+1) + '.' +
        d.getFullYear() + ' ' +
        d.getHours() + ':' + 
        ((d.getMinutes().toString().length>1) ? d.getMinutes() : '0' + d.getMinutes()) + ':' + 
        ((d.getSeconds().toString().length>1) ? d.getSeconds() : '0' + d.getSeconds());
}

function mGetMessageString(aState, aMessage) {
    return '[' + aState + '](' + mGetDateString() + ') '+ aMessage;
}

/**
 * This is the general function which is connected to all incoming errors to work with them
 *
 * @private
 * @chainable
 * @param {string} aState State of given error
 * @param {boolean} aCritical Is critical or not. If it's critical, an error will be thrown
 * @param {any} aMessage The message for the log
 */
function mEnterLog(aState, aCritical, aMessage) {
    'use strict';

    // if loglevel is unknown, or lower than minimum log-level, ignore this message
    if (!mLogLevelEnum[aState] || mLogLevelEnum[aState] < mMinimumLogLevel) {
        return;
    }

    // convert message to string, if it's not a string
    if (typeof aMessage!== 'string') {
        aMessage = mUtil.inspect(aMessage);
    }

    // if it should be written to the file, append it
    if (mToFile) {
        var encoding = (process.versions.uv === '0.8') ? 'utf8' : {encoding: 'utf8'};
        mFs.appendFile(mLogFile, mGetMessageString(aState, aMessage) + '\n', encoding, function (error) {
            if (error) {
                throw new Error('$LOGGER tried to append file, but got error: ' + error);
            }
        });
    }

    // if it should be written to the console, do it
    if (mToConsole) {
        console.log(mGetMessageString(aState, aMessage));
    }

    // if it's critical, throw an error
    if (aCritical) {
        throw new Error('[' + aState + '](' + mGetDateString() + ') '+ aMessage);
    }

    return EXPORTOBJECT;
}

/**
 * With this function you can set the log file
 *
 * @chainable
 * @method setLogFile
 * @param {string} aFilename The file, in which logentrys should be written, if writeToFile(true) is set. This path
 * should be absolute
 * @return {object} The instance itself
 */
function mSetLogFile(aFilename) {
    'use strict';
    mLogFile = aFilename;
    return EXPORTOBJECT;
}

/**
 * with this function you can set writing to file on or off
 *
 * @chainable
 * @method writeToFile
 * @param {boolean} aOption Whether or not logentrys should be written to a file
 * @return {object} The instance itself
 */
function mWriteToFile(aOption) {
    'use strict';
    mToFile = !!(aOption);
    return EXPORTOBJECT;
}

/**
 * with this function you can set writing to console on or off
 *
 * @chainable
 * @method writeToConsole
 * @param {boolean} aOption whether or not logentrys should be written to the console
 * @return {object} The instance itself
 */
function mWriteToConsole(aOption) {
    'use strict';
    mToConsole = !!(aOption);
    return EXPORTOBJECT;
}

/**
 * Sets the minimum log-level
 *
 * @chainable
 * @method setMinimumLogLevel
 * @param {string|number} aMinLogLevel
 * @returns {Object} The instance itself
 */
function mSetMinimumLogLevel(aMinLogLevel) {
    if (typeof aMinLogLevel === 'string') {
        aMinLogLevel = mLogLevelEnum[aMinLogLevel];
    }

    for (var x in mLogLevelEnum) {
        if (mLogLevelEnum.hasOwnProperty(x) && mLogLevelEnum[x] === aMinLogLevel) {
            mMinimumLogLevel = aMinLogLevel;
        }
    }

    return EXPORTOBJECT;
}

/**
 * This is the bind function, bind to enterLog
 *
 * @chainable
 * @method error
 * @param {string} aMessage The message for the log
 */
var mError = mEnterLog.bind(null, 'ERROR', true);

/**
 * This is the bind function, bind to enterLog
 *
 * @chainable
 * @method warning
 * @param {string} aMessage The message for the log
 */
var mWarning = mEnterLog.bind(null, 'WARNING', false);

/**
 * This is the bind function, bind to enterLog
 *
 * @chainable
 * @method log
 * @param {string} aMessage The message for the log
 */
var mLog = mEnterLog.bind(null, 'LOG', false);

/**
 * This is the bind function, bind to enterLog
 *
 * @chainable
 * @method log
 * @param {string} aMessage The message for the log
 */
var mDebug = mEnterLog.bind(null, 'DEBUG', false);

// extend EXPORTOBJECT with all properties to reveal
Object.defineProperties(EXPORTOBJECT, {
    'error': {
        value: mError,
        enumerable: true
    },
    'warning': {
        value: mWarning,
        enumerable: true
    },
    'log': {
        value: mLog,
        enumerable: true
    },
    'debug': {
        value: mDebug,
        enumerable: true
    },
    'setLogFile': {
        value: mSetLogFile,
        enumerable: true
    },
    'writeToFile': {
        value: mWriteToFile,
        enumerable: true
    },
    'writeToConsole': {
        value: mWriteToConsole,
        enumerable: true
    },
    'logLevelEnum': {
        value: mLogLevelEnum,
        enumerable: true
    },
    'setMinimumLogLevel': {
        value: mSetMinimumLogLevel,
        enumerable: true
    }
});

module.exports = EXPORTOBJECT;