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
function mGetDateString() {
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
function mEnterLog(aState, aCritical, aMessage) {
    'use strict';
    if (typeof aMessage!== 'string') {
        throw '$LOGGER: First param needs to be a string, got ' + (typeof aMessage);
    }
    if (mToFile) {
        mFs.appendFileSync(mLogFile, '[' + aState + '](' + mGetDateString() + ') '+ aMessage + '\n', {encoding: 'utf-8'});
    }
    if (mToConsole) {
        console.log('[' + aState + '](' + mGetDateString() + ') '+ aMessage);
    }
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

// extend EXPORTOBJECT with all properties to reveal
Object.defineProperties(EXPORTOBJECT, {
    'error': {
        value: mError
    },
    'warning': {
        value: mWarning
    },
    'log': {
        value: mLog
    },
    'setLogFile': {
        value: mSetLogFile
    },
    'writeToFile': {
        value: mWriteToFile
    },
    'writeToConsole': {
        value: mWriteToConsole
    }
});

module.exports = EXPORTOBJECT;