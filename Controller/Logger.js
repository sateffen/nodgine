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
    mToConsole = true;

/**
 * This function generates a readable timestamp of current time for the log
 *
 * @private
 * @return {string} readable timestamp of current time
 */
function getDateString() {
    'use strict';
    var d = new Date();
    return d.getDate() + '.' +
        (d.getMonth()+1) + '.' +
        d.getFullYear() + ' ' +
        d.getHours() + ':' + 
        ((d.getMinutes().toString().length>1) ? d.getMinutes() : '0' + d.getMinutes()) + ':' + 
        ((d.getSeconds().toString().length>1) ? d.getSeconds() : '0' + d.getSeconds());
}

/**
 * This is the general function which is connected to all incoming errors to work with them
 *
 * @private
 * @chainable
 * @param {string} aState State of given error
 * @param {boolean} aCritical Is critical or not. If it's critical, an error will be thrown
 * @param {string} aMessage The message for the log
 */
function enterLog(aState, aCritical, aMessage) {
    'use strict';
    if (typeof aMessage!== 'string') {
        throw '$LOGGER: First param needs to be a string, got ' + (typeof aMessage);
    }
    if (mToFile) {
        mFs.appendFileSync(mLogFile, '[' + aState + '](' + getDateString() + ') '+ aMessage + '\n', {encoding: 'utf-8'});
    }
    if (mToConsole) {
        console.log('[' + aState + '](' + getDateString() + ') '+ aMessage);
    }
    if (aCritical) {
        throw new Error('[' + aState + '](' + getDateString() + ') '+ aMessage);
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
function setLogFile(aFilename) {
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
function writeToFile(aOption) {
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
function writeToConsole(aOption) {
    'use strict';
    mToConsole = !!(aOption);
    return EXPORTOBJECT;
}

/**
 * This is the bind function, bind to enterLog
 *
 * @chainable
 * @method error
 * @param {string} aMessage The message for the log
 */
var error = enterLog.bind(null, 'ERROR', true);

/**
 * This is the bind function, bind to enterLog
 *
 * @chainable
 * @method warning
 * @param {string} aMessage The message for the log
 */
var warning = enterLog.bind(null, 'WARNING', false);

/**
 * This is the bind function, bind to enterLog
 *
 * @chainable
 * @method log
 * @param {string} aMessage The message for the log
 */
var log = enterLog.bind(null, 'LOG', false);

Object.defineProperty(EXPORTOBJECT, 'error', {
    value: error,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'warning', {
    value: warning,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'log', {
    value: log,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'setLogFile', {
    value: setLogFile,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'writeToFile', {
    value: writeToFile,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'writeToConsole', {
    value: writeToConsole,
    writable: false
});

module.exports = EXPORTOBJECT;