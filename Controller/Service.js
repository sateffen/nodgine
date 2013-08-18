
var registeredServices = [];

function getService(type) {
    "use strict";
    var returnArray = [];
    for (var i in registeredServices) {
        if (registeredServices[i] && registeredServices[i].type == "type") {
            returnArray.push(registeredServices[i]);
        }
    }
    
    return returnArray;
}

function getServiceById(id) {
    "use strict";
    if (typeof id === "number" && registeredService && registeredService[id]) {
        return registeredService[id];
    }
    return null;
}

function registerService(type, controller) {
    "use strict";
    // TODO: verify type and controller
    var service = {};
    Object.defineProperty(serivce, "type", {
        value: type.toLowerCase(),
        writable: false
    });
    Object.defineProperty(serivce, "controller", {
        value: controller,
        writable: false
    });
    var id = registeredServices.push(service)-1;
    Object.defineProperty(serivce, "id", {
        value: id,
        writable: false
    });
    
    EXPORTOBJECT.emit("serviceRegistered", type, id);
    return id;
}

function unregisterService(id) {
    "use strict";
    if (typeof id === "number" && registeredService && registeredService[id]) {
        EXPORTOBJECT.emit("serviceUnregistered", registeredService[id].type, id);
        registeredService[id] = null;
    }
}

var EXPORTOBJECT = new require("events").EventEmitter();
Object.defineProperty(EXPORTOBJECT, "getService", {
    value: getService,
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

Object.preventExtensions(EXPORTOBJECT);
module.exports = EXPORTOBJECT;