
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

var EXPORTOBJECT = {};
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
Object.defineProperty(EXPORTOBJECT, "$SERVICE", {
    value   : globalize,
    writable: false
});

module.exports = EXPORTOBJECT;