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
function mGlobalize() {
    'use strict';
    Object.defineProperties(GLOBAL, {
        '$APPLICATION': {
            value   : require('./Controller/Application.js')
        },
        '$ROUTER': {
            value   : require('./Controller/Router.js')
        },
        '$LOGGER': {
            value   : require('./Controller/Logger.js')
        },
        '$SERVICE': {
            value   : require('./Controller/Service.js')
        }
    });
}

//region revealing object

Object.defineProperties(GLOBAL, {

    /**
     * An instance of $APPLICATION
     *
     * @property $APPLICATION
     * @type {$APPLICATION}
     **/
    '$APPLICATION': {
        value   : require('./Controller/Application.js')
    },

    /**
     * An instance of $ROUTER
     *
     * @property $ROUTER
     * @type {$ROUTER}
     **/
    '$ROUTER': {
        value   : require('./Controller/Router.js')
    },

    /**
     * An instance of $LOGGER
     *
     * @property $LOGGER
     * @type {$LOGGER}
     **/
    '$LOGGER': {
        value   : require('./Controller/Logger.js')
    },

    /**
     * An instance of $SERVICE
     *
     * @property $SERVICE
     * @type {$SERVICE}
     **/
    '$SERVICE': {
        value   : require('./Controller/Service.js')
    },

    // define the rest
    'globalize': {
        value   : mGlobalize
    }
});

module.exports = EXPORTOBJECT;