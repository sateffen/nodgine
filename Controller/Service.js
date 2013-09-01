
var registeredServices = [];

/**
 * deletes all registered services
 * 
 * @event servicesCleared []
 */
function clearServices() {
    "use strict";
    registeredServices = [];
    EXPORTOBJECT.emit("servicesCleared");
}

/**
 * Returns all services with the given type in an array
 * 
 * @param type string
 * @returns array
 */
function getService(type) {
    "use strict";
    if (typeof type !== "string") {
        throw "i need a string";
    }
    type = type.toLowerCase();
    var returnArray = [];
    for (var i in registeredServices) {
        if (registeredServices[i] && registeredServices[i].type == type) {
            returnArray.push(registeredServices[i]);
        }
    }
    
    return returnArray;
}

/**
 * Returns the service connected to given id
 * 
 * @param id number
 * @returns function || null
 */
function getServiceById(id) {
    "use strict";
    if (typeof id === "number" && registeredServices && registeredServices[id]) {
        return registeredServices[id];
    }
    return null;
}

/**
 * Registers given controller as new service from given type, returns the generated id
 * 
 * @event serviceRegistered [string, number]
 * @param type          string
 * @param controller    function
 * @returns number
 */
function registerService(type, controller) {
    "use strict";
    // TODO: verify type and controller
    var id = registeredServices.push({})-1;
    Object.defineProperty(registeredServices[id], "type", {
        value: type.toLowerCase(),
        writable: false
    });
    Object.defineProperty(registeredServices[id], "controller", {
        value: controller,
        writable: false
    });
    Object.defineProperty(registeredServices[id], "id", {
        value: id,
        writable: false
    });
    
    EXPORTOBJECT.emit("serviceRegistered", type, id);
    return id;
}

/**
 * Unregisters the service connected to given id
 * 
 * @event serviceUnregistered [string, number]
 * @param id number
 */
function unregisterService(id) {
    "use strict";
    if (typeof id === "number" && registeredServices && registeredServices[id]) {
        EXPORTOBJECT.emit("serviceUnregistered", registeredServices[id].type, id);
        registeredServices[id] = null;
    }
}

var EXPORTOBJECT = new (require("events").EventEmitter)();
Object.defineProperty(EXPORTOBJECT, "getService", {
    value: getService,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "getServiceById", {
    value: getServiceById,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "registerService", {
    value: registerService,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "unregisterService", {
    value: unregisterService,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "clearServices", {
    value: clearServices,
    writable: false
});

module.exports = EXPORTOBJECT;