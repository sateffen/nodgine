/**
 * This is the bootstrap for the nodgine module
 *
 * @module nodgine
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
    "use strict";
    Object.defineProperty(GLOBAL, "$APPLICATION", {
        value   : require("./Controller/Application.js"),
        writable: false
    });
    Object.defineProperty(GLOBAL, "$ROUTER", {
        value   : require("./Controller/Router.js"),
        writable: false
    });
    Object.defineProperty(GLOBAL, "$LOGGER", {
        value   : require("./Controller/Logger.js"),
        writable: false
    });
    Object.defineProperty(GLOBAL, "$SERVICE", {
        value   : require("./Controller/Service.js"),
        writable: false
    });
}

//region revealing object
Object.defineProperty(EXPORTOBJECT, "$APPLICATION", {
    value   : require("./Controller/Application.js"),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "$ROUTER", {
    value   : require("./Controller/Router.js"),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "$LOGGER", {
    value   : require("./Controller/Logger.js"),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "$SERVICE", {
    value   : require("./Controller/Service.js"),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "globalize", {
    value   : globalize,
    writable: false
});
//endregion

module.exports = EXPORTOBJECT;