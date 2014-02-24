/**
 * This is the bootstrap for the nodgine module
 *
 * @module nodgine
 * @main
 * @class nodgine
 * @static
 **/

/**
 * The exporting object, which gets revealed
 *
 * @type {object}
 **/
var EXPORTOBJECT = {};

/**
 * This function makes the APIs of this framework global
 *
 * @method globalize
 **/
function globalize() {
    'use strict';
    Object.defineProperty(GLOBAL, '$APPLICATION', {
        value   : require('./Controller/Application.js'),
        writable: false
    });
    Object.defineProperty(GLOBAL, '$ROUTER', {
        value   : require('./Controller/Router.js'),
        writable: false
    });
    Object.defineProperty(GLOBAL, '$LOGGER', {
        value   : require('./Controller/Logger.js'),
        writable: false
    });
    Object.defineProperty(GLOBAL, '$SERVICE', {
        value   : require('./Controller/Service.js'),
        writable: false
    });
}

//region revealing object
/**
 * An instance of $APPLICATION
 *
 * @property $APPLICATION
 * @type {$APPLICATION}
 **/
Object.defineProperty(EXPORTOBJECT, '$APPLICATION', {
    value   : require('./Controller/Application.js'),
    writable: false
});

/**
 * An instance of $ROUTER
 *
 * @property $ROUTER
 * @type {$ROUTER}
 **/
Object.defineProperty(EXPORTOBJECT, '$ROUTER', {
    value   : require('./Controller/Router.js'),
    writable: false
});

/**
 * An instance of $LOGGER
 *
 * @property $LOGGER
 * @type {$LOGGER}
 **/
Object.defineProperty(EXPORTOBJECT, '$LOGGER', {
    value   : require('./Controller/Logger.js'),
    writable: false
});

/**
 * An instance of $SERVICE
 *
 * @property $SERVICE
 * @type {$SERVICE}
 **/
Object.defineProperty(EXPORTOBJECT, '$SERVICE', {
    value   : require('./Controller/Service.js'),
    writable: false
});

// define all other things
Object.defineProperty(EXPORTOBJECT, 'globalize', {
    value   : globalize,
    writable: false
});
//endregion

module.exports = EXPORTOBJECT;