/**
 * This is the Logger API for the nodgine module
 *
 * @module nodgine
 * @submodule $LOGGER
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
     * @type {fs}
     **/
    fs = require('fs'),
    logFile = 'Log.txt',
    toFile = false,
    toConsole = true;

/**
 * This function generates a readable timestamp for the log
 *
 * @private
 * @returns {string} readable timestamp
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
 * @param {string} aState State of given error
 * @param {boolean} aCritical Is critical or not
 * @param {string} aMessage The message for the log
 */
function enterLog(aState, aCritical, aMessage) {
    'use strict';
    if (typeof aMessage!== 'string') {
        throw 'Logger needs a string as param, got ' + (typeof aMessage);
    }
    if (toFile) {
        fs.appendFileSync(logFile, '[' + aState + '](' + getDateString() + ') '+ aMessage + '\n', {encoding: 'utf-8'});
    }
    if (toConsole) {
        console.log('[' + aState + '](' + getDateString() + ') '+ aMessage);
    }
    if (aCritical) {
        throw new Error('[' + aState + '](' + getDateString() + ') '+ aMessage);
    }
}

/**
 * With this function you can set the log file
 *
 * @chainable
 * @param {string} aFilename
 * @return {object} The instance itself
 */
function setLogFile(aFilename) {
    'use strict';
    logFile = aFilename;
    return EXPORTOBJECT;
}

/**
 * with this function you can set writing to file on or off
 *
 * @chainable
 * @param {boolean} aOption
 * @return {object} The instance itself
 */
function writeToFile(aOption) {
    'use strict';
    toFile = !!(aOption);
    return EXPORTOBJECT;
}

/**
 * with this function you can set writing to console on or off
 *
 * @chainable
 * @param {boolean} aOption
 * @return {object} The instance itself
 */
function writeToConsole(aOption) {
    'use strict';
    toConsole = !!(aOption);
    return EXPORTOBJECT;
}


Object.defineProperty(EXPORTOBJECT, 'error', {
    value: enterLog.bind(null, 'ERROR', true),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'warning', {
    value: enterLog.bind(null, 'WARNING', false),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'log', {
    value: enterLog.bind(null, 'LOG', false),
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