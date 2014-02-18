/**
 * This is the Service API for the nodgine module
 *
 * @module nodgine
 * @submodule $SERVICE
 * @class $SERVICE
 * @static
 **/

/**
 * The exporting object, which gets revealed
 *
 * @type {object}
 **/
var EXPORTOBJECT = new (require('events').EventEmitter)(),

    /**
     * A list of all registered services
     *
     * @private
     * @type {Array}
     **/
    registeredServices = [];

/**
 * deletes all registered services
 *
 * @chainable
 * @method clearServices
 * @event servicesCleared []
 * @return {object} The instance itself
 */
function clearServices() {
    'use strict';
    registeredServices = [];
    EXPORTOBJECT.emit('servicesCleared');
    return EXPORTOBJECT;
}

/**
 * Returns all services with the given type in an array
 *
 * @method getService
 * @param {string} aType
 * @return {Array}
 */
function getService(aType) {
    'use strict';
    if (typeof aType !== 'string') {
        throw 'i need a string';
    }
    aType = aType.toLowerCase();
    var returnArray = [];
    for (var i in registeredServices) {
        if (registeredServices[i] && registeredServices[i].type === aType) {
            returnArray.push(registeredServices[i]);
        }
    }
    
    return returnArray;
}

/**
 * Returns the service connected to given id
 *
 * @method getServiceById
 * @param {number} aId
 * @returns {function || null}
 */
function getServiceById(aId) {
    'use strict';
    if (typeof aId === 'number' && registeredServices && registeredServices[aId]) {
        return registeredServices[aId];
    }
    return null;
}

/**
 * Registers given controller as new service from given type, returns the generated id
 *
 * @method registerService
 * @event serviceRegistered [string, number]
 * @param {string} aType
 * @param {function} aController
 * @return {number}
 */
function registerService(aType, aController) {
    'use strict';
    // TODO: verify type and controller
    var id = registeredServices.push({})-1;
    Object.defineProperty(registeredServices[id], 'type', {
        value: aType.toLowerCase(),
        writable: false
    });
    Object.defineProperty(registeredServices[id], 'controller', {
        value: aController,
        writable: false
    });
    Object.defineProperty(registeredServices[id], 'id', {
        value: id,
        writable: false
    });
    
    EXPORTOBJECT.emit('serviceRegistered', aType, id);
    return id;
}

/**
 * Unregisters the service connected to given id
 *
 * @method unregisterService
 * @event serviceUnregistered [string, number]
 * @param {number} aId
 * @return {object} This instance itself
 */
function unregisterService(aId) {
    'use strict';
    if (typeof aId === 'number' && registeredServices && registeredServices[aId]) {
        EXPORTOBJECT.emit('serviceUnregistered', registeredServices[aId].type, aId);
        registeredServices[aId] = null;
    }
    return EXPORTOBJECT;
}

Object.defineProperty(EXPORTOBJECT, 'getService', {
    value: getService,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'getServiceById', {
    value: getServiceById,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'registerService', {
    value: registerService,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'unregisterService', {
    value: unregisterService,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'clearServices', {
    value: clearServices,
    writable: false
});

module.exports = EXPORTOBJECT;