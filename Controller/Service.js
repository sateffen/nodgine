
var registeredServices = [];

function clearServices() {
    "use strict";
    registeredServices = [];
}

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

function getServiceById(id) {
    "use strict";
    if (typeof id === "number" && registeredServices && registeredServices[id]) {
        return registeredServices[id];
    }
    return null;
}

function registerService(type, controller) {
    "use strict";
    // TODO: verify type and controller
    var service = {};
    Object.defineProperty(service, "type", {
        value: type.toLowerCase(),
        writable: false
    });
    Object.defineProperty(service, "controller", {
        value: controller,
        writable: false
    });
    var id = registeredServices.push(service)-1;
    Object.defineProperty(service, "id", {
        value: id,
        writable: false
    });
    
    EXPORTOBJECT.emit("serviceRegistered", type, id);
    return id;
}

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